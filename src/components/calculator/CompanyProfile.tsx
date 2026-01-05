import { useState } from "react";
import { Building2, Users, DollarSign, MapPin, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyData } from "@/pages/Index";

type CompanyProfileProps = {
  onSubmit: (data: CompanyData) => void;
  onBack: () => void;
};

const INDUSTRIES = [
  "Manufacturing",
  "Technology/IT",
  "Retail/E-commerce",
  "Hospitality/Services",
  "Healthcare",
  "Finance/Banking",
  "Construction",
  "Transportation/Logistics",
  "Energy/Utilities",
  "Agriculture",
  "Education",
  "Other",
];

const REVENUE_RANGES = [
  "Under $1M",
  "$1M - $5M",
  "$5M - $10M",
  "$10M - $50M",
  "$50M - $100M",
  "$100M - $500M",
  "Over $500M",
];

const CompanyProfile = ({ onSubmit, onBack }: CompanyProfileProps) => {
  const [formData, setFormData] = useState<CompanyData>({
    name: "",
    industry: "",
    employees: 0,
    revenue: "",
    location: "",
    squareFeet: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid =
    formData.name &&
    formData.industry &&
    formData.employees > 0 &&
    formData.revenue &&
    formData.location &&
    formData.squareFeet > 0;

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-muted"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card className="shadow-[var(--shadow-card)] border-border">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Building2 className="w-8 h-8 text-primary" />
            Company Profile
          </CardTitle>
          <CardDescription className="text-base">
            Tell us about your company to get personalized emissions calculations and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Company Name *
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your company name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-11 h-12 border-border"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-base font-medium">
                  Industry Sector *
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger className="h-12 border-border">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees" className="text-base font-medium">
                  Number of Employees *
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="employees"
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.employees || ""}
                    onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) || 0 })}
                    className="pl-11 h-12 border-border"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-base font-medium">
                Annual Revenue Range *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Select
                  value={formData.revenue}
                  onValueChange={(value) => setFormData({ ...formData, revenue: value })}
                >
                  <SelectTrigger className="h-12 border-border pl-11">
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-medium">
                  Primary Location *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="pl-11 h-12 border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="squareFeet" className="text-base font-medium">
                  Facility Size (sq ft) *
                </Label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="squareFeet"
                    type="number"
                    placeholder="e.g., 10000"
                    value={formData.squareFeet || ""}
                    onChange={(e) => setFormData({ ...formData, squareFeet: parseInt(e.target.value) || 0 })}
                    className="pl-11 h-12 border-border"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={!isValid}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base shadow-md hover:shadow-lg transition-all"
              >
                Continue to Emissions Data
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfile;
