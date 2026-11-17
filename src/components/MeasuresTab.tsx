import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Activity,
  UserCheck,
  Calendar,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Measure, Risk } from '../types';

interface MeasuresTabProps {
  measures: Measure[];
  risks: Risk[];
  onOpenAddMeasure: () => void;
  onDeleteMeasure: (id: string) => void;
}

export const MeasuresTab: React.FC<MeasuresTabProps> = ({
  measures,
  risks,
  onOpenAddMeasure,
  onDeleteMeasure
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const riskMap = new Map<string, Risk>();
  risks.forEach(r => riskMap.set(r.id, r));

  const filteredMeasures = measures.filter(m => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || m.status === selectedStatus;
    const matchesType = selectedType === 'All' || m.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const implementedCount = measures.filter(m => m.status === 'Mise en œuvre').length;
  const inProgressCount = measures.filter(m => m.status === 'En cours' || m.status === 'Planifiée').length;

  const evaluatedMeasures = measures.filter(m => m.evaluation?.effectiveness !== undefined);
  const avgEfficiency = evaluatedMeasures.length > 0
    ? Math.round(evaluatedMeasures.reduce((sum, m) => sum + m.evaluation!.effectiveness, 0) / evaluatedMeasures.length)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Risk management measures</h2>
          <p className="text-xs text-slate-500 font-medium">
            Prevention, protection and compliance according to ISO 31000
          </p>
        </div>

        {/* Requirement 2: Ajouter une mesure button */}
        <button
          id="btn-add-measure-top"
          onClick={onOpenAddMeasure}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add a measure</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total measurements</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{measures.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Implemented</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{implementedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">In progress / Planified</span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{inProgressCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Average efficiency</span>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">
              {avgEfficiency > 0 ? `${avgEfficiency}%` : 'N / A'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search for a measurement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 text-slate-700"
          >
            <option value="All">All statuses</option>
            <option value="Planifiée">Planifiée</option>
            <option value="En cours">En cours</option>
            <option value="Mise en œuvre">Mise en œuvre</option>
            <option value="Suspendue">Suspendue</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 text-slate-700"
          >
            <option value="All">All types</option>
            <option value="Préventive">Préventive</option>
            <option value="Protectrice">Protectrice</option>
            <option value="Corrective">Corrective</option>
            <option value="Organisationnelle">Organisationnelle</option>
          </select>
        </div>
      </div>

      {/* List of Measures */}
      {filteredMeasures.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-600">
            No measures have yet been associated with this company.
          </p>
          <button
            onClick={onOpenAddMeasure}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
          >
            Add a measure
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeasures.map((m) => {
            const parentRisk = riskMap.get(m.riskId);
            return (
              <div
                key={m.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700">
                      {m.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          m.status === 'Mise en œuvre'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'En cours'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {m.status}
                      </span>
                      <button
                        onClick={() => onDeleteMeasure(m.id)}
                        className="p-1 text-slate-300 hover:text-red-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Supprimer la mesure"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3 group-hover:text-blue-600 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{m.description}</p>

                  {/* Covered Risk Name */}
                  {parentRisk && (
                    <div className="mt-3 p-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px]">
                      <span className="text-slate-400 font-medium">Risque couvert : </span>
                      <span className="font-bold text-slate-800">{parentRisk.title}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      {m.responsible}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {m.date}
                    </span>
                  </div>

                  {/* Requirement 6: Evaluation effectiveness gauge */}
                  {m.evaluation && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Efficacité évaluée :
                        </span>
                        <span className="text-purple-700 font-extrabold">
                          {m.evaluation.effectiveness}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${m.evaluation.effectiveness}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
