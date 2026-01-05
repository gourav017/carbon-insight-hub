import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Globe, FileText, BarChart3 } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">ESG Due Diligence Framework</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    A comprehensive tool to align your business with global and regional ESG standards including GRI, SASB, TCFD, BRSR, and CSRD.
                </p>
                <Button size="lg" onClick={() => navigate('/esg-due-diligence/setup')} className="mt-4">
                    Start Assessment
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Card>
                    <CardHeader>
                        <Globe className="h-10 w-10 text-primary mb-2" />
                        <CardTitle>Regional Alignment</CardTitle>
                        <CardDescription>
                            Automatically selects the right framework based on your jurisdiction (e.g., BRSR for India, CSRD for EU).
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                        <CardTitle>Compliance & Risk</CardTitle>
                        <CardDescription>
                            Identify material risks, climate opportunities, and compliance gaps in your current policies.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <FileText className="h-10 w-10 text-primary mb-2" />
                        <CardTitle>Disclosure Mapping</CardTitle>
                        <CardDescription>
                            Map your data directly to disclosure requirements and generate traceability reports.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <BarChart3 className="h-10 w-10 text-primary mb-2" />
                        <CardTitle>Scoring & Reporting</CardTitle>
                        <CardDescription>
                            Get a detailed ESG maturity score and expert recommendations for improvement.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

export default Landing;
