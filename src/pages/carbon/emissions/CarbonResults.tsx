import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Download, ArrowRight, PieChart, BarChart, TrendingDown, History, Save, Eye, Trash2, RotateCcw } from "lucide-react";
import {
    loadEmissionsData,
    saveToHistory,
    getHistory,
    deleteFromHistory,
    clearEmissionsData,
    CarbonHistoryItem,
} from "@/lib/carbon/storage";
import { CarbonAssessmentData } from "@/types/carbon";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const CarbonResults = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyItems, setHistoryItems] = useState<CarbonHistoryItem[]>([]);
    const [data, setData] = useState<CarbonAssessmentData | null>(null);

    useEffect(() => {
        const loadedData = loadEmissionsData();
        if (loadedData) {
            setData(loadedData);
        }
    }, []);

    // Mock Data - Replace with real calculation results from 'data'
    // In a real implementation, we would calculate these from 'data'
    const results = {
        totalLocation: 1250.5,
        totalMarket: 1100.2,
        scope1: 450.0,
        scope2: 300.5, // Location-based
        scope3: 500.0,
        intensities: {
            perEmployee: 5.2,
            perRevenue: 12.5 // tCO2e per $M
        }
    };

    const handleSaveToHistory = () => {
        if (data) {
            saveToHistory(data, results.totalLocation);
            toast({
                title: "Result Saved",
                description: "This calculation has been saved to your history.",
            });
            loadHistory();
        }
    };

    const loadHistory = () => {
        setHistoryItems(getHistory());
    };

    const handleDeleteHistory = (id: string) => {
        deleteFromHistory(id);
        loadHistory();
    };

    const handleLoadHistoryItem = (item: CarbonHistoryItem) => {
        if (confirm("Load this historical calculation? Current progress will be overwritten.")) {
            localStorage.setItem("carbon_emissions_data", JSON.stringify(item.data));
            window.location.reload();
        }
    };

    const handleStartNew = () => {
        if (confirm("Start a new calculation? This will clear current data.")) {
            clearEmissionsData();
            navigate("/carbon-emissions/profile");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Emissions Inventory Results</h1>
                            <p className="text-muted-foreground mt-1">Reporting Year: 2024</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Dialog open={historyOpen} onOpenChange={(open) => {
                                setHistoryOpen(open);
                                if (open) loadHistory();
                            }}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <History className="w-4 h-4 mr-2" />
                                        History
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Calculation History</DialogTitle>
                                        <DialogDescription>
                                            View and restore your past emissions calculations.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="h-[400px] mt-4">
                                        {historyItems.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No saved history found.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {historyItems.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                                        <div>
                                                            <div className="font-semibold">
                                                                {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString()}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Total Emissions: <span className="font-medium text-primary">{item.totalEmissions.toLocaleString()} tCO2e</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="ghost" onClick={() => handleLoadHistoryItem(item)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View
                                                            </Button>
                                                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteHistory(item.id)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>

                            <Button variant="outline" onClick={handleSaveToHistory}>
                                <Save className="w-4 h-4 mr-2" /> Save Result
                            </Button>
                            <Button variant="outline" onClick={handleStartNew}>
                                <RotateCcw className="w-4 h-4 mr-2" /> Start New
                            </Button>
                            <Button variant="outline" onClick={() => navigate("/carbon-emissions/report")}>
                                <Download className="w-4 h-4 mr-2" /> Export Report
                            </Button>
                            <Button onClick={() => navigate("/carbon-emissions/reduction")}>
                                Plan Reductions <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* Top Level Stats */}
                    {/* ... rest of the component ... */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions (Location-Based)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-primary">{results.totalLocation.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">tCO2e</span></div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions (Market-Based)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{results.totalMarket.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">tCO2e</span></div>
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                    {((1 - results.totalMarket / results.totalLocation) * 100).toFixed(1)}% reduction from renewable purchases
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Carbon Intensity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{results.intensities.perEmployee} <span className="text-lg font-normal text-muted-foreground">tCO2e/FTE</span></div>
                                <p className="text-xs text-muted-foreground mt-1">Industry Avg: 4.8 tCO2e/FTE</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="breakdown" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="breakdown">Scope Breakdown</TabsTrigger>
                            <TabsTrigger value="details">Detailed View</TabsTrigger>
                        </TabsList>

                        <TabsContent value="breakdown">
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Scope 1: Direct</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold mb-4">{results.scope1} <span className="text-sm font-normal text-muted-foreground">tCO2e</span></div>
                                        <Progress value={(results.scope1 / results.totalLocation) * 100} className="h-2 mb-2" />
                                        <p className="text-xs text-muted-foreground">{((results.scope1 / results.totalLocation) * 100).toFixed(1)}% of total</p>

                                        <div className="mt-6 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Stationary Combustion</span>
                                                <span className="font-medium">300.0</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Mobile Combustion</span>
                                                <span className="font-medium">150.0</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Scope 2: Indirect Energy</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold mb-4">{results.scope2} <span className="text-sm font-normal text-muted-foreground">tCO2e</span></div>
                                        <Progress value={(results.scope2 / results.totalLocation) * 100} className="h-2 mb-2" />
                                        <p className="text-xs text-muted-foreground">{((results.scope2 / results.totalLocation) * 100).toFixed(1)}% of total</p>

                                        <div className="mt-6 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Purchased Electricity</span>
                                                <span className="font-medium">250.5</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Purchased Heat</span>
                                                <span className="font-medium">50.0</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Scope 3: Value Chain</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold mb-4">{results.scope3} <span className="text-sm font-normal text-muted-foreground">tCO2e</span></div>
                                        <Progress value={(results.scope3 / results.totalLocation) * 100} className="h-2 mb-2" />
                                        <p className="text-xs text-muted-foreground">{((results.scope3 / results.totalLocation) * 100).toFixed(1)}% of total</p>

                                        <div className="mt-6 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Purchased Goods</span>
                                                <span className="font-medium">300.0</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Business Travel</span>
                                                <span className="font-medium">200.0</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="details">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detailed Emissions Inventory</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-center text-muted-foreground py-8">
                                            Detailed table view would go here, listing every source and its calculated emission.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CarbonResults;
