import React, { useState, useEffect } from 'react';
import { useESGDueDiligence, MaterialTopic } from '@/context/ESGDueDiligenceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const DEFAULT_TOPICS = [
    // Environmental
    { name: 'GHG Emissions (Scope 1, 2, 3)', category: 'Environment' },
    { name: 'Energy Management', category: 'Environment' },
    { name: 'Water & Wastewater', category: 'Environment' },
    { name: 'Waste & Hazardous Materials', category: 'Environment' },
    { name: 'Biodiversity & Land Use', category: 'Environment' },

    // Social
    { name: 'Labor Practices & Human Rights', category: 'Social' },
    { name: 'Employee Health & Safety', category: 'Social' },
    { name: 'Diversity, Equity & Inclusion', category: 'Social' },
    { name: 'Community Relations', category: 'Social' },
    { name: 'Data Privacy & Security', category: 'Social' },

    // Governance
    { name: 'Business Ethics & Corruption', category: 'Governance' },
    { name: 'Board Diversity & Structure', category: 'Governance' },
    { name: 'Risk Management', category: 'Governance' },
    { name: 'Supply Chain Management', category: 'Governance' },
];

const MaterialityAssessment = () => {
    const navigate = useNavigate();
    const { state, updateMaterialTopics } = useESGDueDiligence();
    const [localTopics, setLocalTopics] = useState<MaterialTopic[]>([]);

    useEffect(() => {
        // Initialize topics if empty, otherwise use existing
        if (state.materialTopics.length === 0) {
            const initial = DEFAULT_TOPICS.map((t, idx) => ({
                id: `topic-${idx}`,
                name: t.name,
                isMaterial: false,
                category: t.category
            }));
            setLocalTopics(initial);
        } else {
            setLocalTopics(state.materialTopics);
        }
    }, [state.materialTopics]);

    const toggleTopic = (id: string) => {
        setLocalTopics(prev => prev.map(t =>
            t.id === id ? { ...t, isMaterial: !t.isMaterial } : t
        ));
    };

    const handleSave = () => {
        updateMaterialTopics(localTopics);
        navigate('/esg-due-diligence/policies');
    };

    // Grouping for UI
    const grouped = localTopics.reduce((acc, topic) => {
        const cat = (topic as any).category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(topic);
        return acc;
    }, {} as Record<string, MaterialTopic[]>);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Materiality Assessment</h2>
                <p className="text-muted-foreground">step 2 of 5: Identify the ESG issues that are most critical to your business context.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Material Topics</CardTitle>
                    <CardDescription>
                        Toggle the topics that impact your business or that your business impacts significantly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Object.entries(grouped).map(([category, topics]) => (
                        <div key={category} className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800">{category}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {topics.map((topic) => (
                                    <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                        <Label htmlFor={topic.id} className="cursor-pointer flex-1">
                                            {topic.name}
                                        </Label>
                                        <Switch
                                            id={topic.id}
                                            checked={topic.isMaterial}
                                            onCheckedChange={() => toggleTopic(topic.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Separator />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => navigate('/esg-due-diligence/setup')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button onClick={handleSave}>
                    Next: Policy Input
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default MaterialityAssessment;
