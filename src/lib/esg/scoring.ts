import {
  EnvironmentalAssessment,
  SocialAssessment,
  GovernanceAssessment,
  ESGScores,
  IndustrySector,
  EnvironmentalScore,
  SocialScore,
  GovernanceScore,
  ESGAssessmentData
} from "../../types/esg";

// Helper to normalize scores to 0-100
const normalize = (value: number, max: number): number => {
  return Math.min(100, Math.max(0, (value / max) * 100));
};

// --- Environmental Scoring ---

const calculateEmissionsScore = (data: Partial<EnvironmentalAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  // Measurement (30 points)
  if (data.measurementLevel === "all-three") score += 30;
  else if (data.measurementLevel === "scope-1-2") score += 20;
  else if (data.measurementLevel === "scope-1-only") score += 10;

  // Targets (30 points)
  if (data.hasReductionTargets) {
    score += 10;
    if (data.targetType === "sbti") score += 20;
    else if (data.targetType === "absolute") score += 15;
    else if (data.targetType === "intensity") score += 10;
  }

  // Progress (20 points)
  if (data.currentProgress && data.currentProgress > 0) {
    score += Math.min(20, (data.currentProgress / 5) * 20); // 5% reduction = max points (simplified)
  }

  // Scope 3 Coverage (20 points)
  if (data.scope3Coverage) {
    score += (data.scope3Coverage / 100) * 20;
  }

  return normalize(score, maxScore);
};

const calculateEnergyScore = (data: Partial<EnvironmentalAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  // Renewable Energy (40 points)
  if (data.renewablePercentage) {
    score += (data.renewablePercentage / 100) * 40;
  }

  // Energy Efficiency (30 points)
  if (data.energyEfficiencyTargets) score += 15;
  if (data.targetEfficiencyImprovement && data.targetEfficiencyImprovement > 0) score += 15;

  // Certification (20 points)
  if (data.energyManagementCertification === "iso-50001") score += 20;
  else if (data.energyManagementCertification === "in-progress") score += 10;

  // Trend (10 points)
  if (data.energyConsumptionTrend === "decreasing") score += 10;
  else if (data.energyConsumptionTrend === "stable") score += 5;

  return normalize(score, maxScore);
};

const calculateWaterScore = (data: Partial<EnvironmentalAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.operationsInWaterStressed === "no") score += 20;
  if (data.waterRecyclingRate) score += (data.waterRecyclingRate / 100) * 40;
  if (data.treatmentBeforeDischarge) score += 40;

  return normalize(score, maxScore);
};

const calculateWasteScore = (data: Partial<EnvironmentalAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.wasteDiversionRate) score += (data.wasteDiversionRate / 100) * 60;
  if (data.hazardousWaste === 0) score += 20;
  if (data.wasteDisposalMethods?.landfill === 0) score += 20;

  return normalize(score, maxScore);
};

const calculateBiodiversityScore = (data: Partial<EnvironmentalAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.operationsNearProtectedAreas === "no") score += 30;
  if (data.biodiversityImpactAssessment) score += 30;
  if (data.biodiversityManagementPlan) score += 20;
  if (data.habitatsProtectedRestored && data.habitatsProtectedRestored > 0) score += 20;

  return normalize(score, maxScore);
};

const calculateEnvComplianceScore = (data: Partial<EnvironmentalAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.iso14001Certified) score += 40;
  if (data.environmentalPolicyPublic) score += 20;
  if (data.regularEnvironmentalAudits) score += 20;
  if (!data.environmentalViolations || data.environmentalViolations === 0) score += 20;

  return normalize(score, maxScore);
};

export const calculateEnvironmentalScore = (data: Partial<EnvironmentalAssessment>): EnvironmentalScore => {
  const emissions = calculateEmissionsScore(data);
  const energy = calculateEnergyScore(data);
  const water = calculateWaterScore(data);
  const waste = calculateWasteScore(data);
  const biodiversity = calculateBiodiversityScore(data);
  const compliance = calculateEnvComplianceScore(data);

  // Weighted average
  const total = (
    emissions * 0.30 +
    energy * 0.20 +
    water * 0.15 +
    waste * 0.15 +
    biodiversity * 0.10 +
    compliance * 0.10
  );

  return {
    total: Math.round(total),
    ghgEmissions: Math.round(emissions),
    energyRenewable: Math.round(energy),
    waterManagement: Math.round(water),
    wasteManagement: Math.round(waste),
    biodiversity: Math.round(biodiversity),
    compliance: Math.round(compliance),
  };
};

// --- Social Scoring ---

const calculateSafetyScore = (data: Partial<SocialAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.iso45001Certified) score += 30;
  if (data.hsManagementSystemCoverage) score += (data.hsManagementSystemCoverage / 100) * 20;
  if (data.fatalities === 0) score += 20;

  // TRIR Calculation
  let trir = 0;
  if (data.recordableInjuries !== undefined && data.totalHoursWorked && data.totalHoursWorked > 0) {
    trir = (data.recordableInjuries * 200000) / data.totalHoursWorked;
    if (trir === 0) score += 20;
    else if (trir < 1) score += 15;
    else if (trir < 3) score += 10;
  } else {
    score += 10;
  }

  if (data.safetyTrainingHours && data.safetyTrainingHours > 10) score += 10;

  return normalize(score, maxScore);
};

