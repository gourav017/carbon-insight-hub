import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, FileText } from "lucide-react";

const ReportGeneration = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8 print:hidden">
                        <h1 className="text-3xl font-bold">GHG Emissions Report</h1>
                        <Button onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" /> Print / Save as PDF
                        </Button>
                    </div>

                    <div className="bg-white text-black p-12 shadow-lg print:shadow-none print:p-0">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-2">2024 GHG Inventory Report</h2>
                            <p className="text-xl text-gray-600">Trace Resource</p>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">Executive Summary</h3>
                                <p className="mb-4">
                                    This report details the greenhouse gas (GHG) emissions inventory for Trace Resource for the reporting period of 2024.
                                    The inventory has been calculated in accordance with the GHG Protocol Corporate Accounting and Reporting Standard.
                                </p>
                                <div className="grid grid-cols-2 gap-8 mb-4">
                                    <div className="bg-gray-100 p-4 rounded">
                                        <div className="text-sm text-gray-600">Total Emissions (Location-Based)</div>
                                        <div className="text-3xl font-bold">1,250.5 tCO2e</div>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded">
                                        <div className="text-sm text-gray-600">Carbon Intensity</div>
                                        <div className="text-3xl font-bold">5.2 tCO2e/FTE</div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">Emissions by Scope</h3>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-300">
                                            <th className="py-2">Scope</th>
                                            <th className="py-2">Emissions (tCO2e)</th>
                                            <th className="py-2">% of Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2">Scope 1: Direct Emissions</td>
                                            <td className="py-2">450.0</td>
                                            <td className="py-2">36.0%</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2">Scope 2: Indirect Energy (Location)</td>
                                            <td className="py-2">300.5</td>
                                            <td className="py-2">24.0%</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2">Scope 3: Value Chain</td>
                                            <td className="py-2">500.0</td>
                                            <td className="py-2">40.0%</td>
                                        </tr>
                                        <tr className="font-bold border-t border-black">
                                            <td className="py-2">Total</td>
                                            <td className="py-2">1,250.5</td>
                                            <td className="py-2">100%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            <section>
                                <h3 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">Methodology</h3>
                                <p className="text-sm text-gray-600">
                                    Calculations utilize emission factors from IPCC 2006, EPA GHG Emission Factors Hub (2023), and UK DEFRA (2023).
                                    Global Warming Potentials (GWP) are based on the IPCC Fifth Assessment Report (AR5).
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ReportGeneration;
