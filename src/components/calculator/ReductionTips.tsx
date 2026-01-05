import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingDown, Zap, Recycle } from "lucide-react";
import { CompanyData } from "@/pages/Index";

type ReductionTipsProps = {
  results: {
    total: number;
    perEmployee: number;
    intensity: string;
  };
  companyData: CompanyData;
};

const ReductionTips = ({ results, companyData }: ReductionTipsProps) => {
  const getTips = () => {
    const tips = [];

    if (results.perEmployee > 50) {
      tips.push({
        icon: Zap,
        title: "Energy Audit Priority",
        description:
          "Your per-employee emissions are high. Conduct a comprehensive energy audit to identify major inefficiencies.",
        impact: "Potential 30-40% reduction",
        color: "text-chart-1",
      });
    }

    if (companyData.industry === "Manufacturing") {
      tips.push({
        icon: TrendingDown,
        title: "Process Optimization",
        description:
          "Implement lean manufacturing principles and upgrade to energy-efficient equipment to reduce production emissions.",
        impact: "Potential 20-25% reduction",
        color: "text-chart-2",
      });
    }

    if (companyData.industry === "Technology/IT" || companyData.industry === "Finance/Banking") {
      tips.push({
        icon: Recycle,
        title: "Remote Work Program",
        description:
          "Expand remote work options to reduce commuting emissions and office energy consumption.",
        impact: "Potential 15-20% reduction",
        color: "text-accent",
      });
    }

    tips.push({
      icon: Lightbulb,
      title: "Switch to Renewable Energy",
      description:
        "Partner with renewable energy providers or install on-site solar panels to dramatically reduce Scope 2 emissions.",
      impact: "Potential 40-60% reduction",
      color: "text-success",
    });

    return tips;
  };

  const tips = getTips();

  return (
    <Card className="shadow-[var(--shadow-card)] border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Personalized Reduction Tips
        </CardTitle>
        <CardDescription>
          Tailored recommendations for {companyData.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div
                key={index}
                className="p-4 bg-muted/30 rounded-lg border border-border hover:shadow-md transition-all duration-300"
              >
                <div className="flex gap-3">
                  <div className={`mt-1 ${tip.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{tip.description}</p>
                    <div className="inline-block px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      {tip.impact}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            3-Year Reduction Pathway
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Year 1: Quick wins & measurement</span>
              <span className="font-semibold">-15% target</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Year 2: Major efficiency projects</span>
              <span className="font-semibold">-25% target</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Year 3: Renewable transition</span>
              <span className="font-semibold">-50% target</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReductionTips;
