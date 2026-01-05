import React from 'react';
import { useESGDueDiligence } from '@/context/ESGDueDiligenceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileOutput } from 'lucide-react';

const ScoringDashboard = () => {
    const navigate = useNavigate();
    const { state } = useESGDueDiligence();

    // Mock Scoring Logic
    // In real app, this would be a complex reduction of all state
    const scores = {
        environment: 65,
        social: 40,
        governance: 80,
        overall: 62
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">ESG Maturity Score</h2>
                <p className="text-muted-foreground">Evaluation of strengths and weaknesses.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <Card className="col-span-4 md:col-span-1 bg-slate-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold text-center text-primary">{scores.overall}/100</CardTitle>
                        <CardDescription className="text-center text-slate-300">Overall Maturity</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="col-span-4 md:col-span-3">
                    <CardHeader>
                        <CardTitle>Pillar Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Environmental</span>
                                <span className="font-semibold">{scores.environment}%</span>
                            </div>
                            <Progress value={scores.environment} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Social</span>
                                <span className="font-semibold">{scores.social}%</span>
                            </div>
                            <Progress value={scores.social} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Governance</span>
                                <span className="font-semibold">{scores.governance}%</span>
                            </div>
                            <Progress value={scores.governance} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Key Observations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Strong governance structure with policies in place.</li>
                        <li>Environmental data is improving but Scope 3 is missing.</li>
                        <li>Social indicators need better tracking regarding Diversity & Inclusion.</li>
                        <li>Stakeholder engagement process is robust.</li>
                    </ul>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => navigate('/esg-due-diligence/gap-analysis')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button size="lg" onClick={() => navigate('/esg-due-diligence/report')}>
                    <FileOutput className="mr-2 h-4 w-4" />
                    Generate Final Report
                </Button>
            </div>
        </div>
    );
};

export default ScoringDashboard;
