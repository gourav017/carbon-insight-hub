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
import { useNavigate } from "react-router-dom";
import { ArrowRight, Save, Building2, Globe, Calendar, Users, Mail } from "lucide-react";
import { OrganizationProfile } from "@/types/esg";
import { saveAssessmentData, loadAssessmentData, setupAutoSave, saveSectionData } from "@/lib/esg/storage";
// ... (imports remain same, just updating the storage import line if needed, but replace_file_content replaces chunks)

// I need to be careful with imports. The file currently has:
// import { saveAssessmentData, loadAssessmentData, setupAutoSave } from "@/lib/esg/storage";
// I need to add saveSectionData to it.

// And update onSubmit.
import { ProgressTracker } from "@/components/esg/ProgressTracker";
import { SaveProgressButton } from "@/components/esg/SaveProgressButton";

const profileSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  legalEntityName: z.string().optional(),
  industrySector: z.enum([
    "manufacturing", "it-technology", "retail", "healthcare", "finance",
    "construction", "agriculture", "energy", "transportation", "hospitality",
    "education", "real-estate", "pharmaceuticals", "mining", "food-beverage",
    "telecommunications", "professional-services", "other"
  ]),
  organizationSize: z.enum(["micro", "small", "medium", "large", "very-large", "enterprise"]),
  annualRevenue: z.coerce.number().min(0, "Revenue must be positive"),
  fiscalYearEnd: z.string().optional(),
  geographicRegion: z.string().optional(),
  numberOfFacilities: z.coerce.number().min(0).optional(),
  numberOfEmployees: z.coerce.number().min(1, "Number of employees is required"),
  countriesOfOperation: z.array(z.string()).min(1, "At least one country required"),
  publicPrivateStatus: z.enum(["public", "private"]).optional(),
  stockExchange: z.string().optional(),
  primaryContactName: z.string().optional(),
  primaryContactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  esgOfficerName: z.string().optional(),
  publishesSustainabilityReports: z.enum(["yes", "no", "planning"]),
  reportingFrameworks: z.array(z.string()),
  assessmentPeriodFrom: z.string().min(1, "Start date is required"),
  assessmentPeriodTo: z.string().min(1, "End date is required"),
});

const ProfileForm = () => {
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

  const form = useForm<OrganizationProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      organizationName: "",
      legalEntityName: "",
      industrySector: "other",
      organizationSize: "medium",
      annualRevenue: 0,
      fiscalYearEnd: "",
      geographicRegion: "",
      numberOfFacilities: 1,
      numberOfEmployees: 0,
      countriesOfOperation: [],
      publicPrivateStatus: "private",
      stockExchange: "",
      primaryContactName: "",
      primaryContactEmail: "",
      esgOfficerName: "",
      publishesSustainabilityReports: "no",
      reportingFrameworks: [],
      assessmentPeriodFrom: "",
      assessmentPeriodTo: "",
    },
  });

  useEffect(() => {
    const savedData = loadAssessmentData();
    if (savedData) {
      if (savedData.profile) {
        // Ensure arrays are initialized
        const profileData = {
          ...savedData.profile,
          countriesOfOperation: savedData.profile.countriesOfOperation || [],
          reportingFrameworks: savedData.profile.reportingFrameworks || [],
        };
        form.reset(profileData as OrganizationProfile);
      }
      setLastSaved(new Date(savedData.lastUpdated));
      setCompletionStatus(savedData.completionStatus);
    }

    const unsubscribe = setupAutoSave(form.watch, "profile");
    return () => unsubscribe();
  }, [form]);

  const onSubmit = (data: OrganizationProfile) => {
    saveSectionData("profile", data, true);
    navigate("/esg-assessment/environmental");
  };

  const frameworks = [
    { id: "gri", label: "GRI (Global Reporting Initiative)" },
    { id: "sasb", label: "SASB (Sustainability Accounting Standards Board)" },
    { id: "tcfd", label: "TCFD (Task Force on Climate-related Financial Disclosures)" },
    { id: "sdgs", label: "UN SDGs (Sustainable Development Goals)" },
    { id: "cdp", label: "CDP (Carbon Disclosure Project)" },
    { id: "iso26000", label: "ISO 26000" },
    { id: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <ProgressTracker currentStep="profile" completionStatus={completionStatus} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Organization Profile</h1>
            <p className="text-slate-600 mt-2">Tell us about your organization to tailor the assessment.</p>
          </div>
          <SaveProgressButton lastSaved={lastSaved} onSave={() => saveAssessmentData("profile", form.getValues())} />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Company Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <CardTitle>Company Information</CardTitle>
                </div>
                <CardDescription>Basic details about your legal entity and operations.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalEntityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Entity Name (if different)</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corporation Ltd." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industrySector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Sector *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="it-technology">IT & Technology</SelectItem>
                          <SelectItem value="finance">Finance & Banking</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="energy">Energy & Utilities</SelectItem>
                          <SelectItem value="transportation">Transportation & Logistics</SelectItem>
                          <SelectItem value="construction">Construction & Real Estate</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="mining">Mining & Metals</SelectItem>
                          <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
                          <SelectItem value="professional-services">Professional Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizationSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Size *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="micro">Micro (&lt;10 employees)</SelectItem>
                          <SelectItem value="small">Small (10-49 employees)</SelectItem>
                          <SelectItem value="medium">Medium (50-249 employees)</SelectItem>
                          <SelectItem value="large">Large (250-999 employees)</SelectItem>
                          <SelectItem value="very-large">Very Large (1000-4999 employees)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (5000+ employees)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annualRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Revenue (INR) *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfEmployees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Employees *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fiscalYearEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fiscal Year End</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., March 31" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publicPrivateStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public/Private Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="public">Publicly Traded</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("publicPrivateStatus") === "public" && (
                  <FormField
                    control={form.control}
                    name="stockExchange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Exchange & Ticker</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., NSE: RELIANCE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Operational Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <CardTitle>Operational Details</CardTitle>
                </div>
                <CardDescription>Where and how you operate.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="geographicRegion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Geographic Region</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="asia-pacific">Asia Pacific (India)</SelectItem>
                          <SelectItem value="north-america">North America</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="latin-america">Latin America</SelectItem>
                          <SelectItem value="middle-east-africa">Middle East & Africa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfFacilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Facilities/Sites</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="countriesOfOperation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Countries of Operation (comma separated) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="India, USA, UK, ..."
                            value={field.value?.join(", ") || ""}
                            onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(s => s))}
                          />
                        </FormControl>
                        <FormDescription>List all major countries where you have operations.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact & Reporting */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <CardTitle>Contact & Reporting</CardTitle>
                </div>
                <CardDescription>Who is responsible for this assessment.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="primaryContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryContactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="esgOfficerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ESG/Sustainability Officer</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishesSustainabilityReports"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you publish sustainability reports?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes, annually</SelectItem>
                          <SelectItem value="planning">Planning to start</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="reportingFrameworks"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Reporting Frameworks Used</FormLabel>
                          <FormDescription>
                            Select all frameworks you currently align with or plan to use.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {frameworks.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="reportingFrameworks"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item.id])
                                            : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2 grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="assessmentPeriodFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assessment Period From *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assessmentPeriodTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assessment Period To *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Next: Environmental Assessment <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileForm;
