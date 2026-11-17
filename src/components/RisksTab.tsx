import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Shield,
  AlertTriangle,
  Building2,
  Trash2,
  CheckCircle2,
  ShieldPlus,
  BookmarkPlus,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Check,
  AlertCircle,
  Database,
  Eye
} from 'lucide-react';
import { Risk, Contract, Measure, CompanyInfo } from '../types';
import { MASTER_RISK_CATALOG, CatalogRiskItem, SECTOR_OPTIONS, getMandatoryRisksForSector } from '../data/riskCatalog';
import RiskDetailModal from './RiskDetailModal';

interface RisksTabProps {
  company: CompanyInfo;
  risks: Risk[];
  contracts: Contract[];
  measures: Measure[];
  onOpenAddRisk: () => void;
  onOpenAddMeasureForRisk: (riskId: string) => void;
  onDeleteRisk: (riskId: string) => void;
  onSaveCatalogRisk: (catalogRisk: CatalogRiskItem, contractId: string) => Promise<void>;
}

export const RisksTabImproved: React.FC<RisksTabProps> = ({
  company,
  risks,
  contracts,
  measures,
  onOpenAddRisk,
  onOpenAddMeasureForRisk,
  onDeleteRisk,
  onSaveCatalogRisk
}) => {
  const [activeView, setActiveView] = useState<'registered' | 'catalog'>('registered');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('All');

  // Modal for selecting contract when saving a risk from catalog
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogRiskItem | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Modal for viewing risk details
  const [selectedRiskForDetail, setSelectedRiskForDetail] = useState<Risk | null>(null);

  const families = [
    'All',
    'Risques humains',
    'Risques opérationnels',
    'Risques financiers',
    'Risques juridiques et réglementaires',
    'Risques technologiques / cyber',
    'Risques matériels',
    'Risques environnementaux',
    'Risques stratégiques',
    'Risques fournisseurs / tiers',
    'Risques de responsabilité'
  ];

  // Get mandatory risks for current sector
  const mandatoryCatalogRisks = getMandatoryRisksForSector(company.sector);

  // Separate registered risks into mandatory and identified
  const mandatoryRegisteredRisks = risks.filter(r => r.isMandatory);
  const identifiedRisks = risks.filter(r => !r.isMandatory);

  // Filter registered risks
  const filteredMandatory = mandatoryRegisteredRisks.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = selectedFamily === 'All' || r.family === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  const filteredIdentified = identifiedRisks.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = selectedFamily === 'All' || r.family === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  // Filter catalog
  const filteredCatalog = MASTER_RISK_CATALOG.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = selectedFamily === 'All' || item.family === selectedFamily;
    const matchesSector = item.applicableSectors.some(s =>
      s === 'Tous secteurs' ||
      s.toLowerCase().includes(company.sector.toLowerCase()) ||
      company.sector.toLowerCase().includes(s.toLowerCase())
    );
    return matchesSearch && matchesFamily && matchesSector;
  });

  const handleConfirmSaveCatalogRisk = async () => {
    if (!selectedCatalogItem) return;
    const contractToUse = selectedContractId || contracts[0]?.id;
    if (!contractToUse) {
      alert("Veuillez d'abord créer au moins un contrat d'assurance.");
      return;
    }

    setIsSaving(true);
    try {
      await onSaveCatalogRisk(selectedCatalogItem, contractToUse);
      setSaveSuccessMsg(`Risque "${selectedCatalogItem.title}" enregistré avec succès !`);
      setTimeout(() => {
        setSaveSuccessMsg('');
        setSelectedCatalogItem(null);
      }, 1200);
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'enregistrement du risque");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des Risques</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {company.sector}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Identifier, enregistrer et évaluer les risques selon ISO 31000
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddRisk}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un risque sur mesure</span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 border shadow-2xs">
        <button
          onClick={() => setActiveView('registered')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeView === 'registered'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Risques de {company.name} ({risks.length})</span>
        </button>

        <button
          onClick={() => setActiveView('catalog')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeView === 'catalog'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Catalogue sectoriel ({filteredCatalog.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher un risque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 text-slate-700 focus:outline-none font-medium"
          >
            {families.map(f => (
              <option key={f} value={f}>
                {f === 'All' ? 'Toutes familles' : f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW: REGISTERED RISKS */}
      {activeView === 'registered' && (
        <div className="space-y-8">
          {/* SECTION A: RISQUES OBLIGATOIRES / CRITIQUES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider">
                RISQUES OBLIGATOIRES / CRITIQUES ({filteredMandatory.length})
              </h3>
            </div>

            {filteredMandatory.length === 0 ? (
              <div className="p-6 bg-red-50 border border-dashed border-red-200 rounded-2xl text-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-xs text-red-600 font-medium">
                  Aucun risque obligatoire identifié pour le secteur {company.sector}
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredMandatory.map(risk => (
                  <div key={risk.id} className="bg-white p-4 rounded-xl border-2 border-red-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                            OBLIGATOIRE
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{risk.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{risk.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-100">{risk.family}</span>
                          <span>Probabilité: {risk.initialProbability}/4</span>
                          <span>Impact: {risk.initialImpact}/4</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenAddMeasureForRisk(risk.id)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Ajouter une mesure"
                        >
                          <ShieldPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRisk(risk.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION B: RISQUES IDENTIFIÉS POUR L'ENTREPRISE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                RISQUES IDENTIFIÉS POUR {company.name.toUpperCase()} ({filteredIdentified.length})
              </h3>
            </div>

            {filteredIdentified.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">
                  Aucun risque identifié pour cette entreprise
                </p>
                <button
                  onClick={() => setActiveView('catalog')}
                  className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
                >
                  Explorer le catalogue sectoriel →
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredIdentified.map(risk => (
                  <div key={risk.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 mb-1">{risk.title}</h4>
                        <p className="text-xs text-slate-600 mb-2">{risk.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-100">{risk.family}</span>
                          <span>Probabilité: {risk.initialProbability}/4</span>
                          <span>Impact: {risk.initialImpact}/4</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenAddMeasureForRisk(risk.id)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Ajouter une mesure"
                        >
                          <ShieldPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRisk(risk.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: CATALOG */}
      {activeView === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wider">
              CATALOGUE COMPLET DES RISQUES DU SECTEUR ({filteredCatalog.length})
            </h3>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <p className="text-xs text-purple-800">
              Ce catalogue contient tous les risques applicables au secteur <strong>{company.sector}</strong>.
              Sélectionnez un risque pour l'ajouter à l'entreprise.
            </p>
          </div>

          <div className="grid gap-3">
            {filteredCatalog.map(item => {
              const isAlreadyRegistered = risks.some(r => r.title === item.title);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAlreadyRegistered
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {item.isMandatoryByLaw && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                            OBLIGATOIRE
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{item.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-100">{item.family}</span>
                        <span>Probabilité: {item.defaultProbability}/4</span>
                        <span>Impact: {item.defaultImpact}/4</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAlreadyRegistered ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Déjà enregistré</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedCatalogItem(item);
                            if (contracts.length > 0) setSelectedContractId(contracts[0].id);
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Ajouter</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal for saving catalog risk */}
      {selectedCatalogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Ajouter ce risque</h3>
              <button
                onClick={() => setSelectedCatalogItem(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl mb-4">
              <h4 className="font-bold text-sm text-purple-900">{selectedCatalogItem.title}</h4>
              <p className="text-xs text-purple-700 mt-1">{selectedCatalogItem.description}</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Associer à un contrat d'assurance
              </label>
              <select
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                className="w-full px-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.insurer} - {c.contractNumber}
                  </option>
                ))}
              </select>
            </div>

            {saveSuccessMsg && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs font-medium">
                {saveSuccessMsg}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedCatalogItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmSaveCatalogRisk}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                {isSaving ? 'Ajout...' : 'Ajouter à l\'entreprise'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RisksTabImproved;
export { RisksTabImproved as RisksTab };
