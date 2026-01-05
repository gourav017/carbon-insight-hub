import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Engagement {
    id: string;
    group: string;
    type: string;
    date: string;
    summary: string;
}

const StakeholderEngagement = () => {
    const navigate = useNavigate();
    const [engagements, setEngagements] = useState<Engagement[]>([]);

    // Form State
    const [group, setGroup] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState('');
    const [summary, setSummary] = useState('');

    const addEngagement = () => {
        if (!group || !summary) return;

        setEngagements(prev => [...prev, {
            id: crypto.randomUUID(),
            group,
            type,
            date: date || new Date().toISOString(),
            summary
        }]);

        // Reset
        setGroup('');
        setType('');
        setDate('');
        setSummary('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Stakeholder Engagement</h2>
                <p className="text-muted-foreground">step 8: Log feedback and insights from your key stakeholders.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Log Engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Stakeholder Group</Label>
                            <Select value={group} onValueChange={setGroup}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Employees">Employees</SelectItem>
                                    <SelectItem value="Suppliers">Suppliers</SelectItem>
                                    <SelectItem value="Customers">Customers</SelectItem>
                                    <SelectItem value="Investors">Investors</SelectItem>
                                    <SelectItem value="Community">Local Community</SelectItem>
                                    <SelectItem value="Regulators">Regulators</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Engagement Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Survey">Survey</SelectItem>
                                    <SelectItem value="Interview">Interview</SelectItem>
                                    <SelectItem value="Meeting">Focus Group / Meeting</SelectItem>
                                    <SelectItem value="Grievance">Grievance / Complaint</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Feedback Summary</Label>
                            <Textarea
                                placeholder="Key concerns or suggestions..."
                                value={summary}
                                onChange={e => setSummary(e.target.value)}
                            />
                        </div>

                        <Button className="w-full" onClick={addEngagement} disabled={!group || !summary}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Log
                        </Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Engagement Log</CardTitle>
                        <CardDescription>
                            {engagements.length === 0 ? "No engagements logged." : `${engagements.length} records found.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {engagements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                                <Users className="h-12 w-12 mb-4" />
                                <p>Log your interactions on the left</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {engagements.map((item) => (
                                    <div key={item.id} className="p-4 border rounded-lg bg-card text-sm space-y-2">
                                        <div className="flex justify-between items-center bg-slate-50 -m-4 p-3 mb-2 border-b">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900">{item.group}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white border">{item.type}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {item.date ? format(new Date(item.date), 'MMM d, yyyy') : 'No date'}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 px-1">{item.summary}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={() => navigate('/esg-due-diligence/data-gathering')}>
                    Next: Data Gathering
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default StakeholderEngagement;
