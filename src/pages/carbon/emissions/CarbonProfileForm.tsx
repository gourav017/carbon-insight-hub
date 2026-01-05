import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CarbonCompanyProfile } from "@/types/carbon";

const CarbonProfileForm = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue, watch, reset } = useForm<CarbonCompanyProfile>({
        defaultValues: {
            isBaseline: true,
            hasTarget: false,
            dataQuality: "balanced"
        }
    });

    const hasTarget = watch("hasTarget");

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Try to fetch existing organization for this user
                const { data: orgs, error } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('created_by', user.id)
                    .single();

                if (orgs) {
                    setValue("name", orgs.name);
                    setValue("industry", orgs.industry as any);
                    setValue("employees", parseInt(orgs.size || "0")); // simplistic mapping
                    // Ideally we would have more fields in organizations table or a separate carbon_profile table
                }
            }
        };
        loadData();
    }, [setValue]);

    const onSubmit = async (data: CarbonCompanyProfile) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Authentication Required",
                    description: "Please log in to save your profile.",
                    variant: "destructive",
                });
                // For demo purposes, we might allow proceeding without saving
                // navigate("/carbon-emissions/scope1"); 
                setLoading(false);
                return;
            }

            // 1. Upsert Organization
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .upsert({
                    name: data.name,
                    industry: data.industry,
                    size: data.employees.toString(),
                    created_by: user.id
                })
                .select()
                .single();

            if (orgError) throw orgError;

            // 2. Create/Update Carbon Emission Record (Draft)
            const { error: carbonError } = await supabase
                .from('carbon_emissions')
                .upsert({
                    organization_id: org.id,
                    user_id: user.id,
                    reporting_year: parseInt(data.reportingYear.toString()),
                    status: 'draft',
                    // We could store the rest of the profile data in a jsonb column if we added one, 
                    // or just rely on the organization data.
                });

            if (carbonError) throw carbonError;

            toast({
                title: "Profile Saved",
                description: "Your company profile has been successfully saved.",
            });

            navigate("/carbon-emissions/scope1");
        } catch (error: any) {
            console.error("Error saving profile:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to save profile.",
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
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
                    <p className="text-muted-foreground mb-8">Set up your organization details and reporting parameters.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Company Name</Label>
                                    <Input id="name" {...register("name", { required: true })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Industry</Label>
                                        <Select onValueChange={(v) => setValue("industry", v as any)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select industry" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="energy">Energy</SelectItem>
                                                <SelectItem value="materials">Materials</SelectItem>
                                                <SelectItem value="industrials">Industrials</SelectItem>
                                                <SelectItem value="it">Information Technology</SelectItem>
                                                <SelectItem value="financials">Financials</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="reportingYear">Reporting Year</Label>
                                        <Input id="reportingYear" type="number" {...register("reportingYear", { required: true })} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Reporting Boundary</Label>
                                    <RadioGroup onValueChange={(v) => setValue("boundary", v as any)} defaultValue="operational-control">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="operational-control" id="operational" />
                                            <Label htmlFor="operational">Operational Control</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="financial-control" id="financial" />
                                            <Label htmlFor="financial">Financial Control</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="equity-share" id="equity" />
                                            <Label htmlFor="equity">Equity Share</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Organizational Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="employees">Number of Employees</Label>
                                        <Input id="employees" type="number" {...register("employees", { required: true, valueAsNumber: true })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="revenue">Annual Revenue</Label>
                                        <Input id="revenue" type="number" {...register("revenue", { required: true, valueAsNumber: true })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="floorArea">Total Floor Area (sq m)</Label>
                                        <Input id="floorArea" type="number" {...register("floorArea", { valueAsNumber: true })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="facilities">Number of Facilities</Label>
                                        <Input id="facilities" type="number" {...register("facilities", { valueAsNumber: true })} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Baseline & Targets</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="isBaseline" onCheckedChange={(c) => setValue("isBaseline", c as boolean)} defaultChecked />
                                    <Label htmlFor="isBaseline">This is a baseline year</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="hasTarget" onCheckedChange={(c) => setValue("hasTarget", c as boolean)} />
                                    <Label htmlFor="hasTarget">Reduction target set?</Label>
                                </div>

                                {hasTarget && (
                                    <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-border">
                                        <div className="grid gap-2">
                                            <Label>Target Type</Label>
                                            <Select onValueChange={(v) => setValue("targetType", v as any)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="absolute">Absolute Reduction</SelectItem>
                                                    <SelectItem value="intensity">Intensity-based</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="targetPercentage">Target Percentage (%)</Label>
                                            <Input id="targetPercentage" type="number" {...register("targetPercentage", { valueAsNumber: true })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="targetYear">Target Year</Label>
                                            <Input id="targetYear" type="number" {...register("targetYear")} />
                                        </div>
                                        <div className="flex items-center space-x-2 mt-8">
                                            <Checkbox id="sbti" onCheckedChange={(c) => setValue("sbtiValidated", c as boolean)} />
                                            <Label htmlFor="sbti">SBTi Validated</Label>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
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

export default CarbonProfileForm;
