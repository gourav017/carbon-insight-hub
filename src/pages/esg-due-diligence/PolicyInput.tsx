import React, { useState } from 'react';
import { useESGDueDiligence, PolicyDocument } from '@/context/ESGDueDiligenceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Trash2, FileText } from 'lucide-react';

const PolicyInput = () => {
    const navigate = useNavigate();
    const { state, addPolicy, removePolicy } = useESGDueDiligence();

    // Local state for new policy form
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState<string>('');
    const [newContent, setNewContent] = useState('');

    const handleAdd = () => {
        if (!newName || !newCategory) return;

        const policy: PolicyDocument = {
            id: crypto.randomUUID(),
            name: newName,
            category: newCategory as any,
            textParams: newContent,
            status: 'Uploaded'
        };

        addPolicy(policy);
        setNewName('');
        setNewCategory('');
        setNewContent('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">ESG Policy Input</h2>
                <p className="text-muted-foreground">step 3 of 5: Upload or input your existing policies for review.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Form Column */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">Add Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="p-name">Policy Name</Label>
                            <Input
                                id="p-name"
                                placeholder="e.g. Environmental Policy"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="p-cat">Category</Label>
                            <Select value={newCategory} onValueChange={setNewCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Environment">Environment</SelectItem>
                                    <SelectItem value="Social">Social / Labor</SelectItem>
                                    <SelectItem value="Governance">Governance</SelectItem>
                                    <SelectItem value="Ethics">Ethics & Compliance</SelectItem>
                                    <SelectItem value="Climate">Climate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="p-content">Content / Notes</Label>
                            <Textarea
                                id="p-content"
                                placeholder="Paste policy text or notes here..."
                                className="min-h-[100px]"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>File Upload (Placeholder)</Label>
                            <div className="border-2 border-dashed rounded-md p-4 text-center text-sm text-muted-foreground">
                                File upload pending backend
                            </div>
                        </div>

                        <Button className="w-full" onClick={handleAdd} disabled={!newName || !newCategory}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Document
                        </Button>
                    </CardContent>
                </Card>

                {/* List Column */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Uploaded Documents</CardTitle>
                        <CardDescription>
                            {state.policies.length === 0 ? "No policies added yet." : `${state.policies.length} documents provided.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {state.policies.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                                <FileText className="h-12 w-12 mb-4" />
                                <p>Add your policies on the left</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {state.policies.map((policy) => (
                                    <div key={policy.id} className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-slate-50 transition-colors group">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{policy.name}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 border text-slate-600">
                                                    {policy.category}
                                                </span>
                                            </div>
                                            {policy.textParams && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">{policy.textParams}</p>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removePolicy(policy.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => navigate('/esg-due-diligence/materiality')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button onClick={() => navigate('/esg-due-diligence/risks')}>
                    Next: Risk & Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default PolicyInput;
