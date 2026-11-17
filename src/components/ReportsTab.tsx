import React from 'react';
import { FileText, Filter, Download, ShieldCheck, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Risk, Contract, Measure, Claim } from '../types';

interface ReportsTabProps {
  risks: Risk[];
  contracts: Contract[];
  measures: Measure[];
  claims: Claim[];
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  risks,
  contracts,
  measures,
  claims
}) => {
  const highRisks = risks.filter(r => r.initialProbability * r.initialImpact >= 8).length;
  const implementedMeasures = measures.filter(m => m.status === 'Mise en œuvre').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reports and Analyses</h2>
          <p className="text-xs text-slate-500 font-medium">Visualizing risk management data</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI 4 Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg shadow-blue-500/15 flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-blue-100">Total risks</span>
            <div className="text-3xl font-extrabold mt-1">{risks.length}</div>
            <p className="text-[11px] text-blue-200 mt-1">Identified in register</p>
          </div>
          <TrendingUp className="w-6 h-6 text-blue-200" />
        </div>

        <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-lg shadow-emerald-500/15 flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-emerald-100">Blanket / Coverage</span>
            <div className="text-3xl font-extrabold mt-1">
              {risks.length > 0 ? Math.round((contracts.length > 0 ? 1 : 0) * 100) : 0}%
            </div>
            <p className="text-[11px] text-emerald-200 mt-1">Risks covered</p>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-200" />
        </div>

        <div className="bg-amber-600 text-white p-5 rounded-2xl shadow-lg shadow-amber-500/15 flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-amber-100">High risks</span>
            <div className="text-3xl font-extrabold mt-1">{highRisks}</div>
            <p className="text-[11px] text-amber-200 mt-1">Score ≥ 8</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-200" />
        </div>

        <div className="bg-purple-600 text-white p-5 rounded-2xl shadow-lg shadow-purple-500/15 flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-purple-100">Measures</span>
            <div className="text-3xl font-extrabold mt-1">{implementedMeasures}</div>
            <p className="text-[11px] text-purple-200 mt-1">Implemented</p>
          </div>
          <Activity className="w-6 h-6 text-purple-200" />
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Detailed risk breakdown by criticality</span>
        </h3>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
            <tr>
              <th className="p-3">Risk</th>
              <th className="p-3">Family</th>
              <th className="p-3">Probability</th>
              <th className="p-3">Impact</th>
              <th className="p-3">Score</th>
              <th className="p-3">Covered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {risks.map((r) => {
              const score = r.initialProbability * r.initialImpact;
              const hasContract = contracts.some(c => c.id === r.contractId);
              return (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{r.title}</td>
                  <td className="p-3 text-slate-600">{r.family}</td>
                  <td className="p-3 text-slate-700 font-semibold">{r.initialProbability} / 4</td>
                  <td className="p-3 text-slate-700 font-semibold">{r.initialImpact} / 4</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-extrabold ${
                        score >= 8 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {score}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-600">
                    {hasContract ? 'Oui' : 'Non'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
