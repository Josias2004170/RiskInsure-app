import React, { useState } from 'react';
import {
  AlertTriangle,
  Info,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Activity,
  Plus,
  Download,
  X,
  FileText
} from 'lucide-react';
import { Risk, Contract, Measure, CalculatedRiskData, CompanyInfo } from '../types';
import InsuranceMap from './InsuranceMap';
import InsuranceChecklist from './InsuranceChecklist';
import ContractDetails from './ContractDetails';
import { calculateRiskMatrix } from '../utils/riskCalculator';

interface MappingTabProps {
  risks: Risk[];
  contracts: Contract[];
  measures: Measure[];
  onOpenAddRisk: () => void;
  onOpenAddMeasureForRisk: (riskId: string) => void;
  company?: CompanyInfo;
}

export const MappingTab: React.FC<MappingTabProps> = ({
  risks,
  contracts,
  measures,
  onOpenAddRisk,
  onOpenAddMeasureForRisk
  , company
}) => {
  const detectedSector = (() => {
    const sectorStr = (company?.sector || '').toLowerCase();
    if (sectorStr.includes('sant') || sectorStr.includes('medical') || sectorStr.includes('hospital')) return 'Healthcare';
    if (sectorStr.includes('construct')) return 'Construction';
    if (sectorStr.includes('manufact') || sectorStr.includes('industrie')) return 'Manufacturing';
    if (sectorStr.includes('tech') || sectorStr.includes('informat')) return 'Technology';
    if (sectorStr.includes('retail') || sectorStr.includes('commerce')) return 'Retail';
    if (sectorStr.includes('transport') || sectorStr.includes('logist')) return 'Transport';
    return 'General';
  })();

  const [sector, setSector] = useState<string>(detectedSector);
  const [selectedRiskData, setSelectedRiskData] = useState<CalculatedRiskData | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Requirement 8: Calculate residual risk based ONLY on registered risks in DB
  const calculatedData = calculateRiskMatrix(risks, contracts, measures);

  const criticalCount = calculatedData.filter(d => d.criticalityLevel === 'Critique').length;
  const highCount = calculatedData.filter(d => d.criticalityLevel === 'Elevé').length;
  const moderateCount = calculatedData.filter(d => d.criticalityLevel === 'Modéré').length;
  const weakCount = calculatedData.filter(d => d.criticalityLevel === 'Faible').length;


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Risk mapping</h2>
          <p className="text-xs text-slate-500 font-medium">
            Probability/impact matrix according to ISO 31000 computed from registered measures
          </p>
        </div>
        <button
          onClick={onOpenAddRisk}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un risque</span>
        </button>
      </div>

      {/* Criticality Zone Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical */}
        <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-red-700">Critical</span>
            <div className="text-2xl font-extrabold text-red-600 mt-1">{criticalCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* High / Pupil */}
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800">Pupil / High</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{highCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Moderate */}
        <div className="bg-yellow-50/70 p-4 rounded-2xl border border-yellow-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-yellow-800">Moderate</span>
            <div className="text-2xl font-extrabold text-yellow-600 mt-1">{moderateCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Weak */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800">Weak / Low</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{weakCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4x4 Risk Matrix Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Risk Matrix (Probability vs Impact)
          </h3>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Registered risks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Covered by insurance
            </span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="relative pt-6 pb-2 px-8">
          {/* Y-axis Label */}
          <div className="absolute -left-2 top-1/2 -rotate-90 -translate-y-1/2 text-xs font-bold text-slate-400 tracking-wider">
            Impact potentiel (1-4)
          </div>

          <div className="grid grid-rows-4 gap-2">
            {[4, 3, 2, 1].map((impactVal) => (
              <div key={impactVal} className="flex items-center gap-2">
                <span className="w-6 text-right text-xs font-bold text-slate-400">
                  {impactVal}
                </span>

                <div className="grid grid-cols-4 gap-2 flex-1 h-20">
                  {[1, 2, 3, 4].map((probVal) => {
                    const score = impactVal * probVal;
                    let cellBg = 'bg-slate-50 border-slate-200';
                    if (score >= 12) cellBg = 'bg-red-500/10 border-red-200';
                    else if (score >= 8) cellBg = 'bg-amber-500/10 border-amber-200';
                    else if (score >= 4) cellBg = 'bg-yellow-500/10 border-yellow-200';
                    else cellBg = 'bg-emerald-500/10 border-emerald-200';

                    // Find risks positioned at this (residualProbability, residualImpact) cell
                    const cellRisks = calculatedData.filter(
                      d => d.residualProbability === probVal && d.residualImpact === impactVal
                    );

                    return (
                      <div
                        key={probVal}
                        className={`relative rounded-xl border ${cellBg} p-2 flex flex-wrap gap-1.5 items-center justify-center hover:shadow-inner transition-all`}
                      >
                        {cellRisks.map((d) => (
                          <button
                            key={d.risk.id}
                            onClick={() => setSelectedRiskData(d)}
                            title={`${d.risk.title} (Score: ${d.residualScore})`}
                            className={`p-2 rounded-xl text-xs font-bold text-white shadow-xs hover:scale-105 transition-transform flex items-center gap-1 max-w-full truncate ${
                              d.coverageStatus === 'Couverts' ? 'bg-emerald-600' : 'bg-blue-600'
                            }`}
                          >
                            <span className="truncate">{d.risk.title}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* X-axis Label */}
          <div className="flex items-center gap-2 mt-2 ml-8">
            <div className="grid grid-cols-4 gap-2 flex-1 text-center text-xs font-bold text-slate-400">
              <span>1 (Faible)</span>
              <span>2 (Modéré)</span>
              <span>3 (Élevé)</span>
              <span>4 (Critique)</span>
            </div>
          </div>
          <div className="text-center text-xs font-bold text-slate-400 tracking-wider mt-2">
            Probabilité de survenance (1-4)
          </div>
        </div>
      </div>

      {/* Insurance cartography (couvert / non couvert) */}
      <div className="mt-6">
        <InsuranceMap initialSector={detectedSector} contracts={contracts} sector={sector} onSectorChange={setSector} />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button 
          onClick={() => setShowImportModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Importer risques par défaut du secteur</span>
        </button>
        <div className="text-xs text-slate-500">Secteur actif : <strong>{sector}</strong></div>
      </div>

      <div className="mt-6">
        <InsuranceChecklist appRisks={risks} contracts={contracts} sector={sector} onSectorChange={setSector} />
      </div>

      {/* Contracts list */}
      <div className="mt-6 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold">Contrats</h4>
          <span className="text-xs text-slate-500">{contracts.length} contrats enregistrés</span>
        </div>
        <div className="space-y-2">
          {contracts.map(c => (
            <div key={c.id} className="flex items-center justify-between p-2 rounded-md border">
              <div>
                <div className="font-semibold text-sm">{c.insurer}</div>
                <div className="text-xs text-slate-500">{c.type} • {c.contractNumber}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedContract(c)} className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs">Voir</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Risk Detail Modal / Drawer */}
      {selectedRiskData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                  {selectedRiskData.risk.family}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {selectedRiskData.risk.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRiskData(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2">{selectedRiskData.risk.description}</p>

            <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400">Score Résiduel :</span>
                <p className="text-sm font-extrabold text-slate-900">
                  {selectedRiskData.residualScore} / 16 ({selectedRiskData.criticalityLevel})
                </p>
              </div>
              <div>
                <span className="text-slate-400">Couverture Assureur :</span>
                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {selectedRiskData.contract?.insurer || 'Non couvert'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase">
                Mesures associées ({selectedRiskData.measures.length})
              </h4>
              {selectedRiskData.measures.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Aucune mesure préventive enregistrée.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedRiskData.measures.map((m) => (
                    <div key={m.id} className="p-2.5 bg-slate-50 rounded-lg text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{m.title}</p>
                        <p className="text-[11px] text-slate-500">Resp: {m.responsible}</p>
                      </div>
                      <span className="font-extrabold text-blue-600">
                        {m.evaluation?.effectiveness ?? 50}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between gap-2">
              <button
                onClick={() => {
                  const rId = selectedRiskData.risk.id;
                  setSelectedRiskData(null);
                  onOpenAddMeasureForRisk(rId);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md"
              >
                + Ajouter une mesure à ce risque
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedContract && (
        <ContractDetails contract={selectedContract} onClose={() => setSelectedContract(null)} />
      )}

      {/* Import Default Risks Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base">Importer les risques par défaut</h3>
                  <p className="text-xs text-emerald-100 mt-1">Secteur : {sector}</p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">Cette action va importer les risques par défaut pour le secteur <strong>{sector}</strong>.</p>
                  <p>Ces risques sont spécifiquement adaptés à votre secteur d'activité et incluent les couvertures d'assurance recommandées.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">Risques qui seront importés :</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 ml-6 list-disc">
                  <li>Risques obligatoires par la loi</li>
                  <li>Risques spécifiques au secteur {sector}</li>
                  <li>Couvertures d'assurance recommandées</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  Les risques déjà existants ne seront pas dupliqués.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  const ev = new CustomEvent('import-default-risks', { detail: { sector } });
                  window.dispatchEvent(ev as any);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Confirmer l'import</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
