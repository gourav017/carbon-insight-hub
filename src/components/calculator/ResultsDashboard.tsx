import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanyData, EmissionsData } from "@/pages/Index";
import EmissionsChart from "./EmissionsChart";
import ReductionTips from "./ReductionTips";
import CarbonCredits from "./CarbonCredits";
import { Download, RotateCcw } from "lucide-react";
import { calculateTotalEmissions } from "@/lib/emissionsCalculator";

type ResultsDashboardProps = {
  companyData: CompanyData;
  emissionsData: EmissionsData;
  onReset: () => void;
};

const ResultsDashboard = ({ companyData, emissionsData, onReset }: ResultsDashboardProps) => {
  const results = calculateTotalEmissions(emissionsData, companyData);

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Emissions Report</h1>
          <p className="text-muted-foreground text-lg">{companyData.name}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border hover:bg-muted">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={onReset} variant="outline" className="border-border hover:bg-muted">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Calculation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-[var(--shadow-card)] border-border bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{results.total.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">tCO2e/year</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Per Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results.perEmployee.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">tCO2e/employee</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emission Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.intensity}</div>
            <p className="text-xs text-muted-foreground mt-1">Compared to industry</p>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)] border-border bg-gradient-to-br from-chart-1/10 to-chart-2/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Largest Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{results.largestSource.name}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {results.largestSource.percentage}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <EmissionsChart results={results} />
        <Card className="shadow-[var(--shadow-card)] border-border">
          <CardHeader>
            <CardTitle>Emissions Breakdown</CardTitle>
            <CardDescription>Distribution across scopes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Scope 1 (Direct)</span>
                  <span className="text-sm font-bold text-chart-1">
                    {results.scope1.toFixed(1)} tCO2e
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-chart-1 transition-all duration-500"
                    style={{ width: `${(results.scope1 / results.total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Scope 2 (Energy)</span>
                  <span className="text-sm font-bold text-chart-2">
                    {results.scope2.toFixed(1)} tCO2e
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-chart-2 transition-all duration-500"
                    style={{ width: `${(results.scope2 / results.total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Scope 3 (Indirect)</span>
                  <span className="text-sm font-bold text-chart-3">
                    {results.scope3.toFixed(1)} tCO2e
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-chart-3 transition-all duration-500"
                    style={{ width: `${(results.scope3 / results.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                Your emissions are equivalent to{" "}
                <span className="font-bold text-foreground">
                  {Math.round(results.total * 219)} miles
                </span>{" "}
                driven by an average car or{" "}
                <span className="font-bold text-foreground">
                  {Math.round(results.total * 1.2)} trees
                </span>{" "}
                needed to absorb this CO2 annually.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations and Credits */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ReductionTips results={results} companyData={companyData} />
        <CarbonCredits results={results} />
      </div>
    </div>
  );
};

export default ResultsDashboard;
