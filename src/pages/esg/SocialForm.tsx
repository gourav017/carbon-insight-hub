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
import { ArrowRight, ArrowLeft, Users, HeartHandshake, Scale, Globe2, ShieldCheck, HardHat } from "lucide-react";
import { SocialAssessment } from "@/types/esg";
import { saveAssessmentData, loadAssessmentData, setupAutoSave, saveSectionData } from "@/lib/esg/storage";
import { ProgressTracker } from "@/components/esg/ProgressTracker";
import { SaveProgressButton } from "@/components/esg/SaveProgressButton";

// ... (socialSchema omitted as we are using updated one)

const socialSchemaUpdated = z.object({
  // 3.1 Health & Safety
  totalWorkforce: z.coerce.number().min(1),
  trir: z.coerce.number().min(0).optional(),
  ltir: z.coerce.number().min(0).optional(),
  fatalities: z.coerce.number().min(0),
  iso45001Certified: z.boolean().optional(),
  hsManagementSystemCoverage: z.coerce.number().min(0).max(100).optional(),
  safetyTrainingHours: z.coerce.number().min(0),

  // 3.2 DEI
  womenInWorkforce: z.coerce.number().min(0).max(100),
  womenInManagement: z.coerce.number().min(0).max(100),
  womenInLeadership: z.coerce.number().min(0).max(100),
  womenOnBoard: z.coerce.number().min(0).max(100),
  payEquityAnalysis: z.boolean(),
  genderPayGap: z.coerce.number().min(0).max(100).optional(),
  formalDeiPolicy: z.boolean().optional(),
  diversityTargets: z.enum(["specific", "aspirational", "no"]).optional(),

  // 3.3 Labor Practices
  annualTurnoverRate: z.coerce.number().min(0).max(100),
  minimumWagePolicy: z.enum(["living-wage", "above-minimum", "legal-minimum", "below-minimum"]).optional(),
  collectiveBargainingCoverage: z.coerce.number().min(0).max(100).optional(),
  freedomOfAssociation: z.boolean().optional(),
  childForcedLaborIncidents: z.coerce.number().min(0).optional(),
  humanRightsPolicy: z.boolean().optional(),
  humanRightsDueDiligence: z.boolean().optional(),

  // 3.4 Supply Chain & Community
  supplierAuditsFrequency: z.enum(["regular", "risk-based", "occasional", "none"]),
  suppliersScreenedSocial: z.coerce.number().min(0).max(100).optional(),
  communityInvestment: z.coerce.number().min(0).optional(),
  dataPrivacyFramework: z.enum(["iso-27001", "gdpr", "other", "none"]),
  customerSatisfactionScore: z.coerce.number().min(0).max(100).optional(),
});

const SocialForm = () => {
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

  const form = useForm({
    resolver: zodResolver(socialSchemaUpdated),
    defaultValues: {
      totalWorkforce: 0,
      fatalities: 0,
      safetyTrainingHours: 0,
      womenInWorkforce: 0,
      womenInManagement: 0,
      womenInLeadership: 0,
      womenOnBoard: 0,
      payEquityAnalysis: false,
      annualTurnoverRate: 0,
      supplierAuditsFrequency: "none",
      dataPrivacyFramework: "none",
    },
  });

  useEffect(() => {
    const savedData = loadAssessmentData();
    if (savedData) {
      if (savedData.social) {
        form.reset(savedData.social as any);
      }
      setLastSaved(new Date(savedData.lastUpdated));
      setCompletionStatus(savedData.completionStatus);
    }

    const unsubscribe = setupAutoSave(() => saveSectionData("social", form.getValues()));
    return () => unsubscribe();
  }, [form]);

  const onSubmit = (data: any) => {
    saveSectionData("social", data, true);
    navigate("/esg-assessment/governance");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <ProgressTracker currentStep="social" completionStatus={completionStatus} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Social Assessment</h1>
            <p className="text-slate-600 mt-2">Evaluate your impact on people, communities, and society.</p>
          </div>
          <SaveProgressButton
            lastSaved={lastSaved?.getTime() || 0}
            onSave={() => saveSectionData("social", form.getValues())}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Health & Safety */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-orange-600" />
                  <CardTitle>Workforce Health & Safety</CardTitle>
                </div>
                <CardDescription>Safety metrics and management systems.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalWorkforce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Workforce</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="safetyTrainingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avg Safety Training Hours/Employee</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="trir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TRIR</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} value={field.value as number} />
                        </FormControl>
                        <FormDescription>Total Recordable Incident Rate</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ltir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LTIR</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} value={field.value as number} />
                        </FormControl>
                        <FormDescription>Lost Time Injury Rate</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatalities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fatalities</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="iso45001Certified"
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
                            ISO 45001 Certified
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hsManagementSystemCoverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>H&S System Coverage (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* DEI */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle>Diversity, Equity & Inclusion</CardTitle>
                </div>
                <CardDescription>Representation and fair treatment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="womenInWorkforce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Women in Workforce (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="womenInManagement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Women in Management (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="womenInLeadership"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Women in Leadership (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="womenOnBoard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Women on Board (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="payEquityAnalysis"
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
                            Pay Equity Analysis Conducted
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="formalDeiPolicy"
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
                            Formal DEI Policy in Place
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="genderPayGap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender Pay Gap (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                      </FormControl>
                      <FormDescription>Unadjusted raw pay gap.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Labor Practices */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600" />
                  <CardTitle>Labor Practices & Human Rights</CardTitle>
                </div>
                <CardDescription>Fair labor standards and human rights due diligence.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="annualTurnoverRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Turnover Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minimumWagePolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wage Policy</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select policy" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="living-wage">Living Wage</SelectItem>
                            <SelectItem value="above-minimum">Above Legal Minimum</SelectItem>
                            <SelectItem value="legal-minimum">Legal Minimum</SelectItem>
                            <SelectItem value="below-minimum">Below Minimum (Non-compliant)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="humanRightsPolicy"
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
                            Human Rights Policy
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="humanRightsDueDiligence"
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
                            Human Rights Due Diligence Process
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain & Community */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-teal-600" />
                  <CardTitle>Supply Chain & Community</CardTitle>
                </div>
                <CardDescription>Responsible sourcing and community engagement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="supplierAuditsFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Audit Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="regular">Regular (Annual)</SelectItem>
                            <SelectItem value="risk-based">Risk-based</SelectItem>
                            <SelectItem value="occasional">Occasional</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="suppliersScreenedSocial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suppliers Screened for Social Criteria (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="communityInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community Investment Amount (INR)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value as number} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dataPrivacyFramework"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Privacy Framework</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="iso-27001">ISO 27001</SelectItem>
                            <SelectItem value="gdpr">GDPR Compliant</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerSatisfactionScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Satisfaction Score (0-100)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/esg-assessment/environmental")}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Previous
              </Button>
              <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Next: Governance Assessment <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SocialForm;
