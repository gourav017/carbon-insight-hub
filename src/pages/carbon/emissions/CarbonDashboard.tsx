import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, ArrowRight, CheckCircle2, Circle } from "lucide-react";

const CarbonDashboard = () => {
    const navigate = useNavigate();

    // Mock data - replace with actual state
    const progress = {
        profile: true,
        scope1: false,
        scope2: false,
        scope3: false
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Carbon Dashboard</h1>
                        <p className="text-muted-foreground">Track and manage your emissions inventory</p>
                    </div>
                    <Button onClick={() => navigate("/carbon-emissions/results")}>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emissions (YTD)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">0.0 tCO2e</div>
                            <p className="text-xs text-muted-foreground mt-1">Baseline year: 2024</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Emission Intensity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">0.0</div>
                            <p className="text-xs text-muted-foreground mt-1">tCO2e per employee</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">25%</div>
                            <Progress value={25} className="mt-2" />
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-xl font-semibold mb-4">Calculation Steps</h2>
                <div className="grid gap-4">
                    <Card className="hover:bg-secondary/10 transition-colors cursor-pointer" onClick={() => navigate("/carbon-emissions/profile")}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {progress.profile ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-muted-foreground" />}
                                <div>
                                    <h3 className="font-semibold">1. Company Profile</h3>
                                    <p className="text-sm text-muted-foreground">Organization details and reporting boundary</p>
                                </div>
                            </div>
                            <ArrowRight className="text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card className="hover:bg-secondary/10 transition-colors cursor-pointer" onClick={() => navigate("/carbon-emissions/scope1")}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {progress.scope1 ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-muted-foreground" />}
                                <div>
                                    <h3 className="font-semibold">2. Scope 1: Direct Emissions</h3>
                                    <p className="text-sm text-muted-foreground">Stationary, mobile, process, and fugitive sources</p>
                                </div>
                            </div>
                            <ArrowRight className="text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card className="hover:bg-secondary/10 transition-colors cursor-pointer" onClick={() => navigate("/carbon-emissions/scope2")}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {progress.scope2 ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-muted-foreground" />}
                                <div>
                                    <h3 className="font-semibold">3. Scope 2: Indirect Energy</h3>
                                    <p className="text-sm text-muted-foreground">Purchased electricity, heating, and cooling</p>
                                </div>
                            </div>
                            <ArrowRight className="text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card className="hover:bg-secondary/10 transition-colors cursor-pointer" onClick={() => navigate("/carbon-emissions/scope3")}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {progress.scope3 ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-muted-foreground" />}
                                <div>
                                    <h3 className="font-semibold">4. Scope 3: Value Chain</h3>
                                    <p className="text-sm text-muted-foreground">Upstream and downstream indirect emissions</p>
                                </div>
                            </div>
                            <ArrowRight className="text-muted-foreground" />
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CarbonDashboard;
