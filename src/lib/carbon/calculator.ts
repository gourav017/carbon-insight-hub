import { CarbonAssessmentData, CarbonResult } from "../../types/carbon";
import { calculateScope1 } from "./scope1";
import { calculateScope2 } from "./scope2";
import { calculateScope3 } from "./scope3";

export const calculateCarbonFootprint = (data: CarbonAssessmentData): CarbonResult => {
    const scope1 = calculateScope1(data.scope1);
    const scope2 = calculateScope2(data.scope2);
    const scope3 = calculateScope3(data.scope3);

    const totalLocationBased = scope1.total + scope2.locationBased + scope3.total;
    const totalMarketBased = scope1.total + scope2.marketBased + scope3.total;

    // Intensity Metrics
    const employees = data.profile.employees || 1;
    const revenue = data.profile.revenue || 1;
    const floorArea = data.profile.floorArea;

    const perEmployee = totalLocationBased / employees;
    const perRevenue = totalLocationBased / (revenue / 1000000); // tCO2e per million currency
    const perSqm = floorArea ? totalLocationBased / floorArea : undefined;

    return {
        scope1,
        scope2,
        scope3,
        totalLocationBased,
        totalMarketBased,
        intensities: {
            perEmployee,
            perRevenue,
            perSqm
        }
    };
};
