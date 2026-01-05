import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Leaf, Droplets, Zap, Recycle, ShieldAlert, Sprout } from "lucide-react";
import { EnvironmentalAssessment } from "@/types/esg";
import { saveAssessmentData, loadAssessmentData, setupAutoSave, saveSectionData } from "@/lib/esg/storage";
// ...

const onSubmit = (data: EnvironmentalAssessment) => {
  saveSectionData("environmental", data, true);
  navigate("/esg-assessment/social");
};
import { ProgressTracker } from "@/components/esg/ProgressTracker";
import { SaveProgressButton } from "@/components/esg/SaveProgressButton";

const environmentalSchema = z.object({
  // 2.1 GHG Emissions
  measurementLevel: z.enum(["all-three", "scope-1-2", "scope-1-only", "not-measured"]),
  scope1Emissions: z.coerce.number().min(0).optional(),
  scope2Emissions: z.coerce.number().min(0).optional(),
  scope3Emissions: z.coerce.number().min(0).optional(),
  hasReductionTargets: z.boolean(),
  targetType: z.enum(["sbti", "absolute", "intensity", "none"]).optional(),
  targetPercentage: z.coerce.number().min(0).max(100).optional(),
  targetYear: z.coerce.number().min(2024).optional(),
  currentProgress: z.coerce.number().min(0).max(100).optional(),
  scope3Categories: z.array(z.string()).optional(),

  // 2.2 Energy Management
  totalEnergyConsumption: z.coerce.number().min(0),
  energyConsumptionTrend: z.enum(["decreasing", "stable", "increasing"]).optional(),
  renewablePercentage: z.coerce.number().min(0).max(100),
  renewableSources: z.array(z.string()),
  energyManagementCertification: z.enum(["iso-50001", "in-progress", "planned", "not-planned"]),
  energyEfficiencyPrograms: z.enum(["comprehensive", "limited", "no"]), // Kept for compatibility/simplicity

  // 2.3 Water & Waste
  totalWaterWithdrawal: z.coerce.number().min(0),
  operationsInWaterStressed: z.enum(["yes", "no"]),
  waterRecyclingRate: z.coerce.number().min(0).max(100).optional(),
  totalWasteGenerated: z.coerce.number().min(0),
  hazardousWaste: z.coerce.number().min(0).optional(),
  wasteDiversionRate: z.coerce.number().min(0).max(100).optional(),
  zeroWasteGoal: z.enum(["yes-with-targets", "under-development", "no"]),

  // 2.4 Biodiversity
  operationsNearProtectedAreas: z.enum(["yes", "no"]),
  biodiversityImpactAssessment: z.boolean().optional(),
  biodiversityConservationPrograms: z.enum(["active", "limited", "no"]),

  // 2.5 Compliance
  iso14001Certified: z.boolean().optional(),
  environmentalViolations: z.coerce.number().min(0).optional(),
  environmentalPolicyPublic: z.boolean().optional(),
});

