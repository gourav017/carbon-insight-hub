export type IndustryGroup =
    | "energy" | "materials" | "industrials" | "consumer-discretionary"
    | "consumer-staples" | "health-care" | "financials" | "it"
    | "communication-services" | "utilities" | "real-estate" | "other";

export type ReportingBoundary = "operational-control" | "financial-control" | "equity-share";

export interface CarbonCompanyProfile {
    name: string;
    industry: IndustryGroup;
    reportingYear: string;
    boundary: ReportingBoundary;
    geographicScope: string[];
    employees: number;
    revenue: number; // in currency
    currency: string;
    floorArea?: number; // sq meters
    facilities?: number;
    isBaseline: boolean;
    baselineYear?: string;
    hasTarget: boolean;
    targetType?: "absolute" | "intensity";
    targetPercentage?: number;
    targetYear?: string;
    sbtiValidated?: boolean;
    dataQuality: "high" | "balanced" | "exploratory";
}

// --- Scope 1 Types ---

export type StationaryFuelType =
    | "natural-gas" | "diesel" | "gasoline" | "fuel-oil-2" | "fuel-oil-4" | "fuel-oil-6"
    | "propane" | "coal-bituminous" | "coal-sub-bituminous" | "coal-anthracite" | "biomass" | "other";

export interface StationarySource {
    id: string;
    fuelType: StationaryFuelType;
    amount: number;
    unit: "m3" | "ft3" | "therms" | "mmbtu" | "kwh-thermal" | "liters" | "gallons-us" | "gallons-imp" | "tonnes" | "kg";
    equipmentType?: string;
}

export type MobileCalculationMethod = "distance" | "fuel";

export type VehicleType =
    | "passenger-gas" | "passenger-diesel" | "passenger-hybrid" | "passenger-ev"
    | "suv-gas" | "suv-diesel" | "van-gas" | "van-diesel"
    | "truck-rigid" | "truck-articulated" | "motorcycle";

export interface MobileDistanceSource {
    id: string;
    vehicleType: VehicleType;
    distance: number;
    unit: "km" | "miles";
}

export interface MobileFuelSource {
    id: string;
    fuelType: "gasoline" | "diesel" | "biodiesel" | "e85" | "cng" | "lpg";
    amount: number;
    unit: "liters" | "gallons-us" | "gallons-imp" | "kg" | "gge";
}

export interface ProcessEmissionSource {
    id: string;
    processType: "cement" | "lime" | "ammonia" | "nitric-acid" | "adipic-acid" | "glass" | "aluminum" | "other";
    amount: number; // tonnes of production
    customFactor?: number; // tCO2e/tonne
    description?: string;
}

export interface FugitiveSource {
    id: string;
    type: "refrigerant" | "fire-suppression" | "other";
    gas: string; // R-134a, etc.
    amount: number; // kg leaked
    gwp?: number; // Custom GWP if known
}

export interface Scope1Data {
    stationary: StationarySource[];
    mobileMethod: MobileCalculationMethod;
    mobileDistance: MobileDistanceSource[];
    mobileFuel: MobileFuelSource[];
    process: ProcessEmissionSource[];
    fugitive: FugitiveSource[];
}

// --- Scope 2 Types ---

export type GridRegion = string; // e.g., "US-NYUP", "UK", "CN"

export interface ElectricitySource {
    id: string;
    consumption: number;
    unit: "kwh" | "mwh";
    region: GridRegion;
    customFactor?: number; // kgCO2e/kWh
}

export interface MarketBasedInstrument {
    id: string;
    type: "rec" | "ppa" | "green-tariff" | "onsite-renewable";
    amount: number; // kWh
    factor: number; // kgCO2e/kWh (usually 0 for renewables)
    description?: string;
}

export interface ThermalSource {
    id: string;
    type: "steam" | "district-heating" | "district-cooling";
    consumption: number;
    unit: "mmbtu" | "gj" | "mwh" | "lbs";
    sourceType?: "district" | "cogen";
    customFactor?: number; // kgCO2e/unit
}

export interface Scope2Data {
    electricity: ElectricitySource[];
    marketBasedInstruments: MarketBasedInstrument[];
    thermal: ThermalSource[];
}

// --- Scope 3 Types ---

export interface Scope3CategoryData {
    id: string;
    category: number; // 1-15
    name: string;
    method: "spend" | "distance" | "quantity" | "hybrid";
    emissions: number; // tCO2e (calculated or manual)
    description?: string;
    inputData?: any; // Flexible storage for category-specific inputs
}

export interface Scope3Data {
    categories: Scope3CategoryData[];
    materialCategories: number[]; // IDs of categories considered material
}

// --- Result Types ---

export interface CarbonResult {
    scope1: {
        total: number;
        stationary: number;
        mobile: number;
        process: number;
        fugitive: number;
    };
    scope2: {
        locationBased: number;
        marketBased: number;
        electricityLocation: number;
        electricityMarket: number;
        thermal: number;
    };
    scope3: {
        total: number;
        breakdown: Record<number, number>; // category ID -> emissions
    };
    totalLocationBased: number;
    totalMarketBased: number;
    intensities: {
        perEmployee: number;
        perRevenue: number;
        perSqm?: number;
    };
}

export interface CarbonAssessmentData {
    id: string;
    lastUpdated: number;
    profile: CarbonCompanyProfile;
    scope1: Scope1Data;
    scope2: Scope2Data;
    scope3: Scope3Data;
    results?: CarbonResult;
}