const calculateDeiScore = (data: Partial<SocialAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  // Gender Balance (40 points)
  const totalWorkforce = data.totalWorkforce || 1;
  const womenWorkforce = data.employeesWomen || 0;
  const womenPercent = (womenWorkforce / totalWorkforce) * 100;

  // Ideal range 40-60%
  if (womenPercent >= 40 && womenPercent <= 60) score += 20;
  else if (womenPercent >= 30) score += 10;

  // Management Diversity
  const seniorMgmtWomen = data.seniorMgmtWomen || 0;
  const seniorMgmtMen = data.seniorMgmtMen || 0;
  const totalMgmt = seniorMgmtWomen + seniorMgmtMen;

  if (totalMgmt > 0) {
    const mgmtWomenPercent = (seniorMgmtWomen / totalMgmt) * 100;
    if (mgmtWomenPercent >= 30) score += 10;
  }

  // Board Diversity
  const boardWomen = data.boardWomen || 0;
  const boardMen = data.boardMen || 0;
  const totalBoard = boardWomen + boardMen;

  if (totalBoard > 0) {
    const boardWomenPercent = (boardWomen / totalBoard) * 100;
    if (boardWomenPercent >= 30) score += 10;
  }

  // Policies & Pay (60 points)
  if (data.formalDeiPolicy) score += 15;
  if (data.payEquityAnalysis) score += 15;
  if (data.genderPayGap !== undefined && data.genderPayGap < 5) score += 15;
  if (data.deiTraining) score += 15;

  return normalize(score, maxScore);
};

const calculateLaborScore = (data: Partial<SocialAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.humanRightsPolicy) score += 20;
  if (data.humanRightsDueDiligence) score += 20;
  if (data.freedomOfAssociation) score += 15;
  if (data.childForcedLaborIncidents === 0) score += 25;
  if (data.minimumWagePolicy === "living-wage") score += 20;

  return normalize(score, maxScore);
};

const calculateStakeholderScore = (data: Partial<SocialAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.supplierAudits && data.supplierAudits > 0) score += 20;
  if (data.suppliersScreenedSocial && data.suppliersScreenedSocial > 50) score += 20;
  if (data.communityInvestment && data.communityInvestment > 0) score += 20;
  if (data.customerSatisfactionScore && data.customerSatisfactionScore > 80) score += 20;
  if (data.productSafetyIncidents === 0) score += 20;

  return normalize(score, maxScore);
};

export const calculateSocialScore = (data: Partial<SocialAssessment>): SocialScore => {
  const safety = calculateSafetyScore(data);
  const dei = calculateDeiScore(data);
  const labor = calculateLaborScore(data);
  const stakeholder = calculateStakeholderScore(data);

  const total = (
    safety * 0.30 +
    dei * 0.25 +
    labor * 0.25 +
    stakeholder * 0.20
  );

  return {
    total: Math.round(total),
    healthSafety: Math.round(safety),
    diversityEquityInclusion: Math.round(dei),
    laborPractices: Math.round(labor),
    humanRights: Math.round(labor),
    supplyChain: Math.round(stakeholder),
    customerCommunity: Math.round(stakeholder)
  };
};

// --- Governance Scoring ---

const calculateBoardScore = (data: Partial<GovernanceAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.independentDirectors && data.totalBoardSize) {
    const independence = data.independentDirectors / data.totalBoardSize;
    if (independence > 0.5) score += 30;
  }

  if (data.womenOnBoard && data.totalBoardSize) {
    const diversity = data.womenOnBoard / data.totalBoardSize;
    if (diversity >= 0.3) score += 20;
  }

  // boardEsgOversight not in types?
  // Types has: auditCommittee, riskCommittee, sustainabilityCommittee, etc.
  // I'll check for sustainabilityCommittee
  if (data.sustainabilityCommittee) score += 30;
  if (data.riskCommittee) score += 20;

  if (data.boardEvaluation) score += 20;

  return normalize(score, maxScore);
};

const calculateExecutiveScore = (data: Partial<GovernanceAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  // compensationLinkedToEsg not in types?
  // Types has: variableCompLinkedToEsg (boolean), esgLinkagePercentage (number)
  if (data.variableCompLinkedToEsg) {
    score += 20;
    if (data.esgLinkagePercentage && data.esgLinkagePercentage > 10) score += 20;
  }

  // compensationTransparency not in types?
  // Types has: ceoTotalCompensation, medianEmployeeCompensation, ceoPayRatio
  if (data.ceoPayRatio) score += 30;

  if (data.ceoChairmanSeparated) score += 30;

  return normalize(score, maxScore);
};

