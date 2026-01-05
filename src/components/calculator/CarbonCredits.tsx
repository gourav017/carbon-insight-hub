import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wind, Trees, Zap, Building2 } from "lucide-react";

type CarbonCreditsProps = {
  results: {
    total: number;
  };
};

const CarbonCredits = ({ results }: CarbonCreditsProps) => {
  const creditOptions = [
    {
      icon: Wind,
      name: "Renewable Energy Credits",
      type: "Wind & Solar Projects",
      standard: "Verra VCS",
      pricePerTon: 15,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      description: "Support wind and solar energy generation projects worldwide",
    },
    {
      icon: Trees,
      name: "Reforestation Credits",
      type: "Forest Conservation",
      standard: "Gold Standard",
      pricePerTon: 25,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      description: "Protect and restore forests while supporting biodiversity",
    },
    {
      icon: Zap,
      name: "Methane Capture",
      type: "Waste Management",
      standard: "Climate Action Reserve",
      pricePerTon: 12,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      description: "Capture methane from landfills and agricultural operations",
    },
    {
      icon: Building2,
      name: "Energy Efficiency",
      type: "Building Upgrades",
      standard: "ISO 14064",
      pricePerTon: 18,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      description: "Fund energy efficiency improvements in developing regions",
    },
  ];

  return (
    <Card className="shadow-[var(--shadow-card)] border-border">
      <CardHeader>
        <CardTitle>Carbon Credit Options</CardTitle>
        <CardDescription>
          Offset your remaining {results.total.toFixed(1)} tCO2e emissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {creditOptions.map((option, index) => {
            const Icon = option.icon;
            const estimatedCost = (results.total * option.pricePerTon).toLocaleString();

            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-border hover:shadow-md transition-all duration-300 bg-card"
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 ${option.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{option.name}</h4>
                        <p className="text-sm text-muted-foreground">{option.type}</p>
                      </div>
                      <Badge variant="outline" className="border-primary text-primary">
                        {option.standard}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-muted-foreground">Estimated cost: </span>
                        <span className="font-bold text-lg">${estimatedCost}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          (${option.pricePerTon}/ton)
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <h4 className="font-semibold mb-2 text-accent">What are Carbon Credits?</h4>
          <p className="text-sm text-muted-foreground">
            Carbon credits allow you to offset emissions you can't yet eliminate by funding verified
            projects that reduce or remove CO2 from the atmosphere. Each credit represents one metric
            ton of CO2 equivalent reduced or removed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarbonCredits;
