import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Target, TrendingDown } from "lucide-react";

const ReductionPlanning = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Reduction Planning</h1>
                    <p className="text-muted-foreground mb-8">Set targets and track reduction initiatives.</p>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    Net Zero Target
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress to 2030 Target</span>
                                        <span className="font-bold">15%</span>
                                    </div>
                                    <Progress value={15} />
                                    <p className="text-sm text-muted-foreground">
                                        Target: 50% reduction by 2030 (Base year: 2024)
                                    </p>
                                    <Button className="w-full mt-4">Update Targets</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-green-600" />
                                    Reduction Potential
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                                        <span>Switch to Renewable Energy</span>
                                        <span className="font-bold text-green-600">-250 tCO2e</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                                        <span>Fleet Electrification</span>
                                        <span className="font-bold text-green-600">-120 tCO2e</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                                        <span>Supplier Engagement</span>
                                        <span className="font-bold text-green-600">-80 tCO2e</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-muted-foreground mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Implement LED Lighting Retrofit</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Replace all warehouse lighting with high-efficiency LEDs. Estimated payback period: 1.5 years.
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <Button size="sm" variant="outline">View Details</Button>
                                            <Button size="sm">Add to Plan</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ReductionPlanning;
