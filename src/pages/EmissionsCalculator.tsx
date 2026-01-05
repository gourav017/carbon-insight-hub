import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Calculator } from "lucide-react";

const EmissionsCalculator = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-2/10 rounded-2xl mb-6">
              <Calculator className="w-8 h-8 text-chart-2" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">Carbon Emissions Calculator</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate company-wide emissions across all scopes following GHG Protocol standards.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <p className="text-center text-muted-foreground">
              Full Scope Emissions Calculator coming soon. This will track Scope 1, 2, and 3 emissions with detailed breakdowns and reduction strategies.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmissionsCalculator;
