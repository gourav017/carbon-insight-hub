import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart3,
  ShieldCheck,
  Users,
  Globe,
  ArrowRight,
  FileText,
  CheckCircle2,
  TrendingUp,
  Award
} from "lucide-react";
import { loadAssessmentData, getCompletionPercentage, formatLastSaved } from "@/lib/esg/storage";

const ESGLanding = () => {
  const navigate = useNavigate();
  const savedData = loadAssessmentData();
  const completionPercent = savedData ? getCompletionPercentage(savedData) : 0;

  const handleStartNew = () => {
    if (savedData && completionPercent > 0) {
      if (confirm("You have a saved assessment. Starting a new one will overwrite your progress. Continue?")) {
        navigate("/esg-assessment/profile");
      }
    } else {
      navigate("/esg-assessment/profile");
    }
  };

  const handleResume = () => {
    navigate("/esg-assessment/profile");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
                <Globe className="w-4 h-4 mr-2" />
                Comprehensive ESG Assessment
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Measure, Manage, and Master Your <span className="text-emerald-600">Sustainability Impact</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                A professional-grade platform to assess your organization's Environmental, Social, and Governance performance against global standards (GRI, SASB, TCFD). Get actionable insights and a roadmap to sustainability leadership.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                  onClick={handleStartNew}
                >
                  Start Assessment <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                {savedData && completionPercent > 0 && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={handleResume}
                  >
                    Resume ({Math.round(completionPercent)}%)
                  </Button>
                )}
              </div>
              {savedData && (
                <p className="text-sm text-slate-500 mt-3">
                  Last saved: {formatLastSaved()}
                </p>
              )}
            </div>
            <div className="relative hidden md:block">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <Globe className="w-8 h-8 text-emerald-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">Environmental</div>
                    <div className="text-sm text-slate-600">Carbon, Energy, Waste</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <Users className="w-8 h-8 text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">Social</div>
                    <div className="text-sm text-slate-600">Workforce, Community</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <ShieldCheck className="w-8 h-8 text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">Governance</div>
                    <div className="text-sm text-slate-600">Ethics, Compliance</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-amber-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">Results</div>
                    <div className="text-sm text-slate-600">Actionable Analytics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Use Our Platform?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Designed for modern enterprises to streamline ESG reporting and drive real impact.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle>Standardized Reporting</CardTitle>
              <CardDescription>
                Aligned with GRI, SASB, and TCFD frameworks to ensure your data meets global compliance standards.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Data-Driven Insights</CardTitle>
              <CardDescription>
                Get instant scoring, peer benchmarking, and gap analysis to identify areas for improvement.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Actionable Roadmap</CardTitle>
              <CardDescription>
                Receive tailored recommendations and a step-by-step plan to enhance your ESG maturity.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Standards & Frameworks */}
      <div className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-2xl font-bold mb-8">Aligned with Global Standards</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos - using text for now */}
            <div className="px-6 py-3 border border-slate-700 rounded-lg font-bold text-xl">GRI</div>
            <div className="px-6 py-3 border border-slate-700 rounded-lg font-bold text-xl">SASB</div>
            <div className="px-6 py-3 border border-slate-700 rounded-lg font-bold text-xl">TCFD</div>
            <div className="px-6 py-3 border border-slate-700 rounded-lg font-bold text-xl">UN SDGs</div>
            <div className="px-6 py-3 border border-slate-700 rounded-lg font-bold text-xl">ISO 26000</div>
          </div>
        </div>
      </div>

      {/* Case Studies / Testimonials (Simplified) */}
      <div className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="bg-emerald-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3">
            <div className="w-20 h-20 bg-emerald-200 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-700 mx-auto md:mx-0">
              "
            </div>
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <blockquote className="text-xl md:text-2xl font-medium text-slate-900 mb-6">
              "This platform transformed how we track our sustainability metrics. The automated scoring and recommendations helped us improve our ESG rating by 40% in just one year."
            </blockquote>
            <div className="font-bold text-slate-900">Sarah Johnson</div>
            <div className="text-slate-600">Chief Sustainability Officer, TechCorp Global</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGLanding;
