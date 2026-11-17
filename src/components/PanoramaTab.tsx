import React from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Car
} from 'lucide-react';
import { CompanyInfo, Contract, Risk, Measure } from '../types';

interface PanoramaTabProps {
  company: CompanyInfo;
  contracts: Contract[];
  risks: Risk[];
  measures: Measure[];
  onOpenAddMeasure: () => void;
  onOpenAddContract: () => void;
  onOpenAddRisk: () => void;
}

export const PanoramaTab: React.FC<PanoramaTabProps> = ({
  company,
  contracts,
  risks,
  measures,
  onOpenAddMeasure,
  onOpenAddContract,
  onOpenAddRisk
}) => {
  // Compute global statistics
  const totalRisks = risks.length;
  const highRisks = risks.filter(r => r.initialProbability * r.initialImpact >= 8).length;
  const activeContracts = contracts.filter(c => c.status === 'Actif').length;
  const totalPremium = contracts.reduce((sum, c) => sum + c.premium, 0);

  // Compute coverage percentage
  const coveredRisksCount = risks.filter(r => {
    const c = contracts.find(ctr => ctr.id === r.contractId);
    return c && c.status === 'Actif';
  }).length;

  const coveragePercent = totalRisks > 0 ? Math.round((coveredRisksCount / totalRisks) * 100) : 0;

  // Average measures effectiveness
  const evaluatedMeasures = measures.filter(m => m.evaluation?.effectiveness !== undefined);
  const avgEffectiveness = evaluatedMeasures.length > 0
    ? Math.round(evaluatedMeasures.reduce((sum, m) => sum + m.evaluation!.effectiveness, 0) / evaluatedMeasures.length)
    : 72;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Company overview</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Company overview according to ISO 31000
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Updated: 05/08/2026</span>
        </div>
      </div>

      {/* Main Blue Hospital Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold tracking-tight">{company.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                health
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-white/90">
                large
              </span>
            </div>
            <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
              {company.sector} • Providing medical care, diagnosis, treatment and healthcare services
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-medium text-blue-100">
              <span>📍 {company.location}</span>
              <span>👥 {company.employees} employees</span>
              <span>📈 CA: {company.revenue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Financial */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Financial</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Revenue</span>
              <span className="font-bold text-slate-900">{company.revenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Profit margin</span>
              <span className="font-bold text-emerald-600">12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Growth</span>
              <span className="font-bold text-emerald-600">+8%</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">Budget insurance</span>
              <span className="font-bold text-slate-900">€{company.insuranceBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Operational */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Operational</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Employees</span>
              <span className="font-bold text-slate-900">{company.employees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sites</span>
              <span className="font-bold text-slate-900">{company.sites}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Facilities</span>
              <span className="font-bold text-slate-900">{company.facilities}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">Fleet</span>
              <span className="font-bold text-slate-900">{company.vehicles} vehicles</span>
            </div>
          </div>
        </div>

        {/* Risks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Risks</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Total risks</span>
              <span className="font-bold text-slate-900">{totalRisks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">High risks</span>
              <span className="font-bold text-red-600">{highRisks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pending measures</span>
              <span className="font-bold text-amber-600">{measures.length}</span>
            </div>
          </div>
        </div>

        {/* Insurance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Insurance</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Active contracts</span>
              <span className="font-bold text-slate-900">{activeContracts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Annual premium</span>
              <span className="font-bold text-purple-700">€{totalPremium.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">Cost/Sales Ratio</span>
              <span className="font-bold text-slate-900">2.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Coverage Analysis Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Risk coverage analysis</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Global Coverage */}
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-emerald-800">Global coverage</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-2">
                  {coveragePercent}%
                </div>
                <p className="text-xs text-emerald-700 mt-1 font-medium">
                  {coveredRisksCount} / {totalRisks} risks covered by an active policy
                </p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${coveragePercent}%` }}
              ></div>
            </div>
          </div>

          {/* High Risks */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-amber-900">High risks</span>
                <div className="text-3xl font-extrabold text-amber-700 mt-2">
                  {highRisks}
                </div>
                <p className="text-xs text-amber-800 mt-1 font-medium">
                  Risks requiring priority mitigation attention (Score ≥ 8)
                </p>
              </div>
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={onOpenAddRisk}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
              >
                + Add risk
              </button>
            </div>
          </div>

          {/* Effectiveness of the measures */}
          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-blue-900">Effectiveness of measures</span>
                <div className="text-3xl font-extrabold text-blue-700 mt-2">
                  {avgEffectiveness}%
                </div>
                <p className="text-xs text-blue-800 mt-1 font-medium">
                  Average effectiveness of preventive measures
                </p>
              </div>
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                id="btn-panorama-add-measure"
                onClick={onOpenAddMeasure}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                + Add measure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
