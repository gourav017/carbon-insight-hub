import React from 'react';
import { useESGDueDiligence } from '@/context/ESGDueDiligenceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const REQUIRED_DISCLOSURES = [
    { id: 'd1', label: 'Environmental Policy', category: 'Governance', frameworks: ['All'] },
    { id: 'd2', label: 'GHG Emissions Data (Scope 1&2)', category: 'Environment', frameworks: ['TCFD', 'BRSR', 'CSRD', 'GRI'] },
    { id: 'd3', label: 'Board Diversity Disclosure', category: 'Governance', frameworks: ['BRSR', 'CSRD', 'GRI'] },
    { id: 'd4', label: 'Human Rights Policy', category: 'Social', frameworks: ['GRI', 'CSRD'] },
    { id: 'd5', label: 'Climate Risk Assessment', category: 'Environment', frameworks: ['TCFD', 'CSRD'] },
    { id: 'd6', label: 'Waste Management Data', category: 'Environment', frameworks: ['GRI', 'BRSR'] },
];

const GapAnalysis = () => {
    const navigate = useNavigate();
    const { state } = useESGDueDiligence();

    // Mock logic to check presence
    const checkStatus = (item: typeof REQUIRED_DISCLOSURES[0]) => {
        // 1. Check policies
        const foundPolicy = state.policies.find(p => item.label.includes(p.category) || p.name.includes(item.label));
        if (foundPolicy) return 'Met';

        // 2. Check risk assessment (if applicable)
        if (item.label.includes('Risk') && state.risksAndOpportunities?.length > 0) return 'Partial';

        // Default missing
        return 'Missing';
    };

    const getStatusBadge = (status: string) => {
        if (status === 'Met') return <Badge className="bg-green-500 hover:bg-green-600">Met</Badge>;
        if (status === 'Partial') return <Badge className="bg-yellow-500 hover:bg-yellow-600">Partial</Badge>;
        return <Badge variant="destructive">Missing</Badge>;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Gap Analysis & Disclosure Mapping</h2>
                <p className="text-muted-foreground">step 10 of ...: Comparing your inputs against framework requirements.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Compliance Status</CardTitle>
                    <CardDescription>Based on selected frameworks: {state.selectedFrameworks.join(', ')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Disclosure Requirement</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Applicable Frameworks</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {REQUIRED_DISCLOSURES.map((item) => {
                                const status = checkStatus(item);
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.label}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{item.frameworks.join(', ')}</TableCell>
                                        <TableCell>{getStatusBadge(status)}</TableCell>
                                        <TableCell>
                                            {status === 'Missing' && (
                                                <span className="text-xs text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> Upload Policy / Add Data
                                                </span>
                                            )}
                                            {status === 'Met' && (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => navigate('/esg-due-diligence/data-gathering')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button onClick={() => navigate('/esg-due-diligence/scoring')}>
                    Next: Scoring & Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default GapAnalysis;
