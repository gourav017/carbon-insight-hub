import { ESGAssessmentData } from "@/types/esg";

const STORAGE_KEY = "esg_assessment_data";
const AUTO_SAVE_INTERVAL = 120000; // 2 minutes

export function saveAssessmentData(data: ESGAssessmentData): void {
  try {
    const dataWithTimestamp = {
      ...data,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
  } catch (error) {
    console.error("Failed to save assessment data:", error);
    throw new Error("Unable to save your progress. Please check your storage settings.");
  }
}

export function saveSectionData(section: keyof ESGAssessmentData, data: any, markComplete: boolean = false): void {
  const currentData = loadAssessmentData() || createNewAssessment();
  const updatedData = {
    ...currentData,
    [section]: data,
    lastUpdated: Date.now()
  };

  if (markComplete) {
    updatedData.completionStatus = {
      ...updatedData.completionStatus,
      [section]: true
    };
  }

  saveAssessmentData(updatedData);
}

export function loadAssessmentData(): ESGAssessmentData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsedData = JSON.parse(stored);

    // Ensure all sections exist (migration/safety for older data)
    const defaultStructure = createNewAssessment();
    const completeData = {
      ...defaultStructure,
      ...parsedData,
      completionStatus: {
        ...defaultStructure.completionStatus,
        ...(parsedData.completionStatus || {})
      },
      profile: { ...defaultStructure.profile, ...(parsedData.profile || {}) },
      environmental: { ...defaultStructure.environmental, ...(parsedData.environmental || {}) },
      social: { ...defaultStructure.social, ...(parsedData.social || {}) },
      governance: { ...defaultStructure.governance, ...(parsedData.governance || {}) },
    };

    return completeData;
  } catch (error) {
    console.error("Failed to load assessment data:", error);
    return null;
  }
}

export function clearAssessmentData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear assessment data:", error);
  }
}

export function createNewAssessment(): ESGAssessmentData {
  return {
    id: crypto.randomUUID(),
    startedAt: Date.now(),
    lastUpdated: Date.now(),
    currentStep: "region-selection",
    completionStatus: {
      profile: false,
      environmental: false,
      social: false,
      governance: false
    },
    profile: {
      organizationName: "",
      organizationSize: "medium",
      industrySector: "manufacturing",
      annualRevenue: 0,
      numberOfEmployees: 0,
      countriesOfOperation: [],
      reportingFrameworks: [],
      publishesSustainabilityReports: "no",
      assessmentPeriodFrom: new Date().toISOString().split('T')[0],
      assessmentPeriodTo: new Date().toISOString().split('T')[0],
    },
    materiality: [],
    policies: { policies: [] },
    risksOpportunities: [],
    dataProcess: {},
    stakeholderEngagement: [],
    quantitativeData: [],
    // Legacy support
    environmental: {},
    social: {},
    governance: {}
  };
}

export function getCompletionPercentage(data: ESGAssessmentData): number {
  const statuses = Object.values(data.completionStatus);
  const completed = statuses.filter(Boolean).length;
  return Math.round((completed / statuses.length) * 100);
}

export function setupAutoSave(callback: () => void): () => void {
  const interval = setInterval(callback, AUTO_SAVE_INTERVAL);
  return () => clearInterval(interval);
}
export function formatLastSaved(): string {
  const data = loadAssessmentData();
  if (!data || !data.lastUpdated) return "Never";
  return new Date(data.lastUpdated).toLocaleString();
}

// ... existing code ...

const HISTORY_KEY = "esg_assessment_history";

export interface ESGHistoryItem {
  id: string;
  date: string;
  score: number;
  rating: string;
  data: ESGAssessmentData;
}

export function saveToHistory(data: ESGAssessmentData, score: number, rating: string): void {
  const history = getHistory();
  const newItem: ESGHistoryItem = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    score,
    rating,
    data
  };

  const updatedHistory = [newItem, ...history];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}

export function getHistory(): ESGHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
}

export function deleteFromHistory(id: string): void {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}
