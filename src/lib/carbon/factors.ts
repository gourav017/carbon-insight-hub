// Emission Factors Library
// Sources: IPCC 2006, EPA GHG Emission Factors Hub (2023), UK DEFRA (2023)

export const STATIONARY_FACTORS = {
    // kg CO2e per unit
    "natural-gas": {
        "m3": 1.93,
        "kwh-thermal": 0.202
    },
    "diesel": {
        "liters": 2.68,
        "tonnes": 3206
    },
    "gasoline": {
        "liters": 2.31
    },
    "fuel-oil-2": { "liters": 2.83 },
    "fuel-oil-4": { "liters": 2.93 },
    "fuel-oil-6": { "liters": 3.10 },
    "propane": {
        "liters": 1.51,
        "kg": 3.00
    },
    "coal-bituminous": { "tonnes": 2460 },
    "coal-sub-bituminous": { "tonnes": 1950 },
    "coal-anthracite": { "tonnes": 2670 },
    "biomass": { "tonnes": 0 } // Biogenic CO2 reported separately
};

export const MOBILE_DISTANCE_FACTORS = {
    // kg CO2e per km
    "passenger-gas": 0.171,
    "passenger-diesel": 0.169,
    "passenger-hybrid": 0.109,
    "passenger-ev": 0,
    "suv-gas": 0.282,
    "suv-diesel": 0.251,
    "van-gas": 0.176,
    "van-diesel": 0.284,
    "truck-rigid": 0.887,
    "truck-articulated": 0.987,
    "motorcycle": 0.103
};

export const MOBILE_FUEL_FACTORS = {
    // kg CO2e per unit
    "gasoline": {
        "liters": 2.31
    },
    "diesel": {
        "liters": 2.68
    },
    "biodiesel": { "liters": 2.61 }, // Fossil portion
    "e85": { "liters": 1.61 }, // Fossil portion
    "cng": { "kg": 2.75 }, // Changed from gge to kg (approx conversion needed or verify factor)
    "lpg": { "liters": 1.51 }
};

export const PROCESS_FACTORS = {
    // tCO2e per tonne production
    "cement": 0.525,
    "lime": 0.785, // Quicklime
    "ammonia": 1.5,
    "nitric-acid": 0.864, // After N2O conversion
    "aluminum": 1.5,
    "glass": 0.2
};

export const FUGITIVE_GWP = {
    "R-134a": 1430,
    "R-410A": 2088,
    "R-404A": 3922,
    "R-407C": 1774,
    "R-22": 1810,
    "R-32": 675,
    "R-290": 3,
    "CO2": 1
};

export const ELECTRICITY_GRID_FACTORS = {
    // kg CO2e per kWh
    // India (CEA 2023 / IEA 2023) - Default
    "IN": 0.912, // National Average
    "IN-NORTH": 0.912, // Placeholder for regional
    "IN-WEST": 0.912,
    "IN-SOUTH": 0.912,
    "IN-EAST": 0.912,
    "IN-NORTH-EAST": 0.912,

    // International (IEA 2023)
    "US": 0.371, // US Average
    "UK": 0.233, "DE": 0.485, "FR": 0.057, "CN": 0.582,
    "JP": 0.506, "AU": 0.780, "CA": 0.120, "BR": 0.082, "MX": 0.515,
    "ZA": 0.920, "AE": 0.480, "SA": 0.640, "SG": 0.418, "KR": 0.459
};

export const THERMAL_FACTORS = {
    // tCO2e per unit
    "steam": {
        "gj": 0.0627,
        "mwh": 0.225
    }
};

export const EEIO_FACTORS = {
    // tCO2e per $1000 spend
    "goods-average": 0.25,
    "capital-goods": 0.32,
    "transport-road": 0.185,
    "transport-rail": 0.062,
    "services": 0.15
};
