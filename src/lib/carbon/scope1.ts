import { Scope1Data, StationarySource, MobileDistanceSource, MobileFuelSource, ProcessEmissionSource, FugitiveSource } from "../../types/carbon";
import { STATIONARY_FACTORS, MOBILE_DISTANCE_FACTORS, MOBILE_FUEL_FACTORS, PROCESS_FACTORS, FUGITIVE_GWP } from "./factors";

export const calculateStationaryCombustion = (sources: StationarySource[]): number => {
    let total = 0;
    sources.forEach(source => {
        const fuelFactors = STATIONARY_FACTORS[source.fuelType as keyof typeof STATIONARY_FACTORS];
        if (fuelFactors) {
            const factor = fuelFactors[source.unit as keyof typeof fuelFactors];
            if (factor) {
                // Factor is in kg CO2e, convert to tonnes
                total += (source.amount * factor) / 1000;
            }
        }
    });
    return total;
};

export const calculateMobileCombustion = (
    method: "distance" | "fuel",
    distanceSources: MobileDistanceSource[],
    fuelSources: MobileFuelSource[]
): number => {
    let total = 0;

    if (method === "distance") {
        distanceSources.forEach(source => {
            let factor = MOBILE_DISTANCE_FACTORS[source.vehicleType as keyof typeof MOBILE_DISTANCE_FACTORS];

            // Convert miles to km if needed (factor is per km)
            let distanceKm = source.distance;
            if (source.unit === "miles") {
                distanceKm = source.distance * 1.60934;
            }

            if (factor !== undefined) {
                total += (distanceKm * factor) / 1000;
            }
        });
    } else {
        fuelSources.forEach(source => {
            const fuelFactors = MOBILE_FUEL_FACTORS[source.fuelType as keyof typeof MOBILE_FUEL_FACTORS];
            if (fuelFactors) {
                const factor = fuelFactors[source.unit as keyof typeof fuelFactors];
                if (factor) {
                    total += (source.amount * factor) / 1000;
                }
            }
        });
    }

    return total;
};

export const calculateProcessEmissions = (sources: ProcessEmissionSource[]): number => {
    let total = 0;
    sources.forEach(source => {
        let factor = source.customFactor;
        if (!factor && source.processType !== "other") {
            factor = PROCESS_FACTORS[source.processType as keyof typeof PROCESS_FACTORS];
        }

        if (factor) {
            total += source.amount * factor;
        }
    });
    return total;
};

export const calculateFugitiveEmissions = (sources: FugitiveSource[]): number => {
    let total = 0;
    sources.forEach(source => {
        let gwp = source.gwp;
        if (!gwp) {
            gwp = FUGITIVE_GWP[source.gas as keyof typeof FUGITIVE_GWP] || 0;
        }

        // Amount in kg * GWP = kg CO2e -> convert to tonnes
        total += (source.amount * gwp) / 1000;
    });
    return total;
};

export const calculateScope1 = (data: Scope1Data) => {
    const stationary = calculateStationaryCombustion(data.stationary);
    const mobile = calculateMobileCombustion(data.mobileMethod, data.mobileDistance, data.mobileFuel);
    const process = calculateProcessEmissions(data.process);
    const fugitive = calculateFugitiveEmissions(data.fugitive);

    return {
        total: stationary + mobile + process + fugitive,
        stationary,
        mobile,
        process,
        fugitive
    };
};