const EnvironmentalForm = () => {
  const navigate = useNavigate();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [completionStatus, setCompletionStatus] = useState<{
    profile: boolean;
    environmental: boolean;
    social: boolean;
    governance: boolean;
  }>({
    profile: false,
    environmental: false,
    social: false,
    governance: false
  });

  const form = useForm<EnvironmentalAssessment>({
    resolver: zodResolver(environmentalSchema),
    defaultValues: {
      measurementLevel: "not-measured",
      hasReductionTargets: false,
      totalEnergyConsumption: 0,
      renewablePercentage: 0,
      renewableSources: [],
      energyManagementCertification: "not-planned",
      energyEfficiencyPrograms: "no",
      totalWaterWithdrawal: 0,
      operationsInWaterStressed: "no",
      totalWasteGenerated: 0,
      zeroWasteGoal: "no",
      operationsNearProtectedAreas: "no",
      biodiversityConservationPrograms: "no",
      scope3Categories: [],
    },
  });

  useEffect(() => {
    const savedData = loadAssessmentData();
    if (savedData) {
      if (savedData.environmental) {
        form.reset(savedData.environmental as EnvironmentalAssessment);
      }
      setLastSaved(new Date(savedData.lastUpdated));
      setCompletionStatus(savedData.completionStatus);
    }

    const unsubscribe = setupAutoSave(form.watch, "environmental");
    return () => unsubscribe();
  }, [form]);

  const onSubmit = (data: EnvironmentalAssessment) => {
    saveSectionData("environmental", data, true);
    navigate("/esg-assessment/social");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <ProgressTracker currentStep="environmental" completionStatus={completionStatus} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Environmental Assessment</h1>
            <p className="text-slate-600 mt-2">Measure your environmental footprint and management practices.</p>
          </div>
          <SaveProgressButton lastSaved={lastSaved} onSave={() => saveAssessmentData("environmental", form.getValues())} />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* GHG Emissions */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  <CardTitle>Greenhouse Gas (GHG) Emissions</CardTitle>
                </div>
                <CardDescription>Track your carbon footprint across Scope 1, 2, and 3.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="measurementLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Measurement Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all-three">Scope 1, 2 & 3</SelectItem>
                          <SelectItem value="scope-1-2">Scope 1 & 2 Only</SelectItem>
                          <SelectItem value="scope-1-only">Scope 1 Only</SelectItem>
                          <SelectItem value="not-measured">Not Measured</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("measurementLevel") !== "not-measured" && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="scope1Emissions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scope 1 (tCO2e)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {(form.watch("measurementLevel") === "scope-1-2" || form.watch("measurementLevel") === "all-three") && (
                      <FormField
                        control={form.control}
                        name="scope2Emissions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scope 2 (tCO2e)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {form.watch("measurementLevel") === "all-three" && (
                      <FormField
                        control={form.control}
                        name="scope3Emissions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scope 3 (tCO2e)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}

                <Separator />

                <FormField
                  control={form.control}
                  name="hasReductionTargets"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          We have set emissions reduction targets
                        </FormLabel>
                        <FormDescription>
                          Targets can be science-based or company-defined.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("hasReductionTargets") && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="targetType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sbti">SBTi Approved</SelectItem>
                              <SelectItem value="absolute">Absolute Reduction</SelectItem>
                              <SelectItem value="intensity">Intensity-based</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Reduction (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Energy Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <CardTitle>Energy Management</CardTitle>
                </div>
                <CardDescription>Energy consumption, efficiency, and renewable sourcing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalEnergyConsumption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Energy Consumption (MWh)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="energyConsumptionTrend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consumption Trend (YoY)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trend" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="decreasing">Decreasing</SelectItem>
                            <SelectItem value="stable">Stable</SelectItem>
                            <SelectItem value="increasing">Increasing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="renewablePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Renewable Energy (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormDescription>Percentage of total energy from renewable sources.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="energyManagementCertification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISO 50001 Certification</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="iso-50001">Certified</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="not-planned">Not Planned</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Water & Waste */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <CardTitle>Water & Waste Management</CardTitle>
                </div>
                <CardDescription>Water stewardship and waste diversion practices.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalWaterWithdrawal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Water Withdrawal (m³)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="operationsInWaterStressed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operations in Water Stressed Areas</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalWasteGenerated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Waste Generated (tonnes)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wasteDiversionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Waste Diversion Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>Recycled, composted, or recovered.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="zeroWasteGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zero Waste to Landfill Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes-with-targets">Yes, with targets</SelectItem>
                          <SelectItem value="under-development">Under Development</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Biodiversity & Compliance */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-600" />
                  <CardTitle>Biodiversity & Compliance</CardTitle>
                </div>
                <CardDescription>Impact on nature and regulatory adherence.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="operationsNearProtectedAreas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operations near Protected Areas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="biodiversityImpactAssessment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Biodiversity Impact Assessment Conducted
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="iso14001Certified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            ISO 14001 Certified
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="environmentalViolations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environmental Violations (Last 12 months)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/esg-assessment/profile")}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Previous
              </Button>
              <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Next: Social Assessment <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EnvironmentalForm;
