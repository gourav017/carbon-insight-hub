import { useState } from "react";
import { Calculator, LineChart, Leaf, TrendingDown } from "lucide-react";
import CompanyProfile from "@/components/calculator/CompanyProfile";
import EmissionsForm from "@/components/calculator/EmissionsForm";
import ResultsDashboard from "@/components/calculator/ResultsDashboard";
import { Button } from "@/components/ui/button";

export type CompanyData = {
  name: string;
  industry: string;
  employees: number;
  revenue: string;
  location: string;
  squareFeet: number;
};

export type EmissionsData = {
  scope1: {
    naturalGas: number;
    diesel: number;
    gasoline: number;
    refrigerants: number;
  };
  scope2: {
    electricity: number;
    steam: number;
  };
  scope3: {
    businessTravel: number;
    employeeCommute: number;
    waste: number;
    purchasedGoods: number;
  };
};

const Index = () => {
  const [step, setStep] = useState<"welcome" | "profile" | "emissions" | "results">("welcome");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [emissionsData, setEmissionsData] = useState<EmissionsData | null>(null);

  const handleCompanySubmit = (data: CompanyData) => {
    setCompanyData(data);
    setStep("emissions");
  };

  const handleEmissionsSubmit = (data: EmissionsData) => {
    setEmissionsData(data);
    setStep("results");
  };

  const handleReset = () => {
    setStep("welcome");
    setCompanyData(null);
    setEmissionsData(null);
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 shadow-lg">
                <Leaf className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Carbon Emissions Calculator
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Calculate your company's carbon footprint, receive personalized reduction strategies,
                and explore carbon credit options to achieve your sustainability goals.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Accurate Calculation</h3>
                <p className="text-muted-foreground text-sm">
                  Comprehensive emissions tracking across Scope 1, 2, and 3 with industry-specific factors.
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <LineChart className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Interactive Dashboard</h3>
                <p className="text-muted-foreground text-sm">
                  Visualize your emissions with charts, graphs, and industry benchmarks.
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 border border-border">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Tips</h3>
                <p className="text-muted-foreground text-sm">
                  Get tailored recommendations and carbon credit options based on your profile.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setStep("profile")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Assessment
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Takes approximately 10-15 minutes to complete
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "profile") {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <CompanyProfile onSubmit={handleCompanySubmit} onBack={() => setStep("welcome")} />
      </div>
    );
  }

  if (step === "emissions") {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <EmissionsForm
          companyData={companyData!}
          onSubmit={handleEmissionsSubmit}
          onBack={() => setStep("profile")}
        />
      </div>
    );
  }

  if (step === "results") {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <ResultsDashboard
          companyData={companyData!}
          emissionsData={emissionsData!}
          onReset={handleReset}
        />
      </div>
    );
  }

  return null;
};

export default Index;
