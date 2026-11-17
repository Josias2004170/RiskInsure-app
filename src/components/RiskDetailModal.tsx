import React, { useState } from 'react';
import { X, Shield, AlertTriangle, Building2, Calendar, User, FileText, CheckCircle2, XCircle, Activity, ArrowRight } from 'lucide-react';
import { Risk, Contract, Measure } from '../types';

interface RiskDetailModalProps {
  risk: Risk;
  contract?: Contract;
  measures: Measure[];
  onClose: () => void;
  onEdit?: () => void;
  onAddMeasure?: () => void;
}

export const RiskDetailModal: React.FC<RiskDetailModalProps> = ({
  risk,
  contract,
  measures,
  onClose,
  onEdit,
  onAddMeasure
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'measures' | 'coverage'>('overview');

  const score = risk.initialProbability * risk.initialImpact;
  let criticality: 'Faible' | 'Modéré' | 'Significatif' | 'Élevé' | 'Critique';
  if (score <= 4) criticality = 'Faible';
  else if (score <= 9) criticality = 'Modéré';
  else if (score <= 16) criticality = 'Significatif';
  else if (score <= 20) criticality = 'Élevé';
  else criticality = 'Critique';

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'Faible': return 'bg-green-100 text-green-700 border-green-300';
      case 'Modéré': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Significatif': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Élevé': return 'bg-red-100 text-red-700 border-red-300';
      case 'Critique': return 'bg-red-200 text-red-800 border-red-400';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getCoverageColor = (status?: string) => {
    switch (status) {
      case 'Couvert': return 'bg-green-100 text-green-700';
      case 'Partiellement couvert': return 'bg-yellow-100 text-yellow-700';
      case 'Non couvert': return 'bg-red-100 text-red-700';
      case 'À analyser': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{risk.title}</h3>
              <p className="text-xs text-blue-100/80">Fiche de risque détaillée</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Vue d'ensemble</span>
          </button>
          <button
            onClick={() => setActiveTab('measures')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'measures'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Mesures ({measures.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coverage')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'coverage'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Couverture assurance</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Criticality Badge */}
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${getCriticalityColor(criticality)}`}>
                  {criticality} (Score: {score}/25)
                </span>
                {risk.isMandatory && (
                  <span className="px-4 py-2 rounded-lg text-sm font-bold bg-red-100 text-red-700 border border-red-300">
                    RISQUE OBLIGATOIRE
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Description</h4>
                <p className="text-sm text-slate-700">{risk.description}</p>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Famille</div>
                  <div className="text-sm font-bold text-slate-900">{risk.family}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Probabilité</div>
                  <div className="text-sm font-bold text-slate-900">{risk.initialProbability}/5</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Impact</div>
                  <div className="text-sm font-bold text-slate-900">{risk.initialImpact}/5</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Statut</div>
                  <div className="text-sm font-bold text-slate-900">{risk.status || 'Identifié'}</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                {risk.causes && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Causes</h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{risk.causes}</p>
                  </div>
                )}
                {risk.consequences && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Conséquences potentielles</h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{risk.consequences}</p>
                  </div>
                )}
                {risk.existingMeasures && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Mesures existantes</h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{risk.existingMeasures}</p>
                  </div>
                )}
              </div>

              {/* Treatment */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="text-sm font-bold text-blue-900 mb-2">Traitement du risque</h4>
                <div className="text-sm text-blue-800 font-medium">
                  {risk.treatment || 'Non défini'}
                </div>
              </div>

              {/* Responsibility */}
              <div className="grid grid-cols-2 gap-4">
                {risk.department && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Département:</span>
                    <span className="font-medium text-slate-900">{risk.department}</span>
                  </div>
                )}
                {risk.responsible && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Responsable:</span>
                    <span className="font-medium text-slate-900">{risk.responsible}</span>
                  </div>
                )}
                {risk.identificationDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Date identification:</span>
                    <span className="font-medium text-slate-900">{risk.identificationDate}</span>
                  </div>
                )}
              </div>

              {risk.comments && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Commentaires</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{risk.comments}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'measures' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Mesures préventives ({measures.length})</h4>
                {onAddMeasure && (
                  <button
                    onClick={onAddMeasure}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Ajouter une mesure</span>
                  </button>
                )}
              </div>

              {measures.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl">
                  <Activity className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Aucune mesure associée à ce risque</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {measures.map(measure => (
                    <div key={measure.id} className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm font-bold text-slate-900">{measure.title}</h5>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                              {measure.type}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {measure.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{measure.description}</p>
                          <div className="flex items-center gap-4 text-[11px] text-slate-500">
                            <span>Responsable: {measure.responsible}</span>
                            <span>Date: {measure.date}</span>
                          </div>
                          {measure.evaluation && (
                            <div className="mt-2 p-2 bg-green-50 rounded-lg">
                              <div className="text-xs text-green-800">
                                Efficacité: {measure.evaluation.effectiveness}% | 
                                Avant: {measure.evaluation.beforeProbability}x{measure.evaluation.beforeImpact} → 
                                Après: {measure.evaluation.afterProbability}x{measure.evaluation.afterImpact}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'coverage' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${getCoverageColor(risk.coverageStatus)}`}>
                  {risk.coverageStatus || 'À analyser'}
                </span>
                {risk.coveragePercentage !== undefined && (
                  <span className="text-sm text-slate-600">
                    Couverture: {risk.coveragePercentage}%
                  </span>
                )}
              </div>

              {contract ? (
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h4 className="text-sm font-bold text-green-900">Ce risque est couvert par un contrat</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Assureur:</span>
                      <span className="font-medium text-slate-900 ml-2">{contract.insurer}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Numéro de police:</span>
                      <span className="font-medium text-slate-900 ml-2">{contract.contractNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Type:</span>
                      <span className="font-medium text-slate-900 ml-2">{contract.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Plafond:</span>
                      <span className="font-medium text-slate-900 ml-2">{contract.coverageLimit.toLocaleString()} €</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Franchise:</span>
                      <span className="font-medium text-slate-900 ml-2">{contract.deductible.toLocaleString()} €</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Expiration:</span>
                      <span className="font-medium text-slate-900 ml-2">{contract.endDate}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <h4 className="text-sm font-bold text-red-900">Ce risque n'est pas couvert</h4>
                  </div>
                  <p className="text-sm text-red-800">
                    Aucun contrat d'assurance n'est associé à ce risque. 
                    Veuillez le relier à un contrat existant ou créer un nouveau contrat.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
          >
            Fermer
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Modifier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskDetailModal;
