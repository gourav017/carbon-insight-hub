import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GRID_REGIONS } from '../../../lib/carbon/sectors/factors';

const Methodology = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Button variant="ghost" onClick={() => navigate('/carbon-footprint')} className="mb-6 pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <BookOpen className="h-8 w-8" />
                    Methodology Library
                </h1>
                <p className="text-muted-foreground mt-2">
                    Transparent documentation of emission factors, formulas, and sources used in this calculator.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">1. Electricity Grid Factors</h2>
                    <p className="text-muted-foreground mb-4">
                        Grid emission factors represent the average CO2e intensity of electricity generation in a specific region.
                        Sources include IEA 2023, EPA eGRID 2023, and national government publications.
                    </p>
                    <Card>
                        <CardContent className="p-0">
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="p-4 font-medium">Region</th>
                                            <th className="p-4 font-medium">Factor (kg CO2e/kWh)</th>
                                            <th className="p-4 font-medium">Source</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {GRID_REGIONS.slice(0, 10).map((region) => (
                                            <tr key={region.id}>
                                                <td className="p-4">{region.name}</td>
                                                <td className="p-4 font-mono">{region.factor}</td>
                                                <td className="p-4 text-muted-foreground">{region.source}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center text-muted-foreground italic">
                                                ...and {GRID_REGIONS.length - 10} more regions
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">2. Transportation Formulas</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vehicle Emissions</CardTitle>
                            </CardHeader>
                            <CardContent className="font-mono text-sm bg-slate-50 p-6 rounded-b-lg">
                                Emissions = Distance × Factor
                                <br /><br />
                                Where Factor depends on:
                                <br />- Vehicle Type (Car, Van, Truck)
                                <br />- Fuel (Gasoline, Diesel, EV)
                                <br />- Size (Small, Medium, Large)
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Flight Emissions</CardTitle>
                            </CardHeader>
                            <CardContent className="font-mono text-sm bg-slate-50 p-6 rounded-b-lg">
                                Emissions = Dist × Factor × Pax × RF
                                <br /><br />
                                - Dist: Great Circle Distance
                                <br />- Factor: Based on haul length & class
                                <br />- RF: Radiative Forcing (1.9x)
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Methodology;
