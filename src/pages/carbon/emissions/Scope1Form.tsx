import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Info } from "lucide-react";
import { Scope1Data } from "@/types/carbon";
import { STATIONARY_FACTORS, MOBILE_DISTANCE_FACTORS, MOBILE_FUEL_FACTORS, PROCESS_FACTORS, FUGITIVE_GWP } from "@/lib/carbon/factors";
import { calculateScope1 } from "@/lib/carbon/scope1";

const Scope1Form = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const { register, control, handleSubmit, watch } = useForm<Scope1Data>({
        defaultValues: {
            stationary: [],
            mobileMethod: "distance",
            mobileDistance: [],
            mobileFuel: [],
            process: [],
            fugitive: []
        }
    });

    const { fields: stationaryFields, append: appendStationary, remove: removeStationary } = useFieldArray({
        control,
        name: "stationary"
    });

    const { fields: mobileDistanceFields, append: appendMobileDistance, remove: removeMobileDistance } = useFieldArray({
        control,
        name: "mobileDistance"
    });

    const { fields: mobileFuelFields, append: appendMobileFuel, remove: removeMobileFuel } = useFieldArray({
        control,
        name: "mobileFuel"
    });

    const { fields: processFields, append: appendProcess, remove: removeProcess } = useFieldArray({
        control,
        name: "process"
    });

    const { fields: fugitiveFields, append: appendFugitive, remove: removeFugitive } = useFieldArray({
        control,
        name: "fugitive"
    });

    const mobileMethod = watch("mobileMethod");

    const onSubmit = async (data: Scope1Data) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Authentication Required",
                    description: "Please log in to save your data.",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            // Calculate emissions
            const results = calculateScope1(data);

            // Find existing emission record or create new one
            // For simplicity, we'll assume there's one active draft record per user/org for the current year
            // In a real app, we'd probably pass the emission_id via URL or context

            // First get the organization
            const { data: org } = await supabase
                .from('organizations')
                .select('id')
                .eq('created_by', user.id)
                .single();

            if (!org) {
                throw new Error("Organization not found. Please complete the profile setup first.");
            }

            // Upsert emission record
            const { error } = await supabase
                .from('carbon_emissions')
                .upsert({
                    organization_id: org.id,
                    user_id: user.id,
                    status: 'draft',
                    scope1_total: results.total,
                    scope1_data: data as Record<string, unknown>, // Store the raw input data
                    // We should also update the total_emissions if we had scope 2/3 data, 
                    // but for now we'll just update scope 1
                }, { onConflict: 'organization_id, reporting_year' }); // This constraint might not exist, so we rely on RLS or logic

            // Note: The above upsert is a bit loose. Ideally we'd select the record by ID.
            // But for this POC, we'll try to find the latest draft or create one.

            // Better approach:
            const { data: existingRecord } = await supabase
                .from('carbon_emissions')
                .select('id')
                .eq('organization_id', org.id)
                .eq('status', 'draft')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (existingRecord) {
                await supabase
                    .from('carbon_emissions')
                    .update({
                        scope1_total: results.total,
                        scope1_data: data as Record<string, unknown>
                    })
                    .eq('id', existingRecord.id);
            } else {
                // Create new if doesn't exist (though Profile form should have created it)
                await supabase
                    .from('carbon_emissions')
                    .insert({
                        organization_id: org.id,
                        user_id: user.id,
                        status: 'draft',
                        scope1_total: results.total,
                        scope1_data: data as Record<string, unknown>,
                        reporting_year: new Date().getFullYear()
                    });
            }

            toast({
                title: "Data Saved",
                description: `Scope 1 emissions calculated: ${results.total.toFixed(2)} tCO2e`,
            });

            navigate("/carbon-emissions/scope2");
        } catch (error: unknown) {
            console.error("Error saving data:", error);
            toast({
                title: "Error",
                description: (error as Error).message || "Failed to save data.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Scope 1: Direct Emissions</h1>
                    <p className="text-muted-foreground mb-8">
                        Calculate emissions from sources owned or controlled by your organization.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <Tabs defaultValue="stationary" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="stationary">Stationary Combustion</TabsTrigger>
                                <TabsTrigger value="mobile">Mobile Combustion</TabsTrigger>
                                <TabsTrigger value="process">Process Emissions</TabsTrigger>
                                <TabsTrigger value="fugitive">Fugitive Emissions</TabsTrigger>
                            </TabsList>

                            {/* Stationary Combustion */}
                            <TabsContent value="stationary">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Stationary Sources</span>
                                            <Button type="button" variant="outline" size="sm" onClick={() => appendStationary({ id: crypto.randomUUID(), fuelType: "natural-gas", amount: 0, unit: "m3" })}>
                                                <Plus className="w-4 h-4 mr-2" /> Add Source
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-secondary/20 p-4 rounded-md mb-4 flex gap-3 items-start">
                                            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                Include all fuels used in boilers, furnaces, heaters, and turbines owned by the company.
                                            </p>
                                        </div>

                                        {stationaryFields.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg relative">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                                    onClick={() => removeStationary(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="col-span-4">
                                                    <Label>Fuel Type</Label>
                                                    <Controller
                                                        control={control}
                                                        name={`stationary.${index}.fuelType`}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select fuel" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Object.keys(STATIONARY_FACTORS).map((fuel) => (
                                                                        <SelectItem key={fuel} value={fuel}>
                                                                            {fuel.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>

                                                <div className="col-span-4">
                                                    <Label>Amount</Label>
                                                    <Input
                                                        type="number"
                                                        {...register(`stationary.${index}.amount`, { valueAsNumber: true })}
                                                    />
                                                </div>

                                                <div className="col-span-3">
                                                    <Label>Unit</Label>
                                                    <Controller
                                                        control={control}
                                                        name={`stationary.${index}.unit`}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Unit" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="m3">Cubic Meters (m³)</SelectItem>
                                                                    <SelectItem value="liters">Liters</SelectItem>
                                                                    <SelectItem value="tonnes">Tonnes</SelectItem>
                                                                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                                                    <SelectItem value="kwh-thermal">kWh (Thermal)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Mobile Combustion */}
                            <TabsContent value="mobile">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Mobile Sources</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <Label>Calculation Method</Label>
                                            <Controller
                                                control={control}
                                                name="mobileMethod"
                                                render={({ field }) => (
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="distance" id="distance" />
                                                            <Label htmlFor="distance">Distance-based</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="fuel" id="fuel" />
                                                            <Label htmlFor="fuel">Fuel-based</Label>
                                                        </div>
                                                    </RadioGroup>
                                                )}
                                            />
                                        </div>

                                        <Separator />

                                        {mobileMethod === "distance" ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-medium">Vehicle List</h3>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => appendMobileDistance({ id: crypto.randomUUID(), vehicleType: "passenger-gas", distance: 0, unit: "km" })}>
                                                        <Plus className="w-4 h-4 mr-2" /> Add Vehicle
                                                    </Button>
                                                </div>

                                                {mobileDistanceFields.map((field, index) => (
                                                    <div key={field.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg relative">
                                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeMobileDistance(index)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>

                                                        <div className="col-span-5">
                                                            <Label>Vehicle Type</Label>
                                                            <Controller
                                                                control={control}
                                                                name={`mobileDistance.${index}.vehicleType`}
                                                                render={({ field }) => (
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select vehicle" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {Object.keys(MOBILE_DISTANCE_FACTORS).map((type) => (
                                                                                <SelectItem key={type} value={type}>
                                                                                    {type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="col-span-4">
                                                            <Label>Distance</Label>
                                                            <Input type="number" {...register(`mobileDistance.${index}.distance`, { valueAsNumber: true })} />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Label>Unit</Label>
                                                            <Controller
                                                                control={control}
                                                                name={`mobileDistance.${index}.unit`}
                                                                render={({ field }) => (
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="km">km</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-medium">Fuel Consumption</h3>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => appendMobileFuel({ id: crypto.randomUUID(), fuelType: "gasoline", amount: 0, unit: "liters" })}>
                                                        <Plus className="w-4 h-4 mr-2" /> Add Fuel
                                                    </Button>
                                                </div>

                                                {mobileFuelFields.map((field, index) => (
                                                    <div key={field.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg relative">
                                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeMobileFuel(index)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>

                                                        <div className="col-span-5">
                                                            <Label>Fuel Type</Label>
                                                            <Controller
                                                                control={control}
                                                                name={`mobileFuel.${index}.fuelType`}
                                                                render={({ field }) => (
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select fuel" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {Object.keys(MOBILE_FUEL_FACTORS).map((type) => (
                                                                                <SelectItem key={type} value={type}>
                                                                                    {type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="col-span-4">
                                                            <Label>Amount</Label>
                                                            <Input type="number" {...register(`mobileFuel.${index}.amount`, { valueAsNumber: true })} />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Label>Unit</Label>
                                                            <Controller
                                                                control={control}
                                                                name={`mobileFuel.${index}.unit`}
                                                                render={({ field }) => (
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="liters">Liters</SelectItem>
                                                                            <SelectItem value="kg">kg</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Process Emissions */}
                            <TabsContent value="process">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Industrial Process Emissions</span>
                                            <Button type="button" variant="outline" size="sm" onClick={() => appendProcess({ id: crypto.randomUUID(), processType: "cement", amount: 0 })}>
                                                <Plus className="w-4 h-4 mr-2" /> Add Process
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-secondary/20 p-4 rounded-md mb-4 flex gap-3 items-start">
                                            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                Emissions from physical or chemical processing (e.g., cement manufacturing, aluminum smelting).
                                            </p>
                                        </div>

                                        {processFields.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg relative">
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeProcess(index)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="col-span-5">
                                                    <Label>Process Type</Label>
                                                    <Controller
                                                        control={control}
                                                        name={`process.${index}.processType`}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select process" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Object.keys(PROCESS_FACTORS).map((type) => (
                                                                        <SelectItem key={type} value={type}>
                                                                            {type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                                                        </SelectItem>
                                                                    ))}
                                                                    <SelectItem value="other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <Label>Production Amount (tonnes)</Label>
                                                    <Input type="number" {...register(`process.${index}.amount`, { valueAsNumber: true })} />
                                                </div>
                                                <div className="col-span-2">
                                                    <Label>Custom Factor (Optional)</Label>
                                                    <Input type="number" placeholder="tCO2e/t" {...register(`process.${index}.customFactor`, { valueAsNumber: true })} />
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Fugitive Emissions */}
                            <TabsContent value="fugitive">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Fugitive Emissions</span>
                                            <Button type="button" variant="outline" size="sm" onClick={() => appendFugitive({ id: crypto.randomUUID(), type: "refrigerant", gas: "R-134a", amount: 0 })}>
                                                <Plus className="w-4 h-4 mr-2" /> Add Source
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-secondary/20 p-4 rounded-md mb-4 flex gap-3 items-start">
                                            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                Emissions from leaks of greenhouse gases (e.g., refrigerants from AC units, fire suppression systems).
                                            </p>
                                        </div>

                                        {fugitiveFields.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg relative">
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeFugitive(index)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="col-span-4">
                                                    <Label>Gas / Refrigerant</Label>
                                                    <Controller
                                                        control={control}
                                                        name={`fugitive.${index}.gas`}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select gas" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Object.keys(FUGITIVE_GWP).map((gas) => (
                                                                        <SelectItem key={gas} value={gas}>{gas}</SelectItem>
                                                                    ))}
                                                                    <SelectItem value="other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <Label>Amount Leaked (kg)</Label>
                                                    <Input type="number" {...register(`fugitive.${index}.amount`, { valueAsNumber: true })} />
                                                </div>
                                                <div className="col-span-3">
                                                    <Label>Custom GWP (Optional)</Label>
                                                    <Input type="number" placeholder="GWP" {...register(`fugitive.${index}.gwp`, { valueAsNumber: true })} />
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => navigate("/carbon-emissions/profile")}>Back</Button>
                            <Button type="submit" size="lg" disabled={loading}>
                                {loading ? "Saving..." : "Save & Continue"}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Scope1Form;
