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
import { ArrowRight, ArrowLeft, Gavel, Briefcase, Shield, FileText, Eye, Users, Scale, ShieldAlert } from "lucide-react";
import { GovernanceAssessment } from "@/types/esg";
import { saveAssessmentData, loadAssessmentData, setupAutoSave, saveSectionData } from "@/lib/esg/storage";
import { ProgressTracker } from "@/components/esg/ProgressTracker";
import { SaveProgressButton } from "@/components/esg/SaveProgressButton";

// Updated schema to match types.ts strictly
const governanceSchemaUpdated = z.object({
  // 4.1 Board Structure
  totalBoardSize: z.coerce.number().min(1),
  independentDirectors: z.coerce.number().min(0),
  womenOnBoard: z.coerce.number().min(0),
  sustainabilityCommittee: z.boolean().optional(),
  boardEvaluation: z.boolean().optional(),

  // 4.2 Executive Compensation
  variableCompLinkedToEsg: z.boolean().optional(),
  executiveTurnover: z.coerce.number().min(0).max(100).optional(),
  ceoChairmanSeparated: z.boolean().optional(),

  // 4.3 Ethics & Compliance
  codeOfConduct: z.boolean().optional(),
  antiCorruptionPolicy: z.boolean().optional(),
  whistleblowerMechanism: z.boolean().optional(),
  corruptionViolations: z.coerce.number().min(0).optional(),

  // 4.4 Risk Management
  ermFramework: z.enum(["coso", "iso-31000", "proprietary", "other"]).optional(),
  esgRisksIntegrated: z.boolean().optional(),
  cybersecurityFramework: z.enum(["nist", "iso-27001", "soc2", "none"]).optional(),
  internalAudit: z.boolean().optional(),

  // 4.5 Transparency
  sustainabilityReport: z.boolean().optional(),
  externalAudit: z.boolean().optional(),
  materialityAssessment: z.boolean().optional(),
  stakeholderInput: z.boolean().optional(),
});

type GovernanceFormValues = z.infer<typeof governanceSchemaUpdated>;

const GovernanceForm = () => {
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
    resolver: zodResolver(governanceSchemaUpdated),
    defaultValues: {
      totalBoardSize: 1,
      independentDirectors: 0,
      womenOnBoard: 0,
      sustainabilityCommittee: false,
      variableCompLinkedToEsg: false,
      executiveTurnover: 0,
      esgRisksIntegrated: false,
      cybersecurityFramework: "none",
      sustainabilityReport: false,
      stakeholderInput: false,
      corruptionViolations: 0,
    },
  });

  useEffect(() => {
    const savedData = loadAssessmentData();
    if (savedData) {
      if (savedData.governance) {
        // Cast to unknown first to avoid partial type mismatch, 
        // as savedData might have extra fields or missing required ones (handled by defaultValues)
        form.reset(savedData.governance as unknown as GovernanceFormValues);
      }
      setLastSaved(new Date(savedData.lastUpdated));
      setCompletionStatus(savedData.completionStatus);
    }

    const unsubscribe = setupAutoSave(() => saveSectionData("governance", form.getValues()));
    return () => unsubscribe();
  }, [form]);

  const onSubmit = (data: GovernanceFormValues) => {
    // Cast to GovernanceAssessment for storage. 
    // In a real app, we might want to merge with existing data to preserve fields not in this form.
    saveSectionData("governance", data, true);
    navigate("/esg-assessment/results");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <ProgressTracker currentStep="governance" completionStatus={completionStatus} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Governance Assessment</h1>
            <p className="text-slate-600 mt-2">Evaluate your leadership, ethics, and control mechanisms.</p>
          </div>
          <SaveProgressButton
            lastSaved={lastSaved?.getTime() || 0}
            onSave={() => saveSectionData("governance", form.getValues())}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* 4.1 Board Structure */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle>Board Structure & Diversity</CardTitle>
                </div>
                <CardDescription>Board composition and oversight capabilities.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="totalBoardSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Board Size</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="independentDirectors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Independent Directors</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value as number} />
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
                        <FormLabel>Women on Board</FormLabel>
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
                    name="sustainabilityCommittee"
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
                            Sustainability Committee
                          </FormLabel>
                          <FormDescription>
                            Dedicated committee for ESG oversight.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="boardEvaluation"
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
                            Regular Board Evaluation
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 4.2 Executive Compensation */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <CardTitle>Executive Compensation</CardTitle>
                </div>
                <CardDescription>Alignment of incentives with sustainability goals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="variableCompLinkedToEsg"
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
                            Compensation Linked to ESG
                          </FormLabel>
                          <FormDescription>
                            Variable pay tied to ESG targets.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ceoChairmanSeparated"
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
                            CEO & Chairman Separated
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="executiveTurnover"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Executive Turnover Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} value={field.value as number} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 4.3 Ethics & Compliance */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <CardTitle>Ethics & Compliance</CardTitle>
                </div>
                <CardDescription>Integrity and compliance frameworks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codeOfConduct"
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
                            Code of Conduct Enforced
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="antiCorruptionPolicy"
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
                            Anti-Corruption Policy
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="whistleblowerMechanism"
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
                            Whistleblower Mechanism
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="corruptionViolations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corruption Violations (Last 12m)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 4.4 Risk Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <CardTitle>Risk Management</CardTitle>
                </div>
                <CardDescription>Risk oversight and cybersecurity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ermFramework"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ERM Framework</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="coso">COSO</SelectItem>
                            <SelectItem value="iso-31000">ISO 31000</SelectItem>
                            <SelectItem value="proprietary">Proprietary</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="esgRisksIntegrated"
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
                            ESG Risks Integrated
                          </FormLabel>
                          <FormDescription>
                            Into overall risk management.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cybersecurityFramework"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cybersecurity Framework</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="nist">NIST</SelectItem>
                            <SelectItem value="iso-27001">ISO 27001</SelectItem>
                            <SelectItem value="soc2">SOC 2</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="internalAudit"
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
                            Internal Audit Function
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 4.5 Transparency */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <CardTitle>Transparency & Reporting</CardTitle>
                </div>
                <CardDescription>Disclosure quality and stakeholder engagement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sustainabilityReport"
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
                            Sustainability Report Published
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="externalAudit"
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
                            External Audit of ESG Data
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="materialityAssessment"
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
                            Materiality Assessment
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stakeholderInput"
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
                            Stakeholder Input Solicited
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/esg-assessment/social")}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Previous
              </Button>
              <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                View Results <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GovernanceForm;
