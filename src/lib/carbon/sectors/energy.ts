import { ElectricityInput, FuelInput, CalculationResult } from '../../../types/carbon-sectors';
import { GRID_REGIONS, FUEL_FACTORS } from './factors';

export const calculateElectricity = (input: ElectricityInput): CalculationResult => {
    const breakdown = [];
    let emissions = 0;

    // 1. Determine Grid Factor
    let gridFactor = 0;
    let gridName = '';

    if (input.customFactor !== undefined) {
        gridFactor = input.customFactor;
        gridName = 'Custom Grid Factor';
        breakdown.push({
            step: 'Grid Factor Selection',
            formula: `Custom Factor: ${gridFactor} kg CO2e/kWh`,
            value: gridFactor,
            unit: 'kg CO2e/kWh'
        });
    } else {
        const region = GRID_REGIONS.find(r => r.id === input.gridRegion);
        if (region) {
            gridFactor = region.factor;
            gridName = region.name;
            breakdown.push({
                step: 'Grid Factor Selection',
                formula: `Region: ${region.name} (${region.id})`,
                value: gridFactor,
                unit: 'kg CO2e/kWh'
            });
        } else {
            // Fallback to Global Average if not found (should not happen with proper UI)
            gridFactor = 0.475; // Approx global avg
            gridName = 'Global Average';
            breakdown.push({
                step: 'Grid Factor Selection',
                formula: 'Region not found, using Global Average',
                value: gridFactor,
                unit: 'kg CO2e/kWh'
            });
        }
    }

    // 2. Calculate Usage in kWh
    let usageKWh = input.usage;
    if (input.unit === 'MWh') {
        usageKWh = input.usage * 1000;
        breakdown.push({
            step: 'Unit Conversion',
            formula: `${input.usage} MWh × 1000`,
            value: usageKWh,
            unit: 'kWh'
        });
    }

    // 3. Renewable Deduction
    let renewableKWh = 0;
    if (input.renewableAmount) {
        renewableKWh = input.renewableAmount;
    } else if (input.renewablePercentage) {
        renewableKWh = usageKWh * (input.renewablePercentage / 100);
    }

    const nonRenewableKWh = Math.max(0, usageKWh - renewableKWh);

    if (renewableKWh > 0) {
        breakdown.push({
            step: 'Renewable Deduction',
            formula: `Total (${usageKWh}) - Renewable (${renewableKWh})`,
            value: nonRenewableKWh,
            unit: 'kWh (Non-Renewable)'
        });
    }

    // 4. Calculate Emissions
    emissions = nonRenewableKWh * gridFactor;
    breakdown.push({
        step: 'Emission Calculation',
        formula: `${nonRenewableKWh} kWh × ${gridFactor} kg CO2e/kWh`,
        value: emissions,
        unit: 'kg CO2e'
    });

    // 5. Convert to Tonnes
    const emissionsTonnes = emissions / 1000;
    breakdown.push({
        step: 'Tonnes Conversion',
        formula: `${emissions} kg ÷ 1000`,
        value: emissionsTonnes,
        unit: 'tCO2e'
    });

    return {
        emissions,
        emissionsTonnes,
        breakdown,
        methodology: 'Location-based method using average grid emission factors.',
        source: `Grid Factor: ${gridName}`
    };
};

export const calculateFuel = (input: FuelInput): CalculationResult => {
    const breakdown = [];
    let emissions = 0;

    // 1. Find Emission Factor
    // Construct key based on type and unit, e.g., 'natural_gas_m3'
    let factorKey = `${input.type}_${input.unit}`;

    // Handle special cases or mapping if needed
    if (input.type === 'coal' && input.fuelTypeDetail) {
        // e.g., coal_bituminous
        factorKey = `coal_${input.fuelTypeDetail}`;
    }

    // Normalize key (remove spaces, lowercase)
    factorKey = factorKey.toLowerCase().replace(/\s+/g, '_');

    // Attempt to find exact match first
    let factorObj = FUEL_FACTORS[factorKey];

    // Fallback logic for units if exact key not found (simplified for now)
    if (!factorObj) {
        // Try to find by type only and assume a default unit if strict matching fails?
        // For now, we assume the UI passes valid keys.
        // If not found, return 0 with error step
        return {
            emissions: 0,
            emissionsTonnes: 0,
            breakdown: [{ step: 'Error', formula: `Factor not found for ${factorKey}`, value: 0, unit: '' }],
            methodology: 'N/A',
            source: 'N/A'
        };
    }

    breakdown.push({
        step: 'Emission Factor',
        formula: `${factorObj.name}: ${factorObj.factor} ${factorObj.unit}`,
        value: factorObj.factor,
        unit: factorObj.unit
    });

    // 2. Calculate Emissions
    emissions = input.amount * factorObj.factor;
    breakdown.push({
        step: 'Emission Calculation',
        formula: `${input.amount} ${input.unit} × ${factorObj.factor}`,
        value: emissions,
        unit: 'kg CO2e'
    });

    // 3. Convert to Tonnes
    const emissionsTonnes = emissions / 1000;
    breakdown.push({
        step: 'Tonnes Conversion',
        formula: `${emissions} kg ÷ 1000`,
        value: emissionsTonnes,
        unit: 'tCO2e'
    });

    return {
        emissions,
        emissionsTonnes,
        breakdown,
        methodology: 'Fuel combustion emissions based on standard factors.',
        source: factorObj.source
    };
};
