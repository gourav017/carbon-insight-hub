import { ESGScores, Recommendation, IndustrySector } from "@/types/esg";

export function generateRecommendations(scores: ESGScores, sector: IndustrySector): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Critical gaps (score < 30)
  if (scores.environmental.total < 30) {
    recommendations.push({
      priority: "critical",
      category: "Environmental",
      issue: `Environmental score of ${scores.environmental.total.toFixed(1)} indicates critical gaps`,
      impact: "Could improve overall ESG score by 15-20 points",
      action: "1. Implement GHG measurement across all scopes\n2. Set science-based emission reduction targets\n3. Obtain ISO 14001 certification",
      timeline: "6-12 months",
      resources: ["https://sciencebasedtargets.org/", "https://www.iso.org/iso-14001-environmental-management.html"],
      scoreImprovement: 18,
      complexity: "hard"
    });
  }

  if (scores.social.total < 30) {
    recommendations.push({
      priority: "critical",
      category: "Social",
      issue: `Social score of ${scores.social.total.toFixed(1)} indicates critical gaps`,
      impact: "Could improve overall ESG score by 12-15 points",
      action: "1. Implement comprehensive health & safety management system\n2. Establish fair wages policy\n3. Create whistleblower mechanisms",
      timeline: "6-9 months",
      resources: ["https://www.iso.org/iso-45001-occupational-health-and-safety.html"],
      scoreImprovement: 14,
      complexity: "hard"
    });
  }

  if (scores.governance.total < 30) {
    recommendations.push({
      priority: "critical",
      category: "Governance",
      issue: `Governance score of ${scores.governance.total.toFixed(1)} indicates critical gaps`,
      impact: "Could improve overall ESG score by 10-15 points",
      action: "1. Establish independent board oversight\n2. Implement and enforce code of conduct\n3. Create anonymous whistleblower mechanism",
      timeline: "3-6 months",
      resources: ["https://www.oecd.org/corporate/principles-corporate-governance/"],
      scoreImprovement: 12,
      complexity: "medium"
    });
  }

  // High-impact improvements
  if (scores.environmental.ghgEmissions < 20 && scores.environmental.total >= 30) {
    recommendations.push({
      priority: "high",
      category: "Environmental - GHG Emissions",
      issue: "GHG emissions measurement and reduction targets need improvement",
      impact: "Could improve environmental score by 8-10 points",
      action: "Implement comprehensive GHG measurement across all scopes and set science-based targets (SBTi)",
      timeline: "6-12 months",
      resources: ["https://sciencebasedtargets.org/", "https://ghgprotocol.org/"],
      scoreImprovement: 9,
      complexity: "hard"
    });
  }

  if (scores.environmental.energyRenewable < 15 && scores.environmental.total >= 30) {
    recommendations.push({
      priority: "high",
      category: "Environmental - Renewable Energy",
      issue: "Low renewable energy usage",
      impact: "Could improve environmental score by 6-8 points",
      action: "Increase renewable energy to 50%+ through solar PPAs, wind contracts, or renewable energy certificates",
      timeline: "9-18 months",
      resources: ["https://www.there100.org/", "https://www.irena.org/"],
      scoreImprovement: 7,
      complexity: "medium"
    });
  }

  if (scores.social.diversityEquityInclusion < 15 && scores.social.total >= 30) {
    recommendations.push({
      priority: "high",
      category: "Social - Diversity & Inclusion",
      issue: "Diversity and inclusion metrics below industry standards",
      impact: "Could improve social score by 5-7 points",
      action: "1. Conduct annual pay equity analysis\n2. Set specific diversity targets for management\n3. Implement mandatory DEI training",
      timeline: "3-6 months",
      resources: ["https://www.mckinsey.com/featured-insights/diversity-and-inclusion"],
      scoreImprovement: 6,
      complexity: "easy"
    });
  }

  if (scores.governance.transparencyDisclosure < 12 && scores.governance.total >= 30) {
    recommendations.push({
      priority: "high",
      category: "Governance - Transparency",
      issue: "Limited sustainability reporting and disclosure",
      impact: "Could improve governance score by 5-7 points",
      action: "Publish annual sustainability report following GRI Standards with third-party verification",
      timeline: "6-12 months",
      resources: ["https://www.globalreporting.org/", "https://www.sasb.org/"],
      scoreImprovement: 6,
      complexity: "medium"
    });
  }

  // Quick wins
  if (scores.social.healthSafety > 15 && !recommendations.find(r => r.category.includes("Social"))) {
    recommendations.push({
      priority: "medium",
      category: "Social - Health & Safety",
      issue: "Safety training hours below benchmark",
      impact: "Could improve social score by 2-3 points",
      action: "Increase safety training to 20+ hours per employee annually",
      timeline: "1-3 months",
      resources: ["https://www.osha.gov/training"],
      scoreImprovement: 3,
      complexity: "easy"
    });
  }

  if (scores.environmental.wasteManagement > 5 && scores.environmental.wasteManagement < 12) {
    recommendations.push({
      priority: "medium",
      category: "Environmental - Waste",
      issue: "Waste diversion rate can be improved",
      impact: "Could improve environmental score by 3-4 points",
      action: "Implement zero-waste program with specific targets to achieve 75%+ diversion rate",
      timeline: "3-6 months",
      resources: ["https://zerowasteeurope.eu/"],
      scoreImprovement: 4,
      complexity: "easy"
    });
  }

  // Sector-specific recommendations
  if (["manufacturing", "energy", "transportation"].includes(sector)) {
    if (scores.environmental.total < 70) {
      recommendations.push({
        priority: "high",
        category: "Environmental - Sector-Specific",
        issue: "Environmental performance below sector expectations",
        impact: "Critical for license to operate in high-impact sector",
        action: "Prioritize environmental management - your sector has high materiality for environmental issues",
        timeline: "Ongoing",
        resources: ["https://www.cdp.net/"],
        scoreImprovement: 10,
        complexity: "hard"
      });
    }
  }

  if (["healthcare", "retail", "food-beverage"].includes(sector)) {
    if (scores.social.total < 70) {
      recommendations.push({
        priority: "high",
        category: "Social - Sector-Specific",
        issue: "Social performance below sector expectations",
        impact: "Critical for brand reputation in consumer-facing sector",
        action: "Prioritize labor practices, DEI, and supply chain management",
        timeline: "Ongoing",
        resources: ["https://www.ethicaltrade.org/"],
        scoreImprovement: 10,
        complexity: "medium"
      });
    }
  }

  // Sort by priority and score improvement
  const priorityOrder = { critical: 0, high: 1, medium: 2 };
  recommendations.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.scoreImprovement - a.scoreImprovement;
  });

  return recommendations.slice(0, 10); // Return top 10 recommendations
}
