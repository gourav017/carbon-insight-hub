import { Scope2Data, ElectricitySource, ThermalSource, MarketBasedInstrument } from "../../types/carbon";
import { ELECTRICITY_GRID_FACTORS, THERMAL_FACTORS } from "./factors";

export const calculateLocationBasedElectricity = (sources: ElectricitySource[]): number => {
    let total = 0;
    sources.forEach(source => {
        let factor = source.customFactor;
        if (!factor) {
            factor = ELECTRICITY_GRID_FACTORS[source.region as keyof typeof ELECTRICITY_GRID_FACTORS];
        }

        if (factor) {
            // Factor is kg CO2e/kWh
            let consumptionKwh = source.consumption;
            if (source.unit === "mwh") {
                consumptionKwh = source.consumption * 1000;
            }

            total += (consumptionKwh * factor) / 1000;
        }
    });
    return total;
};

export const calculateMarketBasedElectricity = (
    sources: ElectricitySource[],
    instruments: MarketBasedInstrument[]
): number => {
    // 1. Calculate total consumption in kWh
    let totalConsumption = 0;
    sources.forEach(source => {
        totalConsumption += source.unit === "mwh" ? source.consumption * 1000 : source.consumption;
    });

    // 2. Calculate emissions from instruments (RECs, PPAs, etc.)
    let coveredConsumption = 0;
    let instrumentEmissions = 0;

    instruments.forEach(inst => {
        coveredConsumption += inst.amount;
        instrumentEmissions += (inst.amount * inst.factor) / 1000;
    });

    // 3. Calculate residual consumption
    const residualConsumption = Math.max(0, totalConsumption - coveredConsumption);

    // 4. Calculate residual emissions
    // Ideally use residual mix factor, but fallback to location-based average for now
    // To do this accurately, we need a weighted average of location factors if multiple regions
    // Simplified: Use the first source's region or a default if multiple (refinement needed for multi-region)

    let residualEmissions = 0;
    if (residualConsumption > 0) {
        // Weighted average location factor calculation
        let totalLocationEmissions = 0;
        sources.forEach(source => {
            let factor = source.customFactor || ELECTRICITY_GRID_FACTORS[source.region as keyof typeof ELECTRICITY_GRID_FACTORS] || 0;
            let kwh = source.unit === "mwh" ? source.consumption * 1000 : source.consumption;
            totalLocationEmissions += (kwh * factor) / 1000;
        });

        const averageLocationFactor = totalConsumption > 0 ? totalLocationEmissions / (totalConsumption / 1000) : 0; // tCO2e/MWh or similar ratio

        // Apply to residual
        // Note: Residual mix factors are typically higher than location-based, but using location-based is a standard fallback
        residualEmissions = (residualConsumption / 1000) * (averageLocationFactor * 1000); // converting back to match units

        // Actually simpler: Just take the location-based emissions for the residual portion
        // But we don't know WHICH region the residual is in if there are multiple.
        // Assuming instruments apply to the total pool.
        // Let's use the weighted average intensity of the consumption.
        const weightedFactor = totalConsumption > 0 ? (calculateLocationBasedElectricity(sources) * 1000) / totalConsumption : 0; // kg/kWh
        residualEmissions = (residualConsumption * weightedFactor) / 1000;
    }

    return instrumentEmissions + residualEmissions;
};

export const calculateThermalEmissions = (sources: ThermalSource[]): number => {
    let total = 0;
    sources.forEach(source => {
        let factor = source.customFactor;
        if (!factor && source.type === "steam") {
            const steamFactors = THERMAL_FACTORS["steam"];
            factor = steamFactors[source.unit as keyof typeof steamFactors];
        }

        // If district heating/cooling and no custom factor, we might need defaults
        // For now, assuming steam default if not specified, or 0 if unknown type
        if (!factor && !source.customFactor) {
            // Fallback for district heating often similar to steam or gas boiler efficiency
            if (source.unit === "mmbtu") factor = 0.0661;
        }

        if (factor) {
            total += source.consumption * factor;
        }
    });
    return total;
};

export const calculateScope2 = (data: Scope2Data) => {
    const locationBasedElectricity = calculateLocationBasedElectricity(data.electricity);
    const marketBasedElectricity = calculateMarketBasedElectricity(data.electricity, data.marketBasedInstruments);
    const thermal = calculateThermalEmissions(data.thermal);

    return {
        locationBased: locationBasedElectricity + thermal,
        marketBased: marketBasedElectricity + thermal,
        electricityLocation: locationBasedElectricity,
        electricityMarket: marketBasedElectricity,
        thermal
    };
};
