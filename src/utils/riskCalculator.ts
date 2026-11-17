import { Risk, Contract, Measure, CalculatedRiskData } from "../types";

export function calculateRiskMatrix(
  risks: Risk[],
  contracts: Contract[],
  measures: Measure[]
): CalculatedRiskData[] {
  const contractMap = new Map<string, Contract>();
  contracts.forEach(c => contractMap.set(c.id, c));

  return risks.map(risk => {
    // Find contract
    const contract = contractMap.get(risk.contractId);

    // Find measures linked to this risk
    const riskMeasures = measures.filter(m => m.riskId === risk.id);

    // Calculate residual probability and residual impact
    let residualProbability = risk.initialProbability;
    let residualImpact = risk.initialImpact;

    // If measures with evaluation exist, derive residual scores
    const evaluatedMeasures = riskMeasures.filter(m => m.evaluation !== undefined);

    if (evaluatedMeasures.length > 0) {
      // Pick the latest evaluation or compute average residual values
      const lastEval = evaluatedMeasures[evaluatedMeasures.length - 1].evaluation!;
      if (lastEval.afterProbability !== undefined && lastEval.afterProbability > 0) {
        residualProbability = Math.max(1, Math.min(4, lastEval.afterProbability));
      }
      if (lastEval.afterImpact !== undefined && lastEval.afterImpact > 0) {
        residualImpact = Math.max(1, Math.min(4, lastEval.afterImpact));
      }
    } else if (riskMeasures.length > 0) {
      // Small automated reduction if measures exist without explicit score override
      residualProbability = Math.max(1, risk.initialProbability - 1);
    }

    const residualScore = residualProbability * residualImpact;

    let criticalityLevel: 'Critique' | 'Elevé' | 'Modéré' | 'Faible' = 'Faible';
    if (residualScore >= 12) {
      criticalityLevel = 'Critique';
    } else if (residualScore >= 8) {
      criticalityLevel = 'Elevé';
    } else if (residualScore >= 4) {
      criticalityLevel = 'Modéré';
    } else {
      criticalityLevel = 'Faible';
    }

    const coverageStatus: 'Couverts' | 'Partiellement' | 'Non couvert' = 
      !contract || contract.status !== 'Actif' ? 'Non couvert' :
      (risk.coveragePercentage === undefined || risk.coveragePercentage === 100) ? 'Couverts' :
      (risk.coveragePercentage === 0) ? 'Non couvert' : 'Partiellement';

    return {
      risk,
      contract,
      measures: riskMeasures,
      residualProbability,
      residualImpact,
      residualScore,
      criticalityLevel,
      coverageStatus
    };
  });
}
