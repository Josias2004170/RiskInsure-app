import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import { Claim, Contract, Risk } from '../types';

interface ClaimsTabProps {
  claims: Claim[];
  contracts: Contract[];
  risks: Risk[];
  onOpenAddClaim: () => void;
  onDeleteClaim: (id: string) => void;
}

export const ClaimsTab: React.FC<ClaimsTabProps> = ({
  claims,
  contracts,
  risks,
  onOpenAddClaim,
  onDeleteClaim
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const contractMap = new Map<string, Contract>();
  contracts.forEach(c => contractMap.set(c.id, c));

  const filteredClaims = claims.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.claimNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEstimated = claims.reduce((sum, c) => sum + c.estimatedCost, 0);
  const totalPaid = claims.reduce((sum, c) => sum + c.paidAmount, 0);
  const pendingCount = claims.filter(c => c.status === 'En cours d\'expertise' || c.status === 'Déclaré').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Suivi des Sinistres</h2>
          <p className="text-xs text-slate-500 font-medium">
            Déclaration, suivi d'expertise et indemnisations par les compagnies d'assurance
          </p>
        </div>
        <button
          onClick={onOpenAddClaim}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Déclarer un sinistre</span>
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Sinistres Déclarés</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{claims.length} dossiers</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Montant Estimé Total</span>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">€{totalEstimated.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Montant Indemnisé Réglé</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">€{totalPaid.toLocaleString()}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher un sinistre par titre ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </div>

      {/* Claims List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">Dossier</th>
              <th className="p-4">Contrat Support</th>
              <th className="p-4">Date Survenance</th>
              <th className="p-4">Estimation</th>
              <th className="p-4">Reglé</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClaims.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                  Aucun sinistre répertorié.
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim) => {
                const contract = contractMap.get(claim.contractId);
                return (
                  <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{claim.title}</p>
                      <p className="text-[11px] text-slate-400">N° {claim.claimNumber}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {contract ? `${contract.insurer} (${contract.type})` : 'N/A'}
                    </td>
                    <td className="p-4 text-slate-600">{claim.dateOfLoss}</td>
                    <td className="p-4 font-extrabold text-slate-900">
                      €{claim.estimatedCost.toLocaleString()}
                    </td>
                    <td className="p-4 font-extrabold text-emerald-600">
                      €{claim.paidAmount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          claim.status === 'Indemnisé'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'En cours d\'expertise'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onDeleteClaim(claim.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Supprimer le dossier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
