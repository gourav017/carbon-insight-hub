import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Info, Zap, Flame } from "lucide-react";
import { Scope2Data } from "@/types/carbon";
import { ELECTRICITY_GRID_FACTORS, THERMAL_FACTORS } from "@/lib/carbon/factors";

const Scope2Form = () => {
    const navigate = useNavigate();
    const { register, control, handleSubmit } = useForm<Scope2Data>({
        defaultValues: {
            electricity: [],
            marketBasedInstruments: [],
            thermal: []
        }
    });

    const { fields: electricityFields, append: appendElectricity, remove: removeElectricity } = useFieldArray({
        control,
        name: "electricity"
    });

    const { fields: marketFields, append: appendMarket, remove: removeMarket } = useFieldArray({
        control,
        name: "marketBasedInstruments"
    });

    const { fields: thermalFields, append: appendThermal, remove: removeThermal } = useFieldArray({
        control,
        name: "thermal"
    });

    const onSubmit = (data: Scope2Data) => {
        console.log(data);
        // TODO: Save data
        navigate("/carbon-emissions/scope3");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Scope 2: Indirect Energy</h1>
                    <p className="text-muted-foreground mb-8">
                        Calculate emissions from purchased electricity, steam, heating, and cooling.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <Tabs defaultValue="electricity" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="electricity">Purchased Electricity</TabsTrigger>
                                <TabsTrigger value="thermal">Purchased Thermal Energy</TabsTrigger>
                            </TabsList>

                            {/* Electricity */}
                            <TabsContent value="electricity">
                                <div className="space-y-6">
                                    {/* Location-Based */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-yellow-500" />
                                                    <span>Electricity Consumption (Location-Based)</span>
                                                </div>
                                                <Button type="button" variant="outline" size="sm" onClick={() => appendElectricity({ id: crypto.randomUUID(), consumption: 0, unit: "kwh", region: "IN" })}>
                                                    <Plus className="w-4 h-4 mr-2" /> Add Site/Meter
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-secondary/20 p-4 rounded-md mb-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Enter total electricity consumption for each facility. Select the appropriate grid region for accurate emission factors.
                                                </p>
                                            </div>

                                            {electricityFields.map((field, index) => (
                                                <div key={field.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg relative">
                                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeElectricity(index)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>

                                                    <div className="col-span-5">
                                                        <Label>Grid Region</Label>
                                                        <Controller
                                                            control={control}
                                                            name={`electricity.${index}.region`}
                                                            render={({ field }) => (
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select region" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="max-h-[300px]">
                                                                        {Object.keys(ELECTRICITY_GRID_FACTORS).map((region) => (
                                                                            <SelectItem key={region} value={region}>{region}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <Label>Consumption</Label>
                                                        <Input type="number" {...register(`electricity.${index}.consumption`, { valueAsNumber: true })} />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label>Unit</Label>
                                                        <Controller
                                                            control={control}
                                                            name={`electricity.${index}.unit`}
                                                            render={({ field }) => (
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="kwh">kWh</SelectItem>
                                                                        <SelectItem value="mwh">MWh</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Market-Based */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <span>Market-Based Instruments (Optional)</span>
                                                <Button type="button" variant="outline" size="sm" onClick={() => appendMarket({ id: crypto.randomUUID(), type: "rec", amount: 0, factor: 0 })}>
                                                    <Plus className="w-4 h-4 mr-2" /> Add Instrument
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-secondary/20 p-4 rounded-md mb-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Add RECs, PPAs, or Green Tariffs to calculate your market-based emissions.
                                                </p>
                                            </div>

                                            {marketFields.map((field, index) => (
                                                <div key={field.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg relative">
                                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeMarket(index)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>

                                                    <div className="col-span-4">
                                                        <Label>Instrument Type</Label>
                                                        <Controller
                                                            control={control}
                                                            name={`marketBasedInstruments.${index}.type`}
                                                            render={({ field }) => (
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="rec">REC (Renewable Energy Certificate)</SelectItem>
                                                                        <SelectItem value="ppa">PPA (Power Purchase Agreement)</SelectItem>
                                                                        <SelectItem value="green-tariff">Green Tariff</SelectItem>
                                                                        <SelectItem value="onsite-renewable">On-site Renewable</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <Label>Amount (kWh)</Label>
                                                        <Input type="number" {...register(`marketBasedInstruments.${index}.amount`, { valueAsNumber: true })} />
                                                    </div>
                                                    <div className="col-span-3">
                                                        <Label>Emission Factor (kg/kWh)</Label>
                                                        <Input type="number" {...register(`marketBasedInstruments.${index}.factor`, { valueAsNumber: true })} />
                                                        <p className="text-[10px] text-muted-foreground mt-1">Usually 0 for renewables</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Thermal */}
                            <TabsContent value="thermal">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Flame className="w-5 h-5 text-orange-500" />
                                                <span>Purchased Steam, Heating & Cooling</span>
                                            </div>
                                            <Button type="button" variant="outline" size="sm" onClick={() => appendThermal({ id: crypto.randomUUID(), type: "steam", consumption: 0, unit: "gj" })}>
                                                <Plus className="w-4 h-4 mr-2" /> Add Source
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {thermalFields.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg relative">
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeThermal(index)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="col-span-4">
                                                    <Label>Type</Label>
                                                    <Controller
                                                        control={control}
                                                        name={`thermal.${index}.type`}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="steam">Steam</SelectItem>
                                                                    <SelectItem value="district-heating">District Heating</SelectItem>
                                                                    <SelectItem value="district-cooling">District Cooling</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <Label>Consumption</Label>
                                                    <Input type="number" {...register(`thermal.${index}.consumption`, { valueAsNumber: true })} />
                                                </div>
                                                <div className="col-span-3">
                                                    <Label>Unit</Label>
                                                    <Controller
                                                        control={control}
                                                        name={`thermal.${index}.unit`}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="gj">GJ</SelectItem>
                                                                    <SelectItem value="mwh">MWh</SelectItem>
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
                        </Tabs>

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => navigate("/carbon-emissions/scope1")}>Back</Button>
                            <Button type="submit" size="lg">Save & Continue</Button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Scope2Form;
