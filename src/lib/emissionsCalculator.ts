import { EmissionsData, CompanyData } from "@/pages/Index";

// Emission factors (simplified for demonstration)
const EMISSION_FACTORS = {
  // Scope 1 (tCO2e per unit)
  naturalGas: 0.0053, // per therm
  diesel: 0.01, // per gallon
  gasoline: 0.0089, // per gallon
  refrigerants: 0.002, // per lb

  // Scope 2
  electricity: 0.000417, // per kWh (US average)
  steam: 0.066, // per MMBtu

  // Scope 3
  businessTravel: 0.000411, // per mile (avg air/car)
  employeeCommute: 0.000411, // per mile
  waste: 0.5, // per ton
  purchasedGoods: 0.5, // per $1000 spent (rough estimate)
};

export const calculateTotalEmissions = (data: EmissionsData, company: CompanyData) => {
  // Calculate Scope 1
  const scope1 =
    data.scope1.naturalGas * EMISSION_FACTORS.naturalGas +
    data.scope1.diesel * EMISSION_FACTORS.diesel +
    data.scope1.gasoline * EMISSION_FACTORS.gasoline +
    data.scope1.refrigerants * EMISSION_FACTORS.refrigerants;

  // Calculate Scope 2
  const scope2 =
    data.scope2.electricity * EMISSION_FACTORS.electricity +
    data.scope2.steam * EMISSION_FACTORS.steam;

  // Calculate Scope 3
  const scope3 =
    data.scope3.businessTravel * EMISSION_FACTORS.businessTravel +
    data.scope3.employeeCommute * EMISSION_FACTORS.employeeCommute +
    data.scope3.waste * EMISSION_FACTORS.waste +
    data.scope3.purchasedGoods * EMISSION_FACTORS.purchasedGoods;

  const total = scope1 + scope2 + scope3;
  const perEmployee = total / company.employees;

  // Determine intensity category
  let intensity: string;
  if (perEmployee > 50) {
    intensity = "High";
  } else if (perEmployee > 20) {
    intensity = "Medium";
  } else {
    intensity = "Low";
  }

  // Find largest source
  const sources = [
    { name: "Direct Emissions (Scope 1)", value: scope1 },
    { name: "Energy Usage (Scope 2)", value: scope2 },
    { name: "Value Chain (Scope 3)", value: scope3 },
  ];

  const largestSource = sources.reduce((max, source) =>
    source.value > max.value ? source : max
  );

  return {
    scope1,
    scope2,
    scope3,
    total,
    perEmployee,
    intensity,
    largestSource: {
      name: largestSource.name,
      percentage: ((largestSource.value / total) * 100).toFixed(0),
    },
  };
};
