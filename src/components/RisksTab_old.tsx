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
  Check
} from 'lucide-react';
import { Risk, Contract, Measure, CompanyInfo } from '../types';
import { MASTER_RISK_CATALOG, CatalogRiskItem, SECTOR_OPTIONS } from '../data/riskCatalog';

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

export const RisksTab: React.FC<RisksTabProps> = ({
  company,
  risks,
  contracts,
  measures,
  onOpenAddRisk,
  onOpenAddMeasureForRisk,
  onDeleteRisk,
  onSaveCatalogRisk
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'registered' | 'catalog'>('registered');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('Tous');

  // Modal for selecting contract when saving a risk from catalog
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogRiskItem | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
  const [highlightedCatalogId, setHighlightedCatalogId] = useState<string | null>(null);

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

  // Registered risks filtering
  const filteredRegisteredRisks = risks.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = selectedFamily === 'All' || r.family === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  // Catalog filtering
  const filteredCatalog = MASTER_RISK_CATALOG.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = selectedFamily === 'All' || item.family === selectedFamily;
    const matchesSector =
      selectedSectorFilter === 'Tous' ||
      item.applicableSectors.includes('Tous secteurs') ||
      item.applicableSectors.some(s => s.toLowerCase().includes(selectedSectorFilter.toLowerCase()));
    return matchesSearch && matchesFamily && matchesSector;
  });

  const mandatoryRisks = filteredRegisteredRisks.filter(r => r.isMandatory);
  const availableRisks = filteredRegisteredRisks.filter(r => !r.isMandatory);

  const handleOpenRegisterModal = (item: CatalogRiskItem) => {
    setSelectedCatalogItem(item);
    if (contracts.length > 0) {
      setSelectedContractId(contracts[0].id);
    }
  };

  const handleConfirmSaveCatalogRisk = async () => {
    if (!selectedCatalogItem) return;
    if (!selectedContractId && contracts.length > 0) {
      setSelectedContractId(contracts[0].id);
    }

    const contractToUse = selectedContractId || contracts[0]?.id;
    if (!contractToUse) {
      alert("Veuillez d'abord créer au moins un contrat d'assurance pour rattacher le risque.");
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
            Identifier, enregistrer et évaluer les risques d'entreprise selon la norme ISO 31000
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-risk-top"
            onClick={onOpenAddRisk}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un risque sur mesure</span>
          </button>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 border shadow-2xs">
        <button
          onClick={() => setActiveSubTab('registered')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'registered'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Risques Enregistrés pour {company.name} ({risks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'catalog'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>Catalogue complet & Risques du Secteur ({MASTER_RISK_CATALOG.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={
              activeSubTab === 'registered'
                ? "Rechercher parmi les risques enregistrés..."
                : "Rechercher dans le catalogue complet des risques..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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

          {activeSubTab === 'catalog' && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedSectorFilter}
                onChange={(e) => setSelectedSectorFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 text-slate-700 focus:outline-none font-medium"
              >
                <option value="Tous">Tous les secteurs</option>
                {SECTOR_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: REGISTERED RISKS */}
      {activeSubTab === 'registered' && (
        <div className="space-y-6">
          {/* Section 1: Mandatory Risks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Risques obligatoires ({mandatoryRisks.length})</span>
            </div>

            {mandatoryRisks.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                Aucun risque obligatoire actuellement répertorié.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mandatoryRisks.map(r => (
                  <RiskCard
                    key={r.id}
                    risk={r}
                    contracts={contracts}
                    measures={measures}
                    onOpenAddMeasure={onOpenAddMeasureForRisk}
                    onDeleteRisk={onDeleteRisk}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Standard/Other Registered Risks */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Risques identifiés pour l'entreprise ({availableRisks.length})</span>
            </div>

            {availableRisks.length === 0 ? (
              <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                <p>Aucun autre risque enregistré pour le moment.</p>
                <button
                  onClick={() => setActiveSubTab('catalog')}
                  className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Parcourir le catalogue complet des risques</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRisks.map(r => (
                  <RiskCard
                    key={r.id}
                    risk={r}
                    contracts={contracts}
                    measures={measures}
                    onOpenAddMeasure={onOpenAddMeasureForRisk}
                    onDeleteRisk={onDeleteRisk}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: MASTER CATALOG OF ALL RISKS */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Catalogue Général des Risques d'Entreprise</h3>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Sélectionnez n'importe quel risque du catalogue et cliquez sur <strong>"Enregistrer ce risque"</strong> pour l'ajouter immédiatement à la cartographie de <strong>{company.name}</strong>.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-blue-200 border border-white/20 shrink-0">
              Secteur actif : {company.sector}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map(item => {
              const isAlreadyRegistered = risks.some(
                r => r.title.toLowerCase().trim() === item.title.toLowerCase().trim()
              );

              const isSectorRecommended = item.applicableSectors.some(
                s => s.toLowerCase().includes(company.sector.toLowerCase()) || s === 'Tous secteurs'
              );

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setHighlightedCatalogId(item.id);
                    setIsRelatedModalOpen(true);
                  }}
                  className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer ${
                    isSectorRecommended
                      ? 'border-blue-200 shadow-2xs hover:border-blue-400 hover:shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        {item.family}
                      </span>
                      {isSectorRecommended && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          <span>Recommandé</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mt-3 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Impact initial :</span>
                      <span className="font-bold text-slate-700">
                        P{item.defaultProbability} × I{item.defaultImpact} (Score: {item.defaultProbability * item.defaultImpact})
                      </span>
                    </div>

                    {isAlreadyRegistered ? (
                      <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Inscrit au registre</span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenRegisterModal(item); }}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                        <span>Enregistrer ce risque</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RELATED RISKS MODAL: shows risks related to company's sector */}
      {isRelatedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden">
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Risques liés au secteur : {company.sector}</h3>
                <p className="text-xs text-blue-100 mt-1">Cliquez sur "Enregistrer" pour ajouter un risque à votre cartographie.</p>
              </div>
              <button onClick={() => setIsRelatedModalOpen(false)} className="text-white/80 hover:text-white">Fermer</button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MASTER_RISK_CATALOG.filter(it =>
                it.applicableSectors.some(s => s === 'Tous secteurs' || s.toLowerCase().includes(company.sector.toLowerCase()))
              ).map(it => {
                const already = risks.some(r => r.title.toLowerCase().trim() === it.title.toLowerCase().trim());
                return (
                  <div key={it.id} className={`p-4 bg-slate-50 rounded-xl border ${highlightedCatalogId === it.id ? 'ring-2 ring-blue-200' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm">{it.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{it.description}</p>
                      </div>
                      <div className="ml-3 text-right text-xs">
                        <div className="text-[11px] text-slate-500">P{it.defaultProbability}×I{it.defaultImpact}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {already ? (
                        <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">Inscrit</div>
                      ) : (
                        <button
                          onClick={() => { setSelectedCatalogItem(it); setIsRelatedModalOpen(false); }}
                          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                        >
                          Enregistrer
                        </button>
                      )}
                      <button onClick={() => { setHighlightedCatalogId(it.id); }} className="text-xs text-slate-500 hover:text-slate-700">Voir</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL TO SELECT CONTRACT WHEN SAVING A CATALOG RISK */}
      {selectedCatalogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-blue-600 p-5 text-white flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base">Enregistrer le risque</h3>
                <p className="text-xs text-blue-100 mt-0.5">{selectedCatalogItem.title}</p>
              </div>
              <button
                onClick={() => setSelectedCatalogItem(null)}
                className="p-1 hover:bg-white/10 rounded-lg text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {saveSuccessMsg ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              ) : (
                <>
                  <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800">Détails du risque :</p>
                    <p>• <strong>Famille :</strong> {selectedCatalogItem.family}</p>
                    <p>• <strong>Description :</strong> {selectedCatalogItem.description}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Associer à un contrat d'assurance <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedContractId}
                      onChange={(e) => setSelectedContractId(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                    >
                      {contracts.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.insurer} — {c.type} ({c.contractNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCatalogItem(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleConfirmSaveCatalogRisk}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
                    >
                      {isSaving ? 'Enregistrement...' : 'Confirmer & Enregistrer'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface RiskCardProps {
  risk: Risk;
  contracts: Contract[];
  measures: Measure[];
  onOpenAddMeasure: (riskId: string) => void;
  onDeleteRisk: (riskId: string) => void;
}

const RiskCard: React.FC<RiskCardProps> = ({
  risk,
  contracts,
  measures,
  onOpenAddMeasure,
  onDeleteRisk
}) => {
  const contract = contracts.find(c => c.id === risk.contractId);
  const riskMeasures = measures.filter(m => m.riskId === risk.id);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
            {risk.family}
          </span>
          <div className="flex items-center gap-1">
            {risk.isMandatory && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                Mandatory
              </span>
            )}
            <button
              onClick={() => onDeleteRisk(risk.id)}
              className="p-1 text-slate-300 hover:text-red-600 rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Supprimer le risque"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-sm mt-3 group-hover:text-blue-600 transition-colors">
          {risk.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{risk.description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
        {/* Attached Contract Info */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Contrat d'assurance :</span>
          {contract ? (
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {contract.insurer}
            </span>
          ) : (
            <span className="font-bold text-red-500">Non couvert</span>
          )}
        </div>

        {/* Attached Measures Count */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Mesures de gestion :</span>
          <span className="font-semibold text-slate-700">{riskMeasures.length} mesure(s)</span>
        </div>

        <button
          id={`btn-add-measure-risk-${risk.id}`}
          onClick={() => onOpenAddMeasure(risk.id)}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <ShieldPlus className="w-3.5 h-3.5" />
          <span>Ajouter une mesure</span>
        </button>
      </div>
    </div>
  );
};
