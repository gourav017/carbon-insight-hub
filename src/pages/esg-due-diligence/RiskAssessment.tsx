import React, { useState } from 'react';
import { useESGDueDiligence } from '@/context/ESGDueDiligenceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const RISK_CATALOGUE = [
    { id: 'r1', category: 'Environmental', label: 'High greenhouse-gas emissions / Carbon tax risk' },
    { id: 'r2', category: 'Environmental', label: 'Energy intensive operations / Cost volatility' },
    { id: 'r3', category: 'Environmental', label: 'Water scarcity / Water stress' },
    { id: 'r4', category: 'Social', label: 'Unsafe working conditions / Health & Safety liability' },
    { id: 'r5', category: 'Social', label: 'Labor rights violations (forced labor, unfair wages)' },
    { id: 'r6', category: 'Social', label: 'Supply chain disruption due to poor ESG' },
    { id: 'r7', category: 'Governance', label: 'Weak ESG governance / Compliance failure' },
    { id: 'r8', category: 'Governance', label: 'Lack of transparency / Investor distrust' },
];

const OPPORTUNITY_CATALOGUE = [
    { id: 'o1', category: 'Environmental', label: 'Energy efficiency & Cost savings' },
    { id: 'o2', category: 'Environmental', label: 'Renewable energy adoption / Brand value' },
    { id: 'o3', category: 'Environmental', label: 'Circular economy / Waste reduction' },
    { id: 'o4', category: 'Social', label: 'Improved employee retention & productivity' },
    { id: 'o5', category: 'Social', label: 'Stronger supply chain relationships' },
    { id: 'o6', category: 'Governance', label: 'Access to green finance / Lower cost of capital' },
    { id: 'o7', category: 'Governance', label: 'Competitive differentiation through sustainability' },
];

const RiskAssessment = () => {
    const navigate = useNavigate();
    const { state } = useESGDueDiligence(); // We would add update logic here if we had a specific setter
    // For demo purposes, using local state, ideally synced to context
    const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
    const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);

    const toggleRisk = (id: string) => {
        setSelectedRisks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleOpp = (id: string) => {
        setSelectedOpportunities(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Risk & Opportunity Analysis</h2>
                <p className="text-muted-foreground">step 4 of 5: Identify key risks to mitigate and opportunities to leverage.</p>
            </div>

            <Tabs defaultValue="risks" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="risks">ESG Risks</TabsTrigger>
                    <TabsTrigger value="opportunities">ESG Opportunities</TabsTrigger>
                </TabsList>

                <TabsContent value="risks">
                    <Card>
                        <CardHeader>
                            <CardTitle>Potential Risks</CardTitle>
                            <CardDescription>Select all that apply to your business.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {['Environmental', 'Social', 'Governance'].map(cat => (
                                <div key={cat} className="space-y-3">
                                    <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">{cat}</h4>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {RISK_CATALOGUE.filter(r => r.category === cat).map(risk => (
                                            <div key={risk.id} className="flex items-start space-x-2 p-2 rounded hover:bg-slate-50">
                                                <Checkbox
                                                    id={risk.id}
                                                    checked={selectedRisks.includes(risk.id)}
                                                    onCheckedChange={() => toggleRisk(risk.id)}
                                                />
                                                <Label htmlFor={risk.id} className="cursor-pointer leading-tight">{risk.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="opportunities">
                    <Card>
                        <CardHeader>
                            <CardTitle>Strategic Opportunities</CardTitle>
                            <CardDescription>Select areas where ESG can drive value.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {['Environmental', 'Social', 'Governance'].map(cat => (
                                <div key={cat} className="space-y-3">
                                    <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">{cat}</h4>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {OPPORTUNITY_CATALOGUE.filter(o => o.category === cat).map(opp => (
                                            <div key={opp.id} className="flex items-start space-x-2 p-2 rounded hover:bg-slate-50">
                                                <Checkbox
                                                    id={opp.id}
                                                    checked={selectedOpportunities.includes(opp.id)}
                                                    onCheckedChange={() => toggleOpp(opp.id)}
                                                />
                                                <Label htmlFor={opp.id} className="cursor-pointer leading-tight">{opp.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => navigate('/esg-due-diligence/policies')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button onClick={() => navigate('/esg-due-diligence/data-process')}>
                    Next: Data Process Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default RiskAssessment;
