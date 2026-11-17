import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Calendar,
  Trash2,
  AlertTriangle,
  FileText,
  X,
  Check,
  Eye,
  Info
} from 'lucide-react';
import { Contract, Risk } from '../types';
import { attachConditionsToContracts } from '../data/contractConditions';
import { ContractWithConditions } from '../data/contractConditions';

interface ContractsTabProps {
  contracts: Contract[];
  risks: Risk[];
  onOpenAddContract: () => void;
  onDeleteContract: (id: string) => void;
}

export const ContractsTab: React.FC<ContractsTabProps> = ({
  contracts,
  risks,
  onOpenAddContract,
  onDeleteContract
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  const [contractToView, setContractToView] = useState<ContractWithConditions | null>(null);

  const filteredContracts = contracts.filter(c =>
    c.insurer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmDelete = () => {
    if (contractToDelete) {
      onDeleteContract(contractToDelete.id);
      setContractToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Portefeuille de contrats d'assurance</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Gestion des polices d'assurance souscrites, garanties associées et suivi des échéances
          </p>
        </div>

        <button
          id="btn-add-contract-top"
          onClick={onOpenAddContract}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajouter un contrat</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par assureur, numéro de police ou type de contrat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium"
          />
        </div>
      </div>

      {/* Contracts Grid */}
      {filteredContracts.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Aucun contrat d'assurance enregistré</p>
          <button
            onClick={onOpenAddContract}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un contrat</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContracts.map((contract) => {
            const associatedRisks = risks.filter(r => r.contractId === contract.id);
            return (
              <div
                key={contract.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      {contract.type}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {contract.status}
                      </span>

                      {/* View Details Button */}
                      <button
                        onClick={() => {
                          const contractsWithConditions = attachConditionsToContracts([contract]);
                          setContractToView(contractsWithConditions[0]);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 font-semibold text-xs"
                        title="Voir les détails du contrat"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setContractToDelete(contract)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 font-semibold text-xs"
                        title="Supprimer ce contrat"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mt-3 group-hover:text-blue-600 transition-colors">
                    {contract.insurer}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    N° Police : <span className="font-semibold text-slate-800">{contract.contractNumber}</span>
                  </p>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prime annuelle :</span>
                      <span className="font-extrabold text-slate-900">€{contract.premium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Plafond garantie :</span>
                      <span className="font-bold text-blue-700">€{contract.coverageLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Franchise :</span>
                      <span className="font-semibold text-slate-700">€{contract.deductible.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Du {contract.startDate} au {contract.endDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-400">Risques couverts :</span>
                    <span className="font-bold text-slate-800">
                      {associatedRisks.length} risque(s)
                    </span>
                  </div>

                  {/* View Details Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const contractsWithConditions = attachConditionsToContracts([contract]);
                        setContractToView(contractsWithConditions[0]);
                      }}
                      className="w-full py-1.5 px-3 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Voir les détails</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRMATION DELETE MODAL */}
      {contractToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Supprimer le contrat d'assurance ?</h3>
                <p className="text-xs text-slate-500">Action irréversible sur votre portefeuille</p>
              </div>
            </div>

            <div className="p-3 bg-red-50/80 rounded-xl border border-red-100 text-xs text-red-800 space-y-1">
              <p className="font-bold">{contractToDelete.insurer} — {contractToDelete.contractNumber}</p>
              <p className="text-[11px]">
                La suppression de ce contrat désassociera la couverture d'assurance des risques qui y étaient rattachés.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setContractToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmer la suppression</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTRACT DETAILS MODAL */}
      {contractToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{contractToView.insurer} - {contractToView.contractNumber}</h3>
                <p className="text-xs text-blue-100 mt-1">{contractToView.type}</p>
              </div>
              <button onClick={() => setContractToView(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Conditions principales */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Conditions principales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium mb-1">Objet du contrat</div>
                    <div className="text-xs font-semibold text-slate-800">{contractToView.conditions.object}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium mb-1">Statut</div>
                    <div className="text-xs font-semibold text-slate-800">{contractToView.status}</div>
                  </div>
                </div>
              </div>

              {/* Garanties */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Garanties
                </h4>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <ul className="space-y-1">
                    {contractToView.conditions.guarantees.map((guarantee, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{guarantee}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Obligations */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  Obligations de l'assuré
                </h4>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <ul className="space-y-1">
                    {contractToView.conditions.obligations.map((obligation, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <Check className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
                        <span>{obligation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Exclusions */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Exclusions
                </h4>
                <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <ul className="space-y-1">
                    {contractToView.conditions.exclusions.map((exclusion, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <X className="w-3 h-3 text-red-600 mt-0.5 shrink-0" />
                        <span>{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Détails opérationnels */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3">Détails opérationnels</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium mb-1">Procédure sinistre</div>
                    <div className="text-xs text-slate-800">{contractToView.conditions.claimProcedure}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium mb-1">Préavis</div>
                    <div className="text-xs font-semibold text-slate-800">{contractToView.conditions.noticePeriodDays} jours</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium mb-1">Territoire</div>
                    <div className="text-xs text-slate-800">{contractToView.conditions.territory}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium mb-1">Durée</div>
                    <div className="text-xs font-semibold text-slate-800">{contractToView.conditions.durationMonths} mois</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium mb-1">Franchise</div>
                    <div className="text-xs text-slate-800">{contractToView.conditions.deductible}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium mb-1">Subrogation</div>
                    <div className="text-xs font-semibold text-slate-800">{contractToView.conditions.subrogation ? 'Oui' : 'Non'}</div>
                  </div>
                </div>
              </div>

              {/* Ventilation de la prime */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3">Ventilation de la prime</h4>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Base</div>
                      <div className="font-bold text-slate-900">€{contractToView.premiumBreakdown.basePremium.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Taxes</div>
                      <div className="font-bold text-slate-900">€{contractToView.premiumBreakdown.taxes.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Frais</div>
                      <div className="font-bold text-slate-900">€{contractToView.premiumBreakdown.fees.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">Autres/Discounts</div>
                      <div className="font-bold text-slate-900">€{contractToView.premiumBreakdown.discounts.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setContractToView(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
