import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, AlertCircle } from 'lucide-react';
import { Contract, Risk } from '../types';

interface AddRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  contracts: Contract[];
  selectedContractId?: string;
  onSave: (payload: Partial<Risk>) => Promise<void>;
}

export const AddRiskModal: React.FC<AddRiskModalProps> = ({
  isOpen,
  onClose,
  contracts,
  selectedContractId,
  onSave
}) => {
  const [contractId, setContractId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [family, setFamily] = useState<string>('Risques opérationnels');
  const [isMandatory, setIsMandatory] = useState<boolean>(false);
  const [initialProbability, setInitialProbability] = useState<number>(3);
  const [initialImpact, setInitialImpact] = useState<number>(3);
  const [coveragePercentage, setCoveragePercentage] = useState<number>(100);

  // New fields for detailed risk profile
  const [causes, setCauses] = useState<string>('');
  const [consequences, setConsequences] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [responsible, setResponsible] = useState<string>('');
  const [identificationDate, setIdentificationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<string>('Identifié');
  const [existingMeasures, setExistingMeasures] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [treatment, setTreatment] = useState<string>('À analyser');
  const [coverageStatus, setCoverageStatus] = useState<string>('À analyser');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (selectedContractId) {
        setContractId(selectedContractId);
      } else if (contracts.length > 0) {
        setContractId(contracts[0].id);
      }
      setErrors({});
      setBackendError(null);
      setIdentificationDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, selectedContractId, contracts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    const newErrors: Record<string, string> = {};
    if (!contractId.trim()) {
      newErrors.contractId = "Le contrat d'assurance est obligatoire (contractId)";
    }
    if (!title.trim()) {
      newErrors.title = "Le titre du risque est obligatoire";
    }
    if (!description.trim()) {
      newErrors.description = "La description est obligatoire";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        contractId: contractId.trim() || undefined,
        title: title.trim(),
        description: description.trim(),
        family: family.trim(),
        isMandatory,
        initialProbability,
        initialImpact,
        coveragePercentage,
        causes: causes.trim(),
        consequences: consequences.trim(),
        department: department.trim(),
        responsible: responsible.trim(),
        identificationDate,
        status,
        existingMeasures: existingMeasures.trim(),
        comments: comments.trim(),
        treatment: treatment as any,
        coverageStatus: coverageStatus as any
      });

      setTitle('');
      setDescription('');
      setCauses('');
      setConsequences('');
      setDepartment('');
      setResponsible('');
      setExistingMeasures('');
      setComments('');
      setTreatment('À analyser');
      setCoverageStatus('À analyser');
      onClose();
    } catch (err: any) {
      console.error("Erreur lors de la création du risque :", err);
      if (err.fields) {
        setErrors(err.fields);
      }
      setBackendError(err.error || err.message || "Erreur lors de la sauvegarde du risque");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Créer un risque sur mesure</h3>
              <p className="text-xs text-slate-500">Définir un risque personnalisé pour l'entreprise</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
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

          {/* Contrat d'assurance associé (optionnel - risque peut être non couvert) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contrat d'assurance associé
            </label>
            <select
              id="risk-contract-select"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="">-- Aucun contrat (risque non couvert) --</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.type} ({c.insurer} - N° {c.contractNumber})
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Laissez vide si le risque n'est pas couvert par un contrat</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Intitulé du risque <span className="text-red-500">*</span>
            </label>
            <input
              id="risk-title"
              type="text"
              placeholder="Ex: Incendie du bâtiment central"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                errors.title ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="risk-description"
              rows={2}
              placeholder="Causes, conséquences potentielles..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                errors.description ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Famille de risque</label>
              <select
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="Risques humains">Risques humains</option>
                <option value="Risques opérationnels">Risques opérationnels</option>
                <option value="Risques financiers">Risques financiers</option>
                <option value="Risques juridiques et réglementaires">Risques juridiques et réglementaires</option>
                <option value="Risques technologiques / cyber">Risques technologiques / cyber</option>
                <option value="Risques matériels">Risques matériels</option>
                <option value="Risques environnementaux">Risques environnementaux</option>
                <option value="Risques stratégiques">Risques stratégiques</option>
                <option value="Risques fournisseurs / tiers">Risques fournisseurs / tiers</option>
                <option value="Risques de responsabilité">Risques de responsabilité</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isMandatory}
                  onChange={(e) => setIsMandatory(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                />
                <span>Risque légal / obligatoire</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Causes</label>
            <textarea
              rows={2}
              placeholder="Facteurs causaux potentiels..."
              value={causes}
              onChange={(e) => setCauses(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Conséquences potentielles</label>
            <textarea
              rows={2}
              placeholder="Impact potentiel sur l'organisation..."
              value={consequences}
              onChange={(e) => setConsequences(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Département concerné</label>
              <input
                type="text"
                placeholder="Ex: Production, IT, RH..."
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Responsable du risque</label>
              <input
                type="text"
                placeholder="Nom du responsable..."
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date d'identification</label>
              <input
                type="date"
                value={identificationDate}
                onChange={(e) => setIdentificationDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="Identifié">Identifié</option>
                <option value="En cours d'analyse">En cours d'analyse</option>
                <option value="Traitement en cours">Traitement en cours</option>
                <option value="Maîtrisé">Maîtrisé</option>
                <option value="Clôturé">Clôturé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mesures existantes</label>
            <textarea
              rows={2}
              placeholder="Mesures déjà en place..."
              value={existingMeasures}
              onChange={(e) => setExistingMeasures(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Commentaires</label>
            <textarea
              rows={2}
              placeholder="Remarques supplémentaires..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Probabilité initiale (1-5)</label>
              <select
                value={initialProbability}
                onChange={(e) => setInitialProbability(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white font-semibold"
              >
                <option value={1}>1 - Très faible</option>
                <option value={2}>2 - Faible</option>
                <option value={3}>3 - Modéré</option>
                <option value={4}>4 - Élevé</option>
                <option value={5}>5 - Très élevé</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Impact initial (1-5)</label>
              <select
                value={initialImpact}
                onChange={(e) => setInitialImpact(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white font-semibold"
              >
                <option value={1}>1 - Très faible</option>
                <option value={2}>2 - Faible</option>
                <option value={3}>3 - Modéré</option>
                <option value={4}>4 - Élevé</option>
                <option value={5}>5 - Très élevé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Traitement du risque</label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="À analyser">À analyser</option>
                <option value="Éviter">Éviter</option>
                <option value="Réduire">Réduire</option>
                <option value="Transférer / Assurer">Transférer / Assurer</option>
                <option value="Accepter">Accepter</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Couverture d'assurance</label>
              <select
                value={coverageStatus}
                onChange={(e) => setCoverageStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="À analyser">À analyser</option>
                <option value="Couvert">Couvert</option>
                <option value="Partiellement couvert">Partiellement couvert</option>
                <option value="Non couvert">Non couvert</option>
              </select>
            </div>
          </div>



          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              id="btn-save-risk"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Enregistrement...' : 'Créer le risque sur mesure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
