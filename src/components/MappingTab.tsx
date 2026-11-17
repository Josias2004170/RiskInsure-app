import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Plus,
  Filter,
  Activity,
  Layers,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { Risk, Contract, Measure, CompanyInfo } from '../types';

interface MappingTabProps {
  risks: Risk[];
  contracts: Contract[];
  measures: Measure[];
  onOpenAddRisk: () => void;
  onOpenAddMeasureForRisk: (riskId: string) => void;
  company: CompanyInfo;
}

export const MappingTabPro: React.FC<MappingTabProps> = ({
  risks,
  contracts,
  measures,
  onOpenAddRisk,
  onOpenAddMeasureForRisk,
  company
}) => {
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCoverage, setSelectedCoverage] = useState('All');

  // Calculate risk data with residual probability/impact based on measures
  const calculatedRisks = risks.map(risk => {
    const riskMeasures = measures.filter(m => m.riskId === risk.id);
    const hasEffectiveMeasures = riskMeasures.some(m => m.evaluation?.effectiveness && m.evaluation.effectiveness > 50);

    let residualProbability = risk.initialProbability;
    let residualImpact = risk.initialImpact;

    if (hasEffectiveMeasures) {
      // Apply reduction based on average effectiveness
      const avgEffectiveness = riskMeasures.reduce((sum, m) => sum + (m.evaluation?.effectiveness || 0), 0) / riskMeasures.length;
      const reductionFactor = avgEffectiveness / 100;
      residualProbability = Math.max(1, Math.round(risk.initialProbability * (1 - reductionFactor * 0.5)));
      residualImpact = Math.max(1, Math.round(risk.initialImpact * (1 - reductionFactor * 0.3)));
    }

    const score = residualProbability * residualImpact;
    let criticalityLevel: 'Faible' | 'Modéré' | 'Significatif' | 'Élevé' | 'Critique';
    if (score <= 4) criticalityLevel = 'Faible';
    else if (score <= 9) criticalityLevel = 'Modéré';
    else if (score <= 16) criticalityLevel = 'Significatif';
    else if (score <= 20) criticalityLevel = 'Élevé';
    else criticalityLevel = 'Critique';

    const associatedContract = contracts.find(c => c.id === risk.contractId);
    const coverageStatus = associatedContract ? 'Couvert' : 'Non couvert';

    return {
      risk,
      contract: associatedContract,
      measures: riskMeasures,
      residualProbability,
      residualImpact,
      score,
      criticalityLevel,
      coverageStatus
    };
  });

  // Filter risks
  const filteredRisks = calculatedRisks.filter(r => {
    const matchesFamily = selectedFamily === 'All' || r.risk.family === selectedFamily;
    const matchesCoverage = selectedCoverage === 'All' || r.coverageStatus === selectedCoverage;
    return matchesFamily && matchesCoverage;
  });

  // Statistics
  const totalRisks = filteredRisks.length;
  const criticalRisks = filteredRisks.filter(r => r.criticalityLevel === 'Critique').length;
  const highRisks = filteredRisks.filter(r => r.criticalityLevel === 'Élevé').length;
  const uncoveredRisks = filteredRisks.filter(r => r.coverageStatus === 'Non couvert').length;
  const risksWithMeasures = filteredRisks.filter(r => r.measures.length > 0).length;

  // Matrix cells (5x5: Probability × Impact)
  const matrix: Record<string, typeof calculatedRisks> = {};
  for (let p = 1; p <= 5; p++) {
    for (let i = 1; i <= 5; i++) {
      const key = `${p}-${i}`;
      matrix[key] = filteredRisks.filter(r => r.residualProbability === p && r.residualImpact === i);
    }
  }

  // Get cell color based on score
  const getCellColor = (prob: number, impact: number) => {
    const score = prob * impact;
    if (score <= 4) return 'bg-green-50 border-green-200';
    if (score <= 9) return 'bg-yellow-50 border-yellow-200';
    if (score <= 16) return 'bg-orange-50 border-orange-200';
    if (score <= 20) return 'bg-red-50 border-red-200';
    return 'bg-red-100 border-red-300';
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'Faible': return 'text-green-600 bg-green-100';
      case 'Modéré': return 'text-yellow-600 bg-yellow-100';
      case 'Significatif': return 'text-orange-600 bg-orange-100';
      case 'Élevé': return 'text-red-600 bg-red-100';
      case 'Critique': return 'text-red-700 bg-red-200';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const families = ['All', ...new Set(risks.map(r => r.family))];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Cartographie des Risques</h2>
          <p className="text-xs text-slate-500 font-medium">
            Matrice Probabilité × Impact (échelle 1-5) selon ISO 31000
          </p>
        </div>
        <button
          onClick={onOpenAddRisk}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un risque</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Total risques</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalRisks}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
          <div className="text-xs text-red-600 font-medium">Critiques</div>
          <div className="text-2xl font-bold text-red-700 mt-1">{criticalRisks}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 shadow-sm">
          <div className="text-xs text-orange-600 font-medium">Élevés</div>
          <div className="text-2xl font-bold text-orange-700 mt-1">{highRisks}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-600 font-medium">Non couverts</div>
          <div className="text-2xl font-bold text-slate-700 mt-1">{uncoveredRisks}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
          <div className="text-xs text-blue-600 font-medium">Avec mesures</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{risksWithMeasures}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filtres:</span>
        </div>
        <select
          value={selectedFamily}
          onChange={(e) => setSelectedFamily(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {families.map(f => (
            <option key={f} value={f}>{f === 'All' ? 'Toutes familles' : f}</option>
          ))}
        </select>
        <select
          value={selectedCoverage}
          onChange={(e) => setSelectedCoverage(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">Tous</option>
          <option value="Couvert">Couverts</option>
          <option value="Non couvert">Non couverts</option>
        </select>
      </div>

      {/* 5x5 Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Matrice de Risques</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-green-50 border border-green-200"></div>
              <span className="text-slate-600">Faible (1-4)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-yellow-50 border border-yellow-200"></div>
              <span className="text-slate-600">Modéré (5-9)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-orange-50 border border-orange-200"></div>
              <span className="text-slate-600">Significatif (10-16)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-red-50 border border-red-200"></div>
              <span className="text-slate-600">Élevé (17-20)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
              <span className="text-slate-600">Critique (21-25)</span>
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="relative">
          {/* Y-axis label */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-600 whitespace-nowrap">
            PROBABILITÉ →
          </div>

          <div className="ml-8">
            {/* Matrix cells */}
            <div className="grid grid-cols-6 gap-1">
              {/* Header row */}
              <div></div>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="text-center text-xs font-bold text-slate-600 py-2">
                  {i}
                </div>
              ))}

              {/* Matrix rows */}
              {[5, 4, 3, 2, 1].map(prob => (
                <React.Fragment key={prob}>
                  <div className="text-xs font-bold text-slate-600 py-2 flex items-center justify-end pr-2">
                    {prob}
                  </div>
                  {[1, 2, 3, 4, 5].map(impact => {
                    const key = `${prob}-${impact}`;
                    const cellRisks = matrix[key] || [];
                    return (
                      <div
                        key={key}
                        className={`${getCellColor(prob, impact)} border rounded-lg p-2 min-h-[80px] flex flex-col items-center justify-center relative hover:shadow-md transition-shadow cursor-pointer`}
                      >
                        {cellRisks.length > 0 ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center mb-1">
                              {cellRisks.length}
                            </div>
                            <div className="text-[10px] text-slate-600 font-medium">
                              {cellRisks[0].criticalityLevel}
                            </div>
                          </>
                        ) : (
                          <div className="text-slate-300 text-xs">-</div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* X-axis label */}
            <div className="text-center text-xs font-bold text-slate-600 mt-2">
              IMPACT →
            </div>
          </div>
        </div>
      </div>

      {/* Risk Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Détail des risques par niveau de criticité</h3>
        </div>
        <div className="p-4 space-y-3">
          {filteredRisks.map(({ risk, residualProbability, residualImpact, score, criticalityLevel, coverageStatus, contract }) => (
            <div key={risk.id} className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-900">{risk.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getCriticalityColor(criticalityLevel)}`}>
                      {criticalityLevel}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${coverageStatus === 'Couvert' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {coverageStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{risk.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span>Probabilité: {residualProbability}/5</span>
                    <span>Impact: {residualImpact}/5</span>
                    <span>Score: {score}/25</span>
                    <span>Famille: {risk.family}</span>
                    {contract && <span>Contrat: {contract.insurer}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAddMeasureForRisk(risk.id)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Ajouter une mesure"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MappingTabPro;
export { MappingTabPro as MappingTab };
