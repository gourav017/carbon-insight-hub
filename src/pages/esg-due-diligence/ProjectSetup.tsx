import React, { useEffect } from 'react';
import { useESGDueDiligence, Region, Purpose, Framework } from '@/context/ESGDueDiligenceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const PURPOSE_OPTIONS: Purpose[] = [
    'Regulatory Compliance',
    'Investor Disclosure',
    'Stakeholder Transparency',
    'Risk Assessment',
    'Integrated Reporting'
];

const ProjectSetup = () => {
    const navigate = useNavigate();
    const { state, setRegion, setPurposes, setSelectedFrameworks } = useESGDueDiligence();

    // Logic to recommend frameworks
    useEffect(() => {
        let frameworks: Framework[] = [];
        const { region, purposes } = state;

        if (region === 'India') frameworks.push('BRSR');
        if (region === 'EU') frameworks.push('CSRD');

        // Global or specific purposes triggers others
        const isGlobal = region === 'Global';
        const hasInvestor = purposes.includes('Investor Disclosure');
        const hasRisk = purposes.includes('Risk Assessment');
        const hasTransparency = purposes.includes('Stakeholder Transparency');

        if (isGlobal || hasInvestor) {
            if (!frameworks.includes('SASB')) frameworks.push('SASB');
            if (!frameworks.includes('TCFD')) frameworks.push('TCFD');
        }

        if (isGlobal || hasTransparency) {
            if (!frameworks.includes('GRI')) frameworks.push('GRI');
        }

        // If "Regulatory Compliance" is selected, ensure regional ones are top priority (already added)

        // Dedupe
        frameworks = Array.from(new Set(frameworks));

        setSelectedFrameworks(frameworks);
    }, [state.region, state.purposes]);

    const handlePurposeToggle = (purpose: Purpose) => {
        const current = state.purposes;
        if (current.includes(purpose)) {
            setPurposes(current.filter(p => p !== purpose));
        } else {
            setPurposes([...current, purpose]);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Project Setup</h2>
                <p className="text-muted-foreground">step 1 of 5: Define your region and goals to select the right frameworks.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>1. Select Region / Jurisdiction</CardTitle>
                    <CardDescription>The legal framework often depends on where your company is headquartered or listed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={state.region || ''} onValueChange={(val) => setRegion(val as Region)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="India">India (BRSR)</SelectItem>
                            <SelectItem value="EU">European Union (CSRD)</SelectItem>
                            <SelectItem value="Global">Global / Other (GRI, SASB, TCFD)</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>2. Purpose of ESQ Due Diligence</CardTitle>
                    <CardDescription>Why are you conducting this assessment? Select all that apply.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {PURPOSE_OPTIONS.map((purpose) => (
                        <div key={purpose} className="flex items-center space-x-2">
                            <Checkbox
                                id={purpose}
                                checked={state.purposes.includes(purpose)}
                                onCheckedChange={() => handlePurposeToggle(purpose)}
                            />
                            <Label htmlFor={purpose}>{purpose}</Label>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {state.selectedFrameworks.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Recommended Frameworks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {state.selectedFrameworks.map(fw => (
                                <span key={fw} className="px-3 py-1 bg-white border rounded-full text-sm font-medium shadow-sm">
                                    {fw}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end pt-4">
                <Button
                    size="lg"
                    onClick={() => navigate('/esg-due-diligence/materiality')}
                    disabled={!state.region || state.purposes.length === 0}
                >
                    Next: Materiality Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default ProjectSetup;
