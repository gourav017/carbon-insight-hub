import React, { useState } from 'react';
import { useESGDueDiligence } from '@/context/ESGDueDiligenceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DataProcessReview = () => {
    const navigate = useNavigate();
    // In a real app, bind these to context "processAnswers"
    const [dataSource, setDataSource] = useState('');
    const [frequency, setFrequency] = useState('');
    const [validator, setValidator] = useState('');
    const [system, setSystem] = useState('');

    const handleNext = () => {
        // Save logic would go here
        navigate('/esg-due-diligence/stakeholders');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Data Collection Review</h2>
                <p className="text-muted-foreground">step 7: Review your internal data governance processes.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Process Questionnaire</CardTitle>
                    <CardDescription>Understanding how you currently manage ESG data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Primary Data Sources</Label>
                        <Input
                            placeholder="e.g. Utility bills, ERP, HR portal, Manual logs"
                            value={dataSource}
                            onChange={e => setDataSource(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Collection Frequency</Label>
                        <Select value={frequency} onValueChange={setFrequency}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                                <SelectItem value="Annually">Annually</SelectItem>
                                <SelectItem value="Ad-hoc">Ad-hoc / As needed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Who Validates the Data?</Label>
                        <Select value={validator} onValueChange={setValidator}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Validation Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Self-Reported">Self-Reported (No check)</SelectItem>
                                <SelectItem value="Internal Audit">Internal Audit / Manager Review</SelectItem>
                                <SelectItem value="External Audit">External Third-Party Audit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>System Used</Label>
                        <Input
                            placeholder="e.g. Excel, SAP, Specialized ESG Software"
                            value={system}
                            onChange={e => setSystem(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button onClick={handleNext}>
                    Next: Stakeholder Engagement
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default DataProcessReview;
