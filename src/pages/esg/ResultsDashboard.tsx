import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadAssessmentData,
  clearAssessmentData,
  saveToHistory,
  getHistory,
  deleteFromHistory,
  ESGHistoryItem
} from "@/lib/esg/storage";
import {
  Download,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  History,
  Save,
  Trash2,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { calculateESGScores } from "@/lib/esg/scoring";
import { generateRecommendations } from "@/lib/esg/recommendations";

const getRiskColor = (level: string) => {
  switch (level) {
    case "low": return "bg-green-500 hover:bg-green-600";
    case "medium": return "bg-yellow-500 hover:bg-yellow-600";
    case "high": return "bg-orange-500 hover:bg-orange-600";
    case "critical": return "bg-red-500 hover:bg-red-600";
    default: return "bg-slate-500";
  }
};

const getAlignmentColor = (alignment: string) => {
  switch (alignment) {
    case "fully-aligned": return "text-green-600";
    case "partially-aligned": return "text-yellow-600";
    case "developing": return "text-orange-600";
    case "not-aligned": return "text-red-600";
    case "critical-gaps": return "text-red-700";
    default: return "text-slate-600";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "destructive";
    case "high": return "destructive";
    case "medium": return "secondary";
    default: return "outline";
  }
}

const benchmark = {
  averageE: 45,
  topQuartileE: 75,
  averageS: 50,
  topQuartileS: 80,
  averageG: 55,
  topQuartileG: 85
};

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const assessmentData = loadAssessmentData();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<ESGHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  if (!assessmentData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Assessment Data Found</h2>
            <p className="text-muted-foreground mb-6">Please start a new assessment to see results.</p>
            <Button onClick={() => navigate("/esg-assessment")}>Start New Assessment</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const scores = calculateESGScores(assessmentData);
  const recommendations = generateRecommendations(scores, assessmentData.profile.industrySector || "manufacturing");

  const handleStartNew = () => {
    if (window.confirm("Are you sure you want to start a new assessment? This will clear your current data.")) {
      clearAssessmentData();
      navigate("/esg-assessment");
    }
  };

  const handleSaveToHistory = () => {
    saveToHistory(assessmentData, Math.round(scores.composite), scores.alignmentClassification);
    toast({
      title: "Result Saved",
      description: "This assessment has been saved to your history.",
    });
    loadHistory();
  };

  const loadHistory = () => {
    setHistoryItems(getHistory());
  };

  const handleDeleteHistory = (id: string) => {
    deleteFromHistory(id);
    loadHistory();
  };

  const handleLoadHistoryItem = (item: ESGHistoryItem) => {
    if (confirm("Load this historical assessment? Current progress will be overwritten.")) {
      // We need a way to "load" this data back into the active state
      // For now, we can just view it, but to "restore" it we would overwrite localStorage
      localStorage.setItem("esg_assessment_data", JSON.stringify(item.data));
      window.location.reload(); // Simple reload to refresh state
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">ESG Assessment Results</h1>
              <p className="text-muted-foreground mt-2">{assessmentData.profile.organizationName}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Dialog open={historyOpen} onOpenChange={(open) => {
                setHistoryOpen(open);
                if (open) loadHistory();
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Assessment History</DialogTitle>
                    <DialogDescription>
                      View and restore your past assessment results.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] mt-4">
                    {historyItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No saved history found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {historyItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                            <div>
                              <div className="font-semibold">
                                {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Score: <span className="font-medium text-primary">{item.score}</span> • {item.rating.replace('-', ' ')}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleLoadHistoryItem(item)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteHistory(item.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={handleSaveToHistory}>
                <Save className="w-4 h-4 mr-2" />
                Save Result
              </Button>

              <Button variant="outline" onClick={handleStartNew}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New
              </Button>
              <Button onClick={() => navigate("/esg-assessment/report")}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          <Card className="p-8 mb-8 border-2">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-semibold text-muted-foreground mb-2">Composite ESG Score</h2>
                <div className="text-7xl font-bold text-primary mb-4">{Math.round(scores.composite)}</div>
                <p className={`text-xl font-semibold ${getAlignmentColor(scores.alignmentClassification)}`}>
                  {scores.alignmentClassification.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-medium">ESG Risk Level</span>
                  <Badge className={getRiskColor(scores.riskLevel)}>
                    {scores.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <Progress value={scores.composite} className="h-4" />
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {assessmentData.profile.industrySector?.replace('-', ' ').toUpperCase()} sector weighting
                </p>
              </div>
            </div>
          </Card>

          {/* Pillar Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Environmental</h3>
                <span className="text-3xl font-bold text-primary">{Math.round(scores.environmental.total)}</span>
              </div>
              <Progress value={scores.environmental.total} className="mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sector Average:</span>
                  <span className="font-medium">{benchmark.averageE}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Top Quartile:</span>
                  <span className="font-medium">{benchmark.topQuartileE}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {scores.environmental.total > benchmark.averageE ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-xs">Above average</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-600 text-xs">Below average</span>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Social</h3>
                <span className="text-3xl font-bold text-primary">{Math.round(scores.social.total)}</span>
              </div>
              <Progress value={scores.social.total} className="mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sector Average:</span>
                  <span className="font-medium">{benchmark.averageS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Top Quartile:</span>
                  <span className="font-medium">{benchmark.topQuartileS}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {scores.social.total > benchmark.averageS ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-xs">Above average</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-600 text-xs">Below average</span>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Governance</h3>
                <span className="text-3xl font-bold text-primary">{Math.round(scores.governance.total)}</span>
              </div>
              <Progress value={scores.governance.total} className="mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sector Average:</span>
                  <span className="font-medium">{benchmark.averageG}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Top Quartile:</span>
                  <span className="font-medium">{benchmark.topQuartileG}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {scores.governance.total > benchmark.averageG ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-xs">Above average</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-600 text-xs">Below average</span>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Prioritized Recommendations</h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {rec.priority === "critical" ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                      <h3 className="font-semibold text-foreground">{rec.issue}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Fixed Badge usage with correct helper */}
                      <Badge variant={getPriorityColor(rec.priority) as any}>
                        {rec.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rec.impact}</p>
                  <div className="bg-secondary/50 rounded p-3 mb-3">
                    <p className="text-sm font-medium text-foreground mb-1">Recommended Action:</p>
                    <p className="text-sm text-foreground">{rec.action}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Timeline: <span className="font-medium text-foreground">{rec.timeline}</span></span>
                      <span>Score Impact: <span className="font-medium text-green-600">+{rec.scoreImprovement}</span></span>
                      <span>Complexity: <span className="font-medium text-foreground">{rec.complexity}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Environmental Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>GHG Emissions</span>
                    <span className="font-medium">{Math.round(scores.environmental.ghgEmissions)}/30</span>
                  </div>
                  <Progress value={(scores.environmental.ghgEmissions / 30) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy & Renewable</span>
                    <span className="font-medium">{Math.round(scores.environmental.energyRenewable)}/25</span>
                  </div>
                  <Progress value={(scores.environmental.energyRenewable / 25) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Water Management</span>
                    <span className="font-medium">{Math.round(scores.environmental.waterManagement)}/15</span>
                  </div>
                  <Progress value={(scores.environmental.waterManagement / 15) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Waste Management</span>
                    <span className="font-medium">{Math.round(scores.environmental.wasteManagement)}/15</span>
                  </div>
                  <Progress value={(scores.environmental.wasteManagement / 15) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Biodiversity</span>
                    <span className="font-medium">{Math.round(scores.environmental.biodiversity)}/15</span>
                  </div>
                  <Progress value={(scores.environmental.biodiversity / 15) * 100} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Social Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Health & Safety</span>
                    <span className="font-medium">{Math.round(scores.social.healthSafety)}/25</span>
                  </div>
                  <Progress value={(scores.social.healthSafety / 25) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Labor Practices</span>
                    <span className="font-medium">{Math.round(scores.social.laborPractices)}/20</span>
                  </div>
                  <Progress value={(scores.social.laborPractices / 20) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Diversity & Inclusion</span>
                    <span className="font-medium">{Math.round(scores.social.diversityEquityInclusion)}/25</span>
                  </div>
                  <Progress value={(scores.social.diversityEquityInclusion / 25) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Human Rights</span>
                    <span className="font-medium">{Math.round(scores.social.humanRights)}/15</span>
                  </div>
                  <Progress value={(scores.social.humanRights / 15) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Customer & Community</span>
                    <span className="font-medium">{Math.round(scores.social.customerCommunity)}/15</span>
                  </div>
                  <Progress value={(scores.social.customerCommunity / 15) * 100} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Governance Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Board Structure</span>
                    <span className="font-medium">{Math.round(scores.governance.boardStructure)}/25</span>
                  </div>
                  <Progress value={(scores.governance.boardStructure / 25) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compensation</span>
                    <span className="font-medium">{Math.round(scores.governance.executiveComp)}/15</span>
                  </div>
                  <Progress value={(scores.governance.executiveComp / 15) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ethics & Compliance</span>
                    <span className="font-medium">{Math.round(scores.governance.ethicsCompliance)}/25</span>
                  </div>
                  <Progress value={(scores.governance.ethicsCompliance / 25) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Transparency</span>
                    <span className="font-medium">{Math.round(scores.governance.transparencyDisclosure)}/20</span>
                  </div>
                  <Progress value={(scores.governance.transparencyDisclosure / 20) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Risk Management</span>
                    <span className="font-medium">{Math.round(scores.governance.riskControls)}/15</span>
                  </div>
                  <Progress value={(scores.governance.riskControls / 15) * 100} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultsDashboard;
