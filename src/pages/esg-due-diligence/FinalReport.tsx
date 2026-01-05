import React from 'react';
import { useESGDueDiligence } from '@/context/ESGDueDiligenceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Printer, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinalReport = () => {
    const navigate = useNavigate();
    const { state } = useESGDueDiligence();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">

            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border print:hidden">
                <Button variant="ghost" onClick={() => navigate('/esg-due-diligence/scoring')}>Back</Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button>
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Report Content */}
            <div className="bg-white p-8 md:p-12 shadow-lg border rounded-xl print:shadow-none print:border-none">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-slate-900">ESG Due Diligence Report</h1>
                    <p className="text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-8">
                    {/* Section 1: Context */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">1. Business Context</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block">Region</span>
                                <span className="font-medium">{state.region || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block">Selected Frameworks</span>
                                <span className="font-medium">{state.selectedFrameworks.join(', ')}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-muted-foreground block">Assessment Purpose</span>
                                <span className="font-medium">{state.purposes.join(', ')}</span>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Materiality */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">2. Material Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            {state.materialTopics.filter(t => t.isMaterial).map(t => (
                                <span key={t.id} className="px-3 py-1 bg-slate-100 rounded-full text-sm border">
                                    {t.name}
                                </span>
                            ))}
                            {state.materialTopics.filter(t => t.isMaterial).length === 0 && (
                                <span className="text-muted-foreground italic">No material topics selected.</span>
                            )}
                        </div>
                    </section>

                    {/* Section 3: Policies */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">3. Policy Inventory</h3>
                        <ul className="space-y-2 text-sm">
                            {state.policies.map(p => (
                                <li key={p.id} className="flex justify-between">
                                    <span>{p.name} <span className="text-muted-foreground">({p.category})</span></span>
                                    <span className="text-green-600">Uploaded</span>
                                </li>
                            ))}
                            {state.policies.length === 0 && (
                                <span className="text-muted-foreground italic">No policies uploaded.</span>
                            )}
                        </ul>
                    </section>

                    {/* Section 4: Risks */}
                    <section>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">4. Risk & Opportunities</h3>
                        <div className="text-sm text-muted-foreground">
                            Refer to detailed annexure for full risk catalogue analysis.
                        </div>
                    </section>

                    <Separator className="my-8" />

                    {/* Footer */}
                    <div className="text-center text-xs text-muted-foreground">
                        <p>Trace Resource | Carbon & ESG Insight Hub</p>
                        <p>This report assumes validity of user-supplied data.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalReport;
