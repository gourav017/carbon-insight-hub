import { Scope3Data, Scope3CategoryData } from "../../types/carbon";
import { EEIO_FACTORS } from "./factors";

// Helper for spend-based calculations
export const calculateSpendBased = (spend: number, category: string): number => {
    const factor = EEIO_FACTORS[category as keyof typeof EEIO_FACTORS] || EEIO_FACTORS["goods-average"];
    return (spend / 1000) * factor;
};

export const calculateCategoryEmissions = (categoryData: Scope3CategoryData): number => {
    // If emissions are already provided (manual override), use them
    if (categoryData.emissions > 0) return categoryData.emissions;

    // Logic for different methods
    if (categoryData.method === "spend" && categoryData.inputData?.spend) {
        // Map category ID to EEIO factor key
        let factorKey = "goods-average";
        if (categoryData.category === 1) factorKey = "goods-average";
        if (categoryData.category === 2) factorKey = "capital-goods";
        if (categoryData.category === 4 || categoryData.category === 9) factorKey = "transport-road";
        if (categoryData.category === 6) factorKey = "transport-road"; // Business travel spend

        return calculateSpendBased(categoryData.inputData.spend, factorKey);
    }

    // Placeholder for other methods (distance, quantity)
    // These would require more specific inputData structures

    return 0;
};

export const calculateScope3 = (data: Scope3Data) => {
    let total = 0;
    const breakdown: Record<number, number> = {};

    data.categories.forEach(cat => {
        // Only calculate if material? Or calculate all present?
        // Usually calculate all present data.
        const emissions = calculateCategoryEmissions(cat);
        breakdown[cat.category] = emissions;
        total += emissions;
    });

    return {
        total,
        breakdown
    };
};
