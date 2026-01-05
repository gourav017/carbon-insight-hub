import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield } from "lucide-react";

const ESGAssessment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-1/10 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-chart-1" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">ESG Alignment Assessment</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive scoring across Environmental, Social, and Governance criteria with transparent benchmarking.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <p className="text-center text-muted-foreground">
              ESG Assessment tool coming soon. This will include sector-specific benchmarks, pillar breakdowns, and actionable recommendations.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ESGAssessment;
