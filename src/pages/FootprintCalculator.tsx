import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Footprints } from "lucide-react";

const FootprintCalculator = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-3/10 rounded-2xl mb-6">
              <Footprints className="w-8 h-8 text-chart-3" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">Sector-Specific Carbon Footprint</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Detailed carbon footprint calculations tailored to your industry sector.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <p className="text-center text-muted-foreground">
              Sector-Specific Footprint Calculator coming soon. This will include templates for Energy, Transportation, Manufacturing, Agriculture, Buildings, Digital, and Waste sectors.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FootprintCalculator;
