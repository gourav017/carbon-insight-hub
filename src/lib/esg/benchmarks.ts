import { IndustrySector, IndustryBenchmark } from "@/types/esg";

export const industryBenchmarks: Record<IndustrySector, IndustryBenchmark> = {
  "manufacturing": {
    sector: "manufacturing",
    averageE: 58,
    averageS: 62,
    averageG: 65,
    topQuartileE: 78,
    topQuartileS: 80,
    topQuartileG: 82,
    trirBenchmark: 3.5
  },
  "it-technology": {
    sector: "it-technology",
    averageE: 65,
    averageS: 70,
    averageG: 75,
    topQuartileE: 85,
    topQuartileS: 88,
    topQuartileG: 90,
    trirBenchmark: 0.5
  },
  "retail": {
    sector: "retail",
    averageE: 52,
    averageS: 68,
    averageG: 62,
    topQuartileE: 72,
    topQuartileS: 85,
    topQuartileG: 78,
    trirBenchmark: 3.0
  },
  "healthcare": {
    sector: "healthcare",
    averageE: 55,
    averageS: 72,
    averageG: 70,
    topQuartileE: 75,
    topQuartileS: 88,
    topQuartileG: 85,
    trirBenchmark: 4.2
  },
  "finance": {
    sector: "finance",
    averageE: 60,
    averageS: 65,
    averageG: 78,
    topQuartileE: 78,
    topQuartileS: 82,
    topQuartileG: 92,
    trirBenchmark: 0.5
  },
  "construction": {
    sector: "construction",
    averageE: 48,
    averageS: 58,
    averageG: 60,
    topQuartileE: 68,
    topQuartileS: 75,
    topQuartileG: 78,
    trirBenchmark: 2.8
  },
  "agriculture": {
    sector: "agriculture",
    averageE: 50,
    averageS: 55,
    averageG: 58,
    topQuartileE: 70,
    topQuartileS: 72,
    topQuartileG: 75,
    trirBenchmark: 5.0
  },
  "energy": {
    sector: "energy",
    averageE: 52,
    averageS: 62,
    averageG: 68,
    topQuartileE: 72,
    topQuartileS: 78,
    topQuartileG: 85,
    trirBenchmark: 1.5
  },
  "transportation": {
    sector: "transportation",
    averageE: 48,
    averageS: 60,
    averageG: 62,
    topQuartileE: 68,
    topQuartileS: 77,
    topQuartileG: 78,
    trirBenchmark: 4.5
  },
  "hospitality": {
    sector: "hospitality",
    averageE: 50,
    averageS: 65,
    averageG: 58,
    topQuartileE: 70,
    topQuartileS: 82,
    topQuartileG: 75,
    trirBenchmark: 3.5
  },
  "education": {
    sector: "education",
    averageE: 58,
    averageS: 68,
    averageG: 70,
    topQuartileE: 78,
    topQuartileS: 85,
    topQuartileG: 85,
    trirBenchmark: 1.0
  },
  "real-estate": {
    sector: "real-estate",
    averageE: 55,
    averageS: 60,
    averageG: 68,
    topQuartileE: 75,
    topQuartileS: 77,
    topQuartileG: 85,
    trirBenchmark: 2.0
  },
  "pharmaceuticals": {
    sector: "pharmaceuticals",
    averageE: 60,
    averageS: 65,
    averageG: 75,
    topQuartileE: 80,
    topQuartileS: 82,
    topQuartileG: 90,
    trirBenchmark: 1.2
  },
  "mining": {
    sector: "mining",
    averageE: 45,
    averageS: 55,
    averageG: 62,
    topQuartileE: 65,
    topQuartileS: 72,
    topQuartileG: 78,
    trirBenchmark: 3.0
  },
  "food-beverage": {
    sector: "food-beverage",
    averageE: 52,
    averageS: 68,
    averageG: 65,
    topQuartileE: 72,
    topQuartileS: 85,
    topQuartileG: 80,
    trirBenchmark: 3.8
  },
  "telecommunications": {
    sector: "telecommunications",
    averageE: 62,
    averageS: 68,
    averageG: 72,
    topQuartileE: 82,
    topQuartileS: 85,
    topQuartileG: 88,
    trirBenchmark: 0.8
  },
  "professional-services": {
    sector: "professional-services",
    averageE: 65,
    averageS: 70,
    averageG: 75,
    topQuartileE: 82,
    topQuartileS: 85,
    topQuartileG: 90,
    trirBenchmark: 0.5
  },
  "other": {
    sector: "other",
    averageE: 55,
    averageS: 62,
    averageG: 65,
    topQuartileE: 75,
    topQuartileS: 80,
    topQuartileG: 82,
    trirBenchmark: 3.0
  }
};

export function getSectorWeights(sector: IndustrySector): { environmental: number; social: number; governance: number } {
  const highEnvironmental: IndustrySector[] = ["manufacturing", "energy", "agriculture", "mining", "transportation"];
  const highSocial: IndustrySector[] = ["healthcare", "retail", "hospitality", "food-beverage"];
  const highGovernance: IndustrySector[] = ["finance", "pharmaceuticals", "professional-services"];

  if (highEnvironmental.includes(sector)) {
    return { environmental: 0.50, social: 0.25, governance: 0.25 };
  } else if (highSocial.includes(sector)) {
    return { environmental: 0.30, social: 0.40, governance: 0.30 };
  } else if (highGovernance.includes(sector)) {
    return { environmental: 0.25, social: 0.25, governance: 0.50 };
  } else {
    return { environmental: 0.40, social: 0.30, governance: 0.30 };
  }
}

export function getIndustryBenchmark(sector: IndustrySector): IndustryBenchmark {
  return industryBenchmarks[sector] || industryBenchmarks["other"];
}
