import { EmissionFactor } from '../../../types/carbon-sectors';

export const GRID_REGIONS: EmissionFactor[] = [
    // Top 50 Countries/Regions from requirements
    { id: 'IS', name: 'Iceland', factor: 0.009, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Iceland', category: 'Electricity' },
    { id: 'NO', name: 'Norway', factor: 0.018, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Norway', category: 'Electricity' },
    { id: 'SE', name: 'Sweden', factor: 0.013, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Sweden', category: 'Electricity' },
    { id: 'FR', name: 'France', factor: 0.057, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'France', category: 'Electricity' },
    { id: 'CH', name: 'Switzerland', factor: 0.029, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Switzerland', category: 'Electricity' },
    { id: 'CA', name: 'Canada', factor: 0.120, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Canada', category: 'Electricity' },
    { id: 'BR', name: 'Brazil', factor: 0.082, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Brazil', category: 'Electricity' },
    { id: 'DK', name: 'Denmark', factor: 0.156, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Denmark', category: 'Electricity' },
    { id: 'NZ', name: 'New Zealand', factor: 0.094, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'New Zealand', category: 'Electricity' },
    { id: 'AT', name: 'Austria', factor: 0.102, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Austria', category: 'Electricity' },
    { id: 'FI', name: 'Finland', factor: 0.088, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Finland', category: 'Electricity' },
    { id: 'ES', name: 'Spain', factor: 0.214, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Spain', category: 'Electricity' },
    { id: 'UY', name: 'Uruguay', factor: 0.058, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Uruguay', category: 'Electricity' },
    { id: 'CR', name: 'Costa Rica', factor: 0.042, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Costa Rica', category: 'Electricity' },
    { id: 'GB', name: 'United Kingdom', factor: 0.233, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'United Kingdom', category: 'Electricity' },
    { id: 'IT', name: 'Italy', factor: 0.298, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Italy', category: 'Electricity' },
    { id: 'BE', name: 'Belgium', factor: 0.183, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Belgium', category: 'Electricity' },
    { id: 'NL', name: 'Netherlands', factor: 0.397, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Netherlands', category: 'Electricity' },
    { id: 'DE', name: 'Germany', factor: 0.485, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Germany', category: 'Electricity' },
    { id: 'PT', name: 'Portugal', factor: 0.272, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Portugal', category: 'Electricity' },
    { id: 'IE', name: 'Ireland', factor: 0.341, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Ireland', category: 'Electricity' },
    { id: 'GR', name: 'Greece', factor: 0.583, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Greece', category: 'Electricity' },
    { id: 'PL', name: 'Poland', factor: 0.778, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Poland', category: 'Electricity' },
    { id: 'CZ', name: 'Czech Republic', factor: 0.482, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Czech Republic', category: 'Electricity' },
    { id: 'HU', name: 'Hungary', factor: 0.265, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Hungary', category: 'Electricity' },
    { id: 'RO', name: 'Romania', factor: 0.298, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Romania', category: 'Electricity' },
    { id: 'BG', name: 'Bulgaria', factor: 0.447, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Bulgaria', category: 'Electricity' },
    { id: 'US', name: 'United States (Average)', factor: 0.386, unit: 'kg CO2e/kWh', source: 'EPA eGRID 2023', year: 2023, region: 'USA', category: 'Electricity' },
    { id: 'US-CA', name: 'US - California', factor: 0.209, unit: 'kg CO2e/kWh', source: 'EPA eGRID 2023', year: 2023, region: 'USA', category: 'Electricity' },
    { id: 'US-TX', name: 'US - Texas', factor: 0.433, unit: 'kg CO2e/kWh', source: 'EPA eGRID 2023', year: 2023, region: 'USA', category: 'Electricity' },
    { id: 'US-NY', name: 'US - New York', factor: 0.268, unit: 'kg CO2e/kWh', source: 'EPA eGRID 2023', year: 2023, region: 'USA', category: 'Electricity' },
    { id: 'US-WA', name: 'US - Washington', factor: 0.103, unit: 'kg CO2e/kWh', source: 'EPA eGRID 2023', year: 2023, region: 'USA', category: 'Electricity' },
    { id: 'US-WY', name: 'US - Wyoming', factor: 0.882, unit: 'kg CO2e/kWh', source: 'EPA eGRID 2023', year: 2023, region: 'USA', category: 'Electricity' },
    { id: 'US-WV', name: 'US - West Virginia', factor: 0.895, unit: 'kg CO2e/kWh', source: 'EPA eGRID 2023', year: 2023, region: 'USA', category: 'Electricity' },
    { id: 'MX', name: 'Mexico', factor: 0.515, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Mexico', category: 'Electricity' },
    { id: 'CO', name: 'Colombia', factor: 0.165, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Colombia', category: 'Electricity' },
    { id: 'CL', name: 'Chile', factor: 0.412, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Chile', category: 'Electricity' },
    { id: 'AR', name: 'Argentina', factor: 0.358, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Argentina', category: 'Electricity' },
    { id: 'JP', name: 'Japan', factor: 0.506, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Japan', category: 'Electricity' },
    { id: 'KR', name: 'South Korea', factor: 0.459, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'South Korea', category: 'Electricity' },
    { id: 'CN', name: 'China', factor: 0.582, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'China', category: 'Electricity' },
    { id: 'IN', name: 'India', factor: 0.912, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'India', category: 'Electricity' },
    { id: 'ID', name: 'Indonesia', factor: 0.758, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Indonesia', category: 'Electricity' },
    { id: 'VN', name: 'Vietnam', factor: 0.627, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Vietnam', category: 'Electricity' },
    { id: 'TH', name: 'Thailand', factor: 0.487, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Thailand', category: 'Electricity' },
    { id: 'MY', name: 'Malaysia', factor: 0.623, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Malaysia', category: 'Electricity' },
    { id: 'PH', name: 'Philippines', factor: 0.712, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Philippines', category: 'Electricity' },
    { id: 'SG', name: 'Singapore', factor: 0.418, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Singapore', category: 'Electricity' },
    { id: 'HK', name: 'Hong Kong', factor: 0.670, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Hong Kong', category: 'Electricity' },
    { id: 'TW', name: 'Taiwan', factor: 0.533, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Taiwan', category: 'Electricity' },
    { id: 'AU', name: 'Australia', factor: 0.780, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Australia', category: 'Electricity' },
    { id: 'RU', name: 'Russia', factor: 0.449, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Russia', category: 'Electricity' },
    { id: 'UA', name: 'Ukraine', factor: 0.321, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Ukraine', category: 'Electricity' },
    { id: 'KZ', name: 'Kazakhstan', factor: 0.765, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Kazakhstan', category: 'Electricity' },
    { id: 'TR', name: 'Turkey', factor: 0.486, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Turkey', category: 'Electricity' },
    { id: 'SA', name: 'Saudi Arabia', factor: 0.640, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Saudi Arabia', category: 'Electricity' },
    { id: 'AE', name: 'UAE', factor: 0.480, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'UAE', category: 'Electricity' },
    { id: 'IL', name: 'Israel', factor: 0.672, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Israel', category: 'Electricity' },
    { id: 'IR', name: 'Iran', factor: 0.589, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Iran', category: 'Electricity' },
    { id: 'EG', name: 'Egypt', factor: 0.518, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Egypt', category: 'Electricity' },
    { id: 'ZA', name: 'South Africa', factor: 0.920, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'South Africa', category: 'Electricity' },
    { id: 'NG', name: 'Nigeria', factor: 0.456, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Nigeria', category: 'Electricity' },
    { id: 'KE', name: 'Kenya', factor: 0.288, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Kenya', category: 'Electricity' },
    { id: 'MA', name: 'Morocco', factor: 0.782, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Morocco', category: 'Electricity' },
    { id: 'ET', name: 'Ethiopia', factor: 0.025, unit: 'kg CO2e/kWh', source: 'IEA 2023', year: 2023, region: 'Ethiopia', category: 'Electricity' },
];

export const FUEL_FACTORS: Record<string, EmissionFactor> = {
    'natural_gas_m3': { id: 'ng_m3', name: 'Natural Gas (m3)', factor: 1.93, unit: 'kg CO2e/m3', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'natural_gas_ft3': { id: 'ng_ft3', name: 'Natural Gas (ft3)', factor: 0.0547, unit: 'kg CO2e/ft3', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'natural_gas_therm': { id: 'ng_therm', name: 'Natural Gas (therm)', factor: 5.3, unit: 'kg CO2e/therm', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'natural_gas_mmbtu': { id: 'ng_mmbtu', name: 'Natural Gas (MMBtu)', factor: 53.06, unit: 'kg CO2e/MMBtu', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'natural_gas_gj': { id: 'ng_gj', name: 'Natural Gas (GJ)', factor: 50.3, unit: 'kg CO2e/GJ', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },

    'diesel_liter': { id: 'diesel_l', name: 'Diesel (Liter)', factor: 2.68, unit: 'kg CO2e/L', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'diesel_gallon_us': { id: 'diesel_gal_us', name: 'Diesel (US Gallon)', factor: 10.15, unit: 'kg CO2e/gal', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'diesel_gallon_uk': { id: 'diesel_gal_uk', name: 'Diesel (UK Gallon)', factor: 12.19, unit: 'kg CO2e/gal', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },

    'petrol_liter': { id: 'petrol_l', name: 'Petrol (Liter)', factor: 2.31, unit: 'kg CO2e/L', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'petrol_gallon_us': { id: 'petrol_gal_us', name: 'Petrol (US Gallon)', factor: 8.78, unit: 'kg CO2e/gal', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'petrol_gallon_uk': { id: 'petrol_gal_uk', name: 'Petrol (UK Gallon)', factor: 10.54, unit: 'kg CO2e/gal', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },

    'lpg_liter': { id: 'lpg_l', name: 'LPG (Liter)', factor: 1.51, unit: 'kg CO2e/L', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'lpg_kg': { id: 'lpg_kg', name: 'LPG (kg)', factor: 3.00, unit: 'kg CO2e/kg', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },

    'coal_bituminous': { id: 'coal_bit', name: 'Coal (Bituminous)', factor: 2460, unit: 'kg CO2e/tonne', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'coal_subbituminous': { id: 'coal_sub', name: 'Coal (Sub-bituminous)', factor: 1950, unit: 'kg CO2e/tonne', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'coal_anthracite': { id: 'coal_ant', name: 'Coal (Anthracite)', factor: 2670, unit: 'kg CO2e/tonne', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
    'coal_lignite': { id: 'coal_lig', name: 'Coal (Lignite)', factor: 1540, unit: 'kg CO2e/tonne', source: 'IPCC 2006', year: 2006, region: 'Global', category: 'Fuel' },
};

export const TRANSPORT_FACTORS = {
    passenger_car: {
        gasoline: {
            small: 0.149,
            medium: 0.192,
            large: 0.282,
            avg: 0.171
        },
        diesel: {
            small: 0.142,
            medium: 0.171,
            large: 0.209,
            avg: 0.169
        },
        hybrid: 0.109,
        phev: 0.073,
        ev: 0 // Direct emissions
    },
    flight: {
        short: {
            economy: 0.156,
            business: 0.234 // 1.5x
        },
        medium: {
            economy: 0.102,
            premium: 0.153, // 1.5x
            business: 0.255, // 2.5x
            first: 0.408 // 4.0x
        },
        long: {
            economy: 0.102,
            premium: 0.153, // 1.5x
            business: 0.272, // ~2.7x
            first: 0.408 // 4.0x
        }
    },
    freight: {
        road: {
            small: 0.687,
            medium: 0.444,
            large: 0.252,
            articulated: 0.096,
            avg: 0.100
        },
        rail: {
            diesel: 0.028,
            electric: 0.013
        },
        sea: {
            container: 0.010,
            bulk: 0.008,
            tanker: 0.005
        },
        air: {
            long: 0.602,
            short: 1.250,
            avg: 0.621
        }
    }
};
