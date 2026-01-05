import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface MetricRow {
    id: string;
    metric: string;
    unit: string;
    value: string;
    source: string;
    verified: 'Yes' | 'No' | 'Pending';
}

const INITIAL_METRICS: MetricRow[] = [
    { id: 'm1', metric: 'GHG Emissions - Scope 1', unit: 'tCO2e', value: '', source: '', verified: 'No' },
    { id: 'm2', metric: 'GHG Emissions - Scope 2', unit: 'tCO2e', value: '', source: '', verified: 'No' },
    { id: 'm3', metric: 'Energy Consumption (Total)', unit: 'MWh', value: '', source: '', verified: 'No' },
    { id: 'm4', metric: 'Water Withdrawal', unit: 'm3', value: '', source: '', verified: 'No' },
    { id: 'm5', metric: 'Hazardous Waste', unit: 'tonnes', value: '', source: '', verified: 'No' },
    { id: 'm6', metric: 'Employee Headcount', unit: 'count', value: '', source: '', verified: 'No' },
    { id: 'm7', metric: 'Gender Diversity (Female %)', unit: '%', value: '', source: '', verified: 'No' },
    { id: 'm8', metric: 'Health & Safety Incidents', unit: 'count', value: '', source: '', verified: 'No' },
    { id: 'm9', metric: 'Board Independence', unit: '%', value: '', source: '', verified: 'No' },
];

const DataGathering = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<MetricRow[]>(INITIAL_METRICS);

    const updateRow = (id: string, field: keyof MetricRow, val: string) => {
        setData(prev => prev.map(row => row.id === id ? { ...row, [field]: val } : row));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Structured Data Gathering</h2>
                <p className="text-muted-foreground">step 9 of 5: Input your quantitative ESG data points.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ESG Metrics Table</CardTitle>
                    <CardDescription>Enter the data for the key indicators required by your selected frameworks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Metric</TableHead>
                                    <TableHead className="w-[100px]">Unit</TableHead>
                                    <TableHead className="w-[150px]">Value</TableHead>
                                    <TableHead>Source / Evidence</TableHead>
                                    <TableHead className="w-[150px]">Verified?</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="font-medium">{row.metric}</TableCell>
                                        <TableCell className="text-muted-foreground">{row.unit}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={row.value}
                                                onChange={e => updateRow(row.id, 'value', e.target.value)}
                                                className="h-8"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="e.g. Utility Bill"
                                                value={row.source}
                                                onChange={e => updateRow(row.id, 'source', e.target.value)}
                                                className="h-8"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={row.verified}
                                                onValueChange={val => updateRow(row.id, 'verified', val as any)}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Yes">Yes (Third Party)</SelectItem>
                                                    <SelectItem value="No">No (Self Reports)</SelectItem>
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => navigate('/esg-due-diligence/stakeholders')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button onClick={() => navigate('/esg-due-diligence/analysis')}>
                    Next: Analysis & Scoring
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default DataGathering;
