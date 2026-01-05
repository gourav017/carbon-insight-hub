import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Factory, Zap, Truck, Globe } from "lucide-react";

const CarbonLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary/5 py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Carbon Emissions Calculator
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            Measure your organization's Scope 1, 2, and 3 emissions in compliance with the GHG Protocol Corporate Standard.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" onClick={() => navigate("/carbon-emissions/profile")}>
                                Start Calculation <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="lg">
                                Import from ESG Data
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Scopes Guide */}
                <section className="py-16 container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Understanding the Scopes</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <Factory className="w-12 h-12 text-blue-600 mb-4" />
                                <CardTitle>Scope 1: Direct Emissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Emissions from sources that are owned or controlled by the company, such as:
                                </p>
                                <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                                    <li>Company vehicles</li>
                                    <li>On-site fuel combustion (boilers, furnaces)</li>
                                    <li>Fugitive emissions (refrigerants)</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Zap className="w-12 h-12 text-yellow-500 mb-4" />
                                <CardTitle>Scope 2: Indirect Energy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Emissions from the generation of purchased energy consumed by the company:
                                </p>
                                <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                                    <li>Purchased electricity</li>
                                    <li>Purchased steam</li>
                                    <li>Heating and cooling</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Truck className="w-12 h-12 text-green-600 mb-4" />
                                <CardTitle>Scope 3: Value Chain</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    All other indirect emissions that occur in the value chain:
                                </p>
                                <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                                    <li>Purchased goods and services</li>
                                    <li>Business travel & commuting</li>
                                    <li>Waste disposal</li>
                                    <li>Transportation and distribution</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Standards */}
                <section className="bg-secondary/20 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold mb-8">Aligned with Global Standards</h2>
                        <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
                            <div className="flex items-center gap-2">
                                <Globe className="w-6 h-6" />
                                <span className="font-semibold">GHG Protocol</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-6 h-6" />
                                <span className="font-semibold">ISO 14064-1</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-6 h-6" />
                                <span className="font-semibold">SBTi</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CarbonLanding;
