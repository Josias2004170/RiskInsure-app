import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  Plus,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  Info,
  PieChart
} from 'lucide-react';
import { Risk, Contract, Measure, Claim, CompanyInfo } from '../types';

interface OverviewTabProps {
  company: CompanyInfo;
  contracts: Contract[];
  risks: Risk[];
  measures: Measure[];
  claims: Claim[];
  onNavigateTab: (tab: any) => void;
  onOpenAddContract: () => void;
  onOpenAddRisk: () => void;
  onOpenAddMeasure: () => void;
  onOpenAddClaim: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  company,
  contracts,
  risks,
  measures,
  claims,
  onNavigateTab,
  onOpenAddContract,
  onOpenAddRisk,
  onOpenAddMeasure,
  onOpenAddClaim
}) => {
  const highRisksCount = risks.filter(r => r.initialProbability * r.initialImpact >= 8).length;
  const activeContractsCount = contracts.filter(c => c.status === 'Actif').length;
  
  // Calculate covered vs uncovered risks
  const coveredRisks = risks.filter(r => r.contractId && r.contractId !== '');
  const uncoveredRisks = risks.filter(r => !r.contractId || r.contractId === '');
  const coveredPercentage = risks.length > 0 ? Math.round((coveredRisks.length / risks.length) * 100) : 0;
  const uncoveredPercentage = risks.length > 0 ? 100 - coveredPercentage : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tableau de bord exécutif</h2>
          <p className="text-xs text-slate-500 font-medium">
            Vue d'ensemble de la gestion des risques et couverture d'assurance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddContract}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Nouveau contrat</span>
          </button>
          <button
            onClick={onOpenAddRisk}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>Nouveau risque</span>
          </button>
          <button
            onClick={onOpenAddMeasure}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle mesure</span>
          </button>
        </div>
      </div>

      {/* Top 4 Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('contracts')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">Contrats Actifs</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{activeContractsCount}</div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
            Gérer les polices <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('risks')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">Risques Répertoriés</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{risks.length}</div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            {highRisksCount} risque(s) élevé(s)
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('measures')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">Mesures de Prévention</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{measures.length}</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">
            Suivi des plans d'action
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('claims')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">Sinistres Déclarés</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{claims.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Accéder au suivi
          </p>
        </div>
      </div>

      {/* Risk Coverage Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Couverture des Risques par Assurance</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Pie Chart */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(
                  #10b981 0deg ${coveredPercentage * 3.6}deg,
                  #3b82f6 ${coveredPercentage * 3.6}deg 360deg
                )`
              }}
            />
            {/* Center hole for donut effect */}
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-extrabold text-slate-900">{risks.length}</div>
                <div className="text-[10px] text-slate-500">Risques</div>
              </div>
            </div>
          </div>

          {/* Legend and Explanation */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Ce diagramme montre la proportion de risques couverts par vos contrats d'assurance actuels.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="font-medium text-slate-700">Risques couverts</span>
                </div>
                <span className="font-bold text-emerald-600">{coveredRisks.length} ({coveredPercentage}%)</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-slate-700">Risques non couverts</span>
                </div>
                <span className="font-bold text-blue-600">{uncoveredRisks.length} ({uncoveredPercentage}%)</span>
              </div>
            </div>

            {uncoveredRisks.length > 0 && (
              <button
                onClick={onOpenAddContract}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                + Ajouter un contrat pour couvrir les risques restants
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Risks & Measures Double Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Risks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Derniers Risques Enregistrés</h3>
            <button
              onClick={() => onNavigateTab('risks')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Voir tout
            </button>
          </div>

          <div className="space-y-2">
            {risks.slice(0, 4).map((r) => (
              <div key={r.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">{r.title}</p>
                  <p className="text-[11px] text-slate-500">{r.family}</p>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 font-bold rounded-md">
                  Score: {r.initialProbability * r.initialImpact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Measures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Dernières Mesures de Gestion</h3>
            <button
              onClick={() => onNavigateTab('measures')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Voir tout
            </button>
          </div>

          <div className="space-y-2">
            {measures.slice(0, 4).map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">{m.title}</p>
                  <p className="text-[11px] text-slate-500">Resp: {m.responsible}</p>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 font-bold rounded-md">
                  Eff: {m.evaluation?.effectiveness ?? 50}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
