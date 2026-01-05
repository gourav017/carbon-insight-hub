export interface EmissionFactor {
    id: string;
    name: string;
    factor: number; // kg CO2e per unit
    unit: string;
    source: string;
    year: number;
    region: string;
    category: string;
    uncertainty?: number; // percentage +/-
    notes?: string;
}

export interface CalculationResult {
    emissions: number; // kg CO2e
    emissionsTonnes: number; // t CO2e
    breakdown: {
        step: string;
        formula: string;
        value: number;
        unit: string;
    }[];
    methodology: string;
    source: string;
}

// --- Sector 1: Energy & Electricity ---

export interface ElectricityInput {
    usage: number; // value
    unit: 'kWh' | 'MWh';
    gridRegion: string; // ID of the grid factor
    customFactor?: number; // kg CO2e/kWh
    renewablePercentage?: number; // 0-100
    renewableAmount?: number; // kWh
}

export interface FuelInput {
    type: 'natural_gas' | 'diesel' | 'petrol' | 'lpg' | 'coal' | 'biomass';
    amount: number;
    unit: string; // m3, liters, gallons, tonnes, etc.
    fuelTypeDetail?: string; // e.g., 'bituminous' for coal
}

export interface EnergySectorInput {
    electricity: ElectricityInput;
    fuels: FuelInput[];
}

// --- Sector 2: Transportation ---

export interface VehicleInput {
    type: 'car' | 'truck' | 'van' | 'motorcycle' | 'bus';
    fuel: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'cng';
    size?: 'small' | 'medium' | 'large'; // Engine size or vehicle class
    distance: number;
    unit: 'km' | 'miles';
    year?: string; // For fleet age
}

export interface FlightInput {
    origin: string; // IATA code
    destination: string; // IATA code
    passengers: number;
    class: 'economy' | 'premium_economy' | 'business' | 'first';
    roundTrip: boolean;
    includeRF: boolean; // Radiative Forcing
}

export interface FreightInput {
    mode: 'road' | 'rail' | 'sea' | 'air';
    weight: number;
    weightUnit: 'tonnes' | 'kg' | 'lbs' | 'tons';
    distance: number;
    distanceUnit: 'km' | 'miles';
    vehicleType?: string; // e.g., 'articulated_truck', 'container_ship'
    loadFactor?: number; // 0-1 (percentage)
}

export interface TransportSectorInput {
    vehicles: VehicleInput[];
    flights: FlightInput[];
    freight: FreightInput[];
}

// --- Generic Sector Interface ---

export interface SectorCalculationRequest {
    sectorId: string;
    data: any; // Specific input type based on sector
}

export interface SectorCalculationResponse {
    sectorId: string;
    totalEmissions: number; // tCO2e
    breakdown: {
        source: string;
        emissions: number; // tCO2e
        share: number; // percentage
    }[];
    details: CalculationResult[]; // Detailed steps for each item
    recommendations: string[];
}
