import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ESGLanding from "./pages/esg/ESGLanding";
import ProfileForm from "./pages/esg/ProfileForm";
import EnvironmentalForm from "./pages/esg/EnvironmentalForm";
import SocialForm from "./pages/esg/SocialForm";
import GovernanceForm from "./pages/esg/GovernanceForm";
import ResultsDashboard from "./pages/esg/ResultsDashboard";
import ReportGeneration from "./pages/esg/ReportGeneration";

// Tool 2: Carbon Emissions (Scope-Based)
import CarbonLanding from "./pages/carbon/emissions/CarbonLanding";
import CarbonDashboard from "./pages/carbon/emissions/CarbonDashboard";
import CarbonProfileForm from "./pages/carbon/emissions/CarbonProfileForm";
import Scope1Form from "./pages/carbon/emissions/Scope1Form";
import Scope2Form from "./pages/carbon/emissions/Scope2Form";
import Scope3Form from "./pages/carbon/emissions/Scope3Form";
import CarbonResults from "./pages/carbon/emissions/CarbonResults";
import ReductionPlanning from "./pages/carbon/emissions/ReductionPlanning";
import CarbonReportGeneration from "./pages/carbon/emissions/ReportGeneration";

// Tool 3: Carbon Footprint (Sector-Specific)
import SectorHub from "./pages/carbon/footprint/SectorHub";
import EnergyCalculator from "./pages/carbon/footprint/EnergyCalculator";
import TransportCalculator from "./pages/carbon/footprint/TransportCalculator";
import SectorDashboard from "./pages/carbon/footprint/SectorDashboard";
import Methodology from "./pages/carbon/footprint/Methodology";
import SectorPlaceholder from "./pages/carbon/footprint/SectorPlaceholder";

// New ESG Due Diligence Module
import ESGDueDiligenceLayout from "./pages/esg-due-diligence/ESGDueDiligenceLayout";
import Landing from "./pages/esg-due-diligence/Landing";
import ProjectSetup from "./pages/esg-due-diligence/ProjectSetup";
import MaterialityAssessment from "./pages/esg-due-diligence/MaterialityAssessment";
import PolicyInput from "./pages/esg-due-diligence/PolicyInput";
import RiskAssessment from "./pages/esg-due-diligence/RiskAssessment";
import DataProcessReview from "./pages/esg-due-diligence/DataProcessReview";
import StakeholderEngagement from "./pages/esg-due-diligence/StakeholderEngagement";
import DataGathering from "./pages/esg-due-diligence/DataGathering";
import GapAnalysis from "./pages/esg-due-diligence/GapAnalysis";
import ScoringDashboard from "./pages/esg-due-diligence/ScoringDashboard";
import FinalReport from "./pages/esg-due-diligence/FinalReport";

// Auth & User Management
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/auth/UserDashboard";

import About from "./pages/About";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Tool 1: ESG Assessment Routes */}
          <Route path="/esg-assessment" element={<ESGLanding />} />
          <Route path="/esg-assessment/profile" element={<ProfileForm />} />
          <Route path="/esg-assessment/environmental" element={<EnvironmentalForm />} />
          <Route path="/esg-assessment/social" element={<SocialForm />} />
          <Route path="/esg-assessment/governance" element={<GovernanceForm />} />
          <Route path="/esg-assessment/results" element={<ResultsDashboard />} />
          <Route path="/esg-assessment/report" element={<ReportGeneration />} />

          {/* Tool 2: Carbon Emissions Calculator (Scope-Based) */}
          <Route path="/carbon-emissions" element={<CarbonLanding />} />
          <Route path="/carbon-emissions/dashboard" element={<CarbonDashboard />} />
          <Route path="/carbon-emissions/profile" element={<CarbonProfileForm />} />
          <Route path="/carbon-emissions/scope1" element={<Scope1Form />} />
          <Route path="/carbon-emissions/scope2" element={<Scope2Form />} />
          <Route path="/carbon-emissions/scope3" element={<Scope3Form />} />
          <Route path="/carbon-emissions/results" element={<CarbonResults />} />
          <Route path="/carbon-emissions/reduction" element={<ReductionPlanning />} />
          <Route path="/carbon-emissions/report" element={<CarbonReportGeneration />} />

          {/* Tool 3: Carbon Footprint Calculator (Sector-Specific) */}
          <Route path="/carbon-footprint" element={<SectorHub />} />
          <Route path="/carbon-footprint/energy" element={<EnergyCalculator />} />
          <Route path="/carbon-footprint/transport" element={<TransportCalculator />} />
          <Route path="/carbon-footprint/dashboard" element={<SectorDashboard />} />
          <Route path="/carbon-footprint/methodology" element={<Methodology />} />
          <Route path="/carbon-footprint/:sectorId" element={<SectorPlaceholder />} />

          {/* New ESG Due Diligence Module */}
          <Route path="/esg-due-diligence" element={<ESGDueDiligenceLayout />}>
            <Route index element={<Landing />} />
            <Route path="setup" element={<ProjectSetup />} />
            <Route path="materiality" element={<MaterialityAssessment />} />
            <Route path="policies" element={<PolicyInput />} />
            <Route path="risks" element={<RiskAssessment />} />
            <Route path="data-process" element={<DataProcessReview />} />
            <Route path="stakeholders" element={<StakeholderEngagement />} />
            <Route path="data-gathering" element={<DataGathering />} />
            <Route path="gap-analysis" element={<GapAnalysis />} />
            <Route path="scoring" element={<ScoringDashboard />} />
            <Route path="report" element={<FinalReport />} />
          </Route>

          {/* Other Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
