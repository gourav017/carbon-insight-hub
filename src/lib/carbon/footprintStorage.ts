import { CalculationResult } from "../../types/carbon-sectors";

const HISTORY_KEY = "carbon_footprint_history";

export interface FootprintHistoryItem {
    id: string;
    date: string;
    calculatorType: "energy" | "transport" | "sector";
    inputs: any;
    result: CalculationResult;
}

export function saveToHistory(
    calculatorType: "energy" | "transport" | "sector",
    inputs: any,
    result: CalculationResult
): void {
    const history = getHistory();
    const newItem: FootprintHistoryItem = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        calculatorType,
        inputs,
        result
    };

    const updatedHistory = [newItem, ...history];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}

export function getHistory(): FootprintHistoryItem[] {
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

export function getHistoryByType(type: "energy" | "transport" | "sector"): FootprintHistoryItem[] {
    return getHistory().filter(item => item.calculatorType === type);
}
