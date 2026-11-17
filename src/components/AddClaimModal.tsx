import React, { useState } from 'react';
import { X, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Contract, Risk, Claim } from '../types';

interface AddClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: Contract[];
  risks: Risk[];
  onSave: (payload: Partial<Claim>) => Promise<void>;
}

export const AddClaimModal: React.FC<AddClaimModalProps> = ({
  isOpen,
  onClose,
  contracts,
  risks,
  onSave
}) => {
  const [contractId, setContractId] = useState<string>('');
  const [riskId, setRiskId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [claimNumber, setClaimNumber] = useState<string>(`SIN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [dateOfLoss, setDateOfLoss] = useState<string>(new Date().toISOString().split('T')[0]);
  const [estimatedCost, setEstimatedCost] = useState<number>(15000);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [status, setStatus] = useState<'Déclaré' | 'En cours d\'expertise' | 'Indemnisé' | 'Clôturé'>('Déclaré');
  const [description, setDescription] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    const newErrors: Record<string, string> = {};
    if (!contractId.trim()) newErrors.contractId = "Le contrat associé est obligatoire";
    if (!title.trim()) newErrors.title = "Le titre du sinistre est obligatoire";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await onSave({
        contractId,
        riskId: riskId || undefined,
        claimNumber,
        title,
        dateOfLoss,
        estimatedCost: Number(estimatedCost),
        paidAmount: Number(paidAmount),
        status,
        description
      });

      setTitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setBackendError(err.error || err.message || "Erreur de création de sinistre");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Déclarer un sinistre</h3>
              <p className="text-xs text-slate-500">Ouverture d'un dossier d'indemnisation d'assurance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {backendError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{backendError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contrat support <span className="text-red-500">*</span>
            </label>
            <select
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="">-- Sélectionner un contrat --</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.type} ({c.insurer})
                </option>
              ))}
            </select>
            {errors.contractId && <p className="text-xs text-red-600 mt-1">{errors.contractId}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Intitulé du sinistre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Dommage matériel I.R.M suite surtension"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date du survenance</label>
              <input
                type="date"
                value={dateOfLoss}
                onChange={(e) => setDateOfLoss(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Coût estimé (€)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="Déclaré">Déclaré</option>
              <option value="En cours d'expertise">En cours d'expertise</option>
              <option value="Indemnisé">Indemnisé</option>
              <option value="Clôturé">Clôturé</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              placeholder="Explications des dégâts constatés..."
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md"
            >
              {isSubmitting ? 'Enregistrement...' : 'Déclarer le sinistre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
