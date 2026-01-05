import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, TrendingDown, AlertTriangle, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SectorDashboard = () => {
    const navigate = useNavigate();

    // Mock Data for Dashboard
    const totalEmissions = 1336.7;
    const sectors = [
        { name: 'Electricity & Energy', value: 650.5, color: 'bg-yellow-500' },
        { name: 'Industrial', value: 350.2, color: 'bg-gray-500' },
        { name: 'Buildings', value: 156.4, color: 'bg-orange-500' },
        { name: 'Agriculture', value: 125.6, color: 'bg-green-500' },
        { name: 'Transportation', value: 42.8, color: 'bg-blue-500' },
        { name: 'Waste', value: 8.4, color: 'bg-red-500' },
        { name: 'Digital', value: 2.8, color: 'bg-purple-500' },
    ];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/carbon-footprint')} className="pl-0">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
                    </Button>
                    <h1 className="text-3xl font-bold">Comprehensive Carbon Footprint</h1>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Stats */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Total Emissions</CardTitle>
                        <CardDescription>Consolidated footprint across all sectors</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-bold mb-6">
                            {totalEmissions.toLocaleString()} <span className="text-2xl text-muted-foreground font-normal">tCO2e/year</span>
                        </div>

                        <div className="space-y-4">
                            {sectors.map((sector) => (
                                <div key={sector.name} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{sector.name}</span>
                                        <span>{sector.value} tCO2e ({((sector.value / totalEmissions) * 100).toFixed(1)}%)</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${sector.color}`}
                                            style={{ width: `${(sector.value / totalEmissions) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Hotspots & Insights */}
                <div className="space-y-6">
                    <Card className="bg-red-50 border-red-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                <AlertTriangle className="h-5 w-5" /> Hotspot Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                                <div className="font-bold text-red-800">🔥 Priority 1: Grid Electricity</div>
                                <p className="text-sm text-red-600 mt-1">49% of total emissions</p>
                                <div className="mt-2 text-xs text-slate-600">
                                    <strong>Action:</strong> Increase renewable procurement to 75%
                                    <br />
                                    <strong>Impact:</strong> -320 tCO2e
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                                <div className="font-bold text-red-800">🔥 Priority 2: Industrial</div>
                                <p className="text-sm text-red-600 mt-1">26% of total emissions</p>
                                <div className="mt-2 text-xs text-slate-600">
                                    <strong>Action:</strong> Increase recycled content by 30%
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-emerald-50 border-emerald-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-emerald-700">
                                <TreePine className="h-5 w-5" /> Context
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-emerald-800 mb-4">Your footprint is equivalent to:</p>
                            <ul className="space-y-2 text-sm text-emerald-700">
                                <li className="flex items-center gap-2">
                                    🚗 <strong>295,704</strong> miles driven
                                </li>
                                <li className="flex items-center gap-2">
                                    ✈️ <strong>1,533</strong> round-trip flights (NYC-LHR)
                                </li>
                                <li className="flex items-center gap-2">
                                    🌲 <strong>60,759</strong> tree seedlings grown for 10 years
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SectorDashboard;