const calculateEthicsScore = (data: Partial<GovernanceAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.codeOfConduct) score += 20;
  if (data.antiCorruptionPolicy) score += 20;
  if (data.whistleblowerMechanism) score += 20;
  // whistleblowerProtection not in types?
  // Types has: whistleblowerAnonymous, antiRetaliation
  if (data.antiRetaliation) score += 20;

  // complianceViolations not in types?
  // Types has: corruptionViolations, antiCompetitiveViolations, etc.
  const totalViolations = (data.corruptionViolations || 0) + (data.antiCompetitiveViolations || 0) + (data.financialViolations || 0);
  if (totalViolations === 0) score += 20;

  return normalize(score, maxScore);
};

const calculateRiskScore = (data: Partial<GovernanceAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  if (data.ermFramework && data.ermFramework !== "other") score += 25;
  // climateRiskIntegrated not in types?
  // Types has: esgRisksIntegrated
  if (data.esgRisksIntegrated) score += 25;

  // cybersecurityMeasures not in types?
  // Types has: cybersecurityFramework
  if (data.cybersecurityFramework && data.cybersecurityFramework !== "none") score += 25;

  if (data.internalAudit) score += 25;

  return normalize(score, maxScore);
};

const calculateTransparencyScore = (data: Partial<GovernanceAssessment>): number => {
  let score = 0;
  const maxScore = 100;

  // sustainabilityReporting not in types?
  // Types has: sustainabilityReport (boolean), reportFrequency
  if (data.sustainabilityReport) {
    score += 20;
    if (data.thirdPartyAssurance) score += 10;
  }

  if (data.externalAudit) score += 20;
  if (data.materialityAssessment) score += 20;
  // stakeholderEngagement not in types?
  // Types has: stakeholderInput, engagementProcessDocumented
  if (data.stakeholderInput && data.engagementProcessDocumented) score += 30;

  return normalize(score, maxScore);
};

export const calculateGovernanceScore = (data: Partial<GovernanceAssessment>): GovernanceScore => {
  const board = calculateBoardScore(data);
  const executive = calculateExecutiveScore(data);
  const ethics = calculateEthicsScore(data);
  const risk = calculateRiskScore(data);
  const transparency = calculateTransparencyScore(data);

  const total = (
    board * 0.25 +
    executive * 0.15 +
    ethics * 0.20 +
    risk * 0.20 +
    transparency * 0.20
  );

  return {
    total: Math.round(total),
    boardStructure: Math.round(board),
    executiveComp: Math.round(executive),
    ethicsCompliance: Math.round(ethics),
    riskControls: Math.round(risk),
    transparencyDisclosure: Math.round(transparency),
  };
};

// --- Composite Scoring ---

const getSectorWeights = (sector: IndustrySector) => {
  switch (sector) {
    case "manufacturing":
    case "energy":
    case "mining":
    case "construction":
    case "transportation":
    case "agriculture":
      return { environmental: 0.45, social: 0.30, governance: 0.25 };

    case "finance":
    case "professional-services":
    case "real-estate":
      return { environmental: 0.20, social: 0.35, governance: 0.45 };

    case "it-technology":
    case "telecommunications":
      return { environmental: 0.30, social: 0.40, governance: 0.30 };

    case "healthcare":
    case "pharmaceuticals":
      return { environmental: 0.25, social: 0.45, governance: 0.30 };

    default:
      return { environmental: 0.33, social: 0.33, governance: 0.34 };
  }
};

export const calculateCompositeScore = (
  eScore: number,
  sScore: number,
  gScore: number,
  sector: IndustrySector
): { score: number; weights: { environmental: number; social: number; governance: number } } => {
  const weights = getSectorWeights(sector);

  const score = (
    eScore * weights.environmental +
    sScore * weights.social +
    gScore * weights.governance
  );

  return {
    score: Math.round(score),
    weights,
  };
};

export const getRiskLevel = (score: number): "low" | "medium" | "high" | "critical" => {
  if (score >= 80) return "low";
  if (score >= 60) return "medium";
  if (score >= 40) return "high";
  return "critical";
};

export const getAlignmentClassification = (score: number): "fully-aligned" | "partially-aligned" | "developing" | "not-aligned" | "critical-gaps" => {
  if (score >= 85) return "fully-aligned";
  if (score >= 70) return "partially-aligned";
  if (score >= 50) return "developing";
  if (score >= 30) return "not-aligned";
  return "critical-gaps";
};

// --- Main Aggregator Function ---

export const calculateESGScores = (data: ESGAssessmentData): ESGScores => {
  const environmental = calculateEnvironmentalScore(data.environmental || {});
  const social = calculateSocialScore(data.social || {});
  const governance = calculateGovernanceScore(data.governance || {});

  const sector = data.profile?.industrySector || "manufacturing";
  const compositeData = calculateCompositeScore(environmental.total, social.total, governance.total, sector);

  const riskLevel = getRiskLevel(compositeData.score);
  const alignmentClassification = getAlignmentClassification(compositeData.score);

  return {
    environmental,
    social,
    governance,
    composite: compositeData.score,
    sectorWeights: compositeData.weights,
    riskLevel,
    alignmentClassification
  };
};
