import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loadAssessmentData } from "@/lib/esg/storage";
import { calculateESGScores } from "@/lib/esg/scoring";
import { generateRecommendations } from "@/lib/esg/recommendations";
import { Printer, Download, ArrowLeft } from "lucide-react";

const ReportGeneration = () => {
    const navigate = useNavigate();
    const assessmentData = loadAssessmentData();
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!assessmentData || !assessmentData.completionStatus.governance) {
            navigate("/esg-assessment");
        }
    }, [assessmentData, navigate]);

    if (!assessmentData) return null;

    const scores = calculateESGScores(assessmentData);
    const recommendations = generateRecommendations(scores, assessmentData.profile.industrySector);

    const handlePrint = () => {
        window.print();
    };

    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <div className="print:hidden">
                <Header />
            </div>

            <main className="flex-1 container mx-auto px-4 py-8 print:p-0 print:max-w-none">
                <div className="max-w-5xl mx-auto">
                    {/* Actions Bar */}
                    <div className="flex justify-between items-center mb-8 print:hidden">
                        <Button variant="outline" onClick={() => navigate("/esg-assessment/results")}>
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
                        </Button>
                        <div className="flex gap-2">
                            <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700">
                                <Printer className="mr-2 w-4 h-4" /> Print / Save as PDF
                            </Button>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div ref={reportRef} className="bg-white shadow-lg print:shadow-none p-12 rounded-lg min-h-[1123px] print:min-h-0">
                        {/* Report Header */}
                        <div className="text-center mb-12 border-b pb-8">
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">ESG Assessment Report</h1>
                            <p className="text-xl text-slate-600">{assessmentData.profile.organizationName}</p>
                            <p className="text-sm text-slate-400 mt-4">Generated on {currentDate}</p>
                        </div>

                        {/* Executive Summary */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Executive Summary</h2>
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Composite Score</p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-5xl font-bold text-emerald-600">{Math.round(scores.composite)}</span>
                                            <span className="text-slate-400">/ 100</span>
                                        </div>
                                        <p className="text-emerald-700 font-medium mt-2">
                                            {scores.alignmentClassification.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Risk Level</p>
                                        <p className={`text-2xl font-bold mt-1 ${scores.riskLevel === 'low' ? 'text-green-600' :
                                            scores.riskLevel === 'medium' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {scores.riskLevel.toUpperCase()}
                                        </p>
                                        <p className="text-slate-600 text-sm mt-2">
                                            Based on {assessmentData.profile.industrySector} sector benchmarks.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pillar Breakdown */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Performance by Pillar</h2>
                            <div className="grid grid-cols-3 gap-8">
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold text-slate-700 mb-2">Environmental</h3>
                                    <div className="text-3xl font-bold text-emerald-600 mb-1">{Math.round(scores.environmental.total)}</div>
                                    <div className="text-xs text-slate-500 space-y-1">
                                        <div className="flex justify-between"><span>GHG Emissions:</span> <span>{Math.round(scores.environmental.ghgEmissions)}/30</span></div>
                                        <div className="flex justify-between"><span>Energy:</span> <span>{Math.round(scores.environmental.energyRenewable)}/25</span></div>
                                        <div className="flex justify-between"><span>Water & Waste:</span> <span>{Math.round(scores.environmental.waterManagement + scores.environmental.wasteManagement)}/30</span></div>
                                    </div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold text-slate-700 mb-2">Social</h3>
                                    <div className="text-3xl font-bold text-blue-600 mb-1">{Math.round(scores.social.total)}</div>
                                    <div className="text-xs text-slate-500 space-y-1">
                                        <div className="flex justify-between"><span>Health & Safety:</span> <span>{Math.round(scores.social.healthSafety)}/25</span></div>
                                        <div className="flex justify-between"><span>Labor & DEI:</span> <span>{Math.round(scores.social.laborPractices + scores.social.diversityEquityInclusion)}/45</span></div>
                                        <div className="flex justify-between"><span>Community:</span> <span>{Math.round(scores.social.customerCommunity)}/15</span></div>
                                    </div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold text-slate-700 mb-2">Governance</h3>
                                    <div className="text-3xl font-bold text-purple-600 mb-1">{Math.round(scores.governance.total)}</div>
                                    <div className="text-xs text-slate-500 space-y-1">
                                        <div className="flex justify-between"><span>Board Structure:</span> <span>{Math.round(scores.governance.boardStructure)}/25</span></div>
                                        <div className="flex justify-between"><span>Ethics:</span> <span>{Math.round(scores.governance.ethicsCompliance)}/25</span></div>
                                        <div className="flex justify-between"><span>Transparency:</span> <span>{Math.round(scores.governance.transparencyDisclosure)}/20</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Key Recommendations */}
                        <div className="mb-12 break-inside-avoid">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Strategic Recommendations</h2>
                            <div className="space-y-4">
                                {recommendations.slice(0, 5).map((rec, index) => (
                                    <div key={index} className="border-l-4 border-emerald-500 pl-4 py-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-800">{rec.issue}</h3>
                                            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600 uppercase">{rec.priority}</span>
                                        </div>
                                        <p className="text-slate-600 mt-1 text-sm">{rec.action}</p>
                                        <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                            <span>Impact: +{rec.scoreImprovement} pts</span>
                                            <span>Timeline: {rec.timeline}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-auto pt-8 border-t text-xs text-slate-400 text-center">
                            <p>This report is generated based on self-reported data. The scores and recommendations are indicative and should be used for internal guidance only. This does not constitute a formal audit or certification.</p>
                            <p className="mt-1">© {new Date().getFullYear()} Carbon Insight Hub. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </main>
            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
};

export default ReportGeneration;
