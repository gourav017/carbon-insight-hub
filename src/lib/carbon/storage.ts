import { CarbonAssessmentData } from "../../types/carbon";

const STORAGE_KEY = "carbon_emissions_data";
const HISTORY_KEY = "carbon_emissions_history";

export interface CarbonHistoryItem {
    id: string;
    date: string;
    totalEmissions: number;
    data: CarbonAssessmentData;
}

export function saveEmissionsData(data: CarbonAssessmentData): void {
    try {
        const dataWithTimestamp = {
            ...data,
            lastUpdated: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    } catch (error) {
        console.error("Failed to save emissions data:", error);
    }
}

export function loadEmissionsData(): CarbonAssessmentData | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Failed to load emissions data:", error);
        return null;
    }
}

export function clearEmissionsData(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Failed to clear emissions data:", error);
    }
}

export function saveToHistory(data: CarbonAssessmentData, totalEmissions: number): void {
    const history = getHistory();
    const newItem: CarbonHistoryItem = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        totalEmissions,
        data
    };

    const updatedHistory = [newItem, ...history];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}

export function getHistory(): CarbonHistoryItem[] {
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

export function createNewEmissionsData(): CarbonAssessmentData {
    return {
        id: crypto.randomUUID(),
        lastUpdated: Date.now(),
        profile: {
            name: "",
            industry: "other",
            reportingYear: new Date().getFullYear().toString(),
            boundary: "operational-control",
            geographicScope: [],
            employees: 0,
            revenue: 0,
            currency: "USD",
            isBaseline: true,
            hasTarget: false,
            dataQuality: "balanced"
        },
        scope1: {
            stationary: [],
            mobileMethod: "distance",
            mobileDistance: [],
            mobileFuel: [],
            process: [],
            fugitive: []
        },
        scope2: {
            electricity: [],
            marketBasedInstruments: [],
            thermal: []
        },
        scope3: {
            categories: [],
            materialCategories: []
        }
    };
}
