import { useState } from "react";
import { Flame, Zap, Plane, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyData, EmissionsData } from "@/pages/Index";

type EmissionsFormProps = {
  companyData: CompanyData;
  onSubmit: (data: EmissionsData) => void;
  onBack: () => void;
};

const EmissionsForm = ({ companyData, onSubmit, onBack }: EmissionsFormProps) => {
  const [formData, setFormData] = useState<EmissionsData>({
    scope1: {
      naturalGas: 0,
      diesel: 0,
      gasoline: 0,
      refrigerants: 0,
    },
    scope2: {
      electricity: 0,
      steam: 0,
    },
    scope3: {
      businessTravel: 0,
      employeeCommute: 0,
      waste: 0,
      purchasedGoods: 0,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateScope1 = (field: keyof EmissionsData["scope1"], value: number) => {
    setFormData({
      ...formData,
      scope1: { ...formData.scope1, [field]: value },
    });
  };

  const updateScope2 = (field: keyof EmissionsData["scope2"], value: number) => {
    setFormData({
      ...formData,
      scope2: { ...formData.scope2, [field]: value },
    });
  };

  const updateScope3 = (field: keyof EmissionsData["scope3"], value: number) => {
    setFormData({
      ...formData,
      scope3: { ...formData.scope3, [field]: value },
    });
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-muted"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Company Profile
      </Button>

      <Card className="shadow-[var(--shadow-card)] border-border">
        <CardHeader>
          <CardTitle className="text-3xl">Emissions Data</CardTitle>
          <CardDescription className="text-base">
            Enter your annual emissions data for {companyData.name}. All values should be for the past 12 months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="scope1" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                <TabsTrigger value="scope1" className="py-3">
                  <Flame className="w-4 h-4 mr-2" />
                  Scope 1
                </TabsTrigger>
                <TabsTrigger value="scope2" className="py-3">
                  <Zap className="w-4 h-4 mr-2" />
                  Scope 2
                </TabsTrigger>
                <TabsTrigger value="scope3" className="py-3">
                  <Plane className="w-4 h-4 mr-2" />
                  Scope 3
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scope1" className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Scope 1:</strong> Direct emissions from sources you own or control
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="naturalGas">Natural Gas (therms/year)</Label>
                    <Input
                      id="naturalGas"
                      type="number"
                      placeholder="e.g., 50000"
                      value={formData.scope1.naturalGas || ""}
                      onChange={(e) => updateScope1("naturalGas", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diesel">Diesel Fuel (gallons/year)</Label>
                    <Input
                      id="diesel"
                      type="number"
                      placeholder="e.g., 2000"
                      value={formData.scope1.diesel || ""}
                      onChange={(e) => updateScope1("diesel", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gasoline">Gasoline (gallons/year)</Label>
                    <Input
                      id="gasoline"
                      type="number"
                      placeholder="e.g., 3000"
                      value={formData.scope1.gasoline || ""}
                      onChange={(e) => updateScope1("gasoline", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refrigerants">Refrigerant Leaks (lbs/year)</Label>
                    <Input
                      id="refrigerants"
                      type="number"
                      placeholder="e.g., 50"
                      value={formData.scope1.refrigerants || ""}
                      onChange={(e) => updateScope1("refrigerants", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scope2" className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Scope 2:</strong> Indirect emissions from purchased energy
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="electricity">Electricity (kWh/year)</Label>
                    <Input
                      id="electricity"
                      type="number"
                      placeholder="e.g., 500000"
                      value={formData.scope2.electricity || ""}
                      onChange={(e) => updateScope2("electricity", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="steam">Steam/Heating (MMBtu/year)</Label>
                    <Input
                      id="steam"
                      type="number"
                      placeholder="e.g., 1000"
                      value={formData.scope2.steam || ""}
                      onChange={(e) => updateScope2("steam", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scope3" className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Scope 3:</strong> All other indirect emissions in your value chain
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessTravel">Business Travel (miles/year)</Label>
                    <Input
                      id="businessTravel"
                      type="number"
                      placeholder="e.g., 100000"
                      value={formData.scope3.businessTravel || ""}
                      onChange={(e) => updateScope3("businessTravel", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeCommute">Employee Commuting (miles/year)</Label>
                    <Input
                      id="employeeCommute"
                      type="number"
                      placeholder="e.g., 250000"
                      value={formData.scope3.employeeCommute || ""}
                      onChange={(e) => updateScope3("employeeCommute", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waste">Waste Generated (tons/year)</Label>
                    <Input
                      id="waste"
                      type="number"
                      placeholder="e.g., 50"
                      value={formData.scope3.waste || ""}
                      onChange={(e) => updateScope3("waste", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchasedGoods">Purchased Goods ($ thousands/year)</Label>
                    <Input
                      id="purchasedGoods"
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.scope3.purchasedGoods || ""}
                      onChange={(e) => updateScope3("purchasedGoods", parseFloat(e.target.value) || 0)}
                      className="h-11 border-border"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base shadow-md hover:shadow-lg transition-all"
              >
                Calculate My Emissions
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmissionsForm;
