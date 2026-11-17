import React, { useState, useEffect } from 'react';
import { X, ShieldPlus, AlertCircle } from 'lucide-react';
import { Risk, Measure } from '../types';

interface AddMeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  risks: Risk[];
  selectedRiskId?: string;
  onSave: (payload: {
    riskId: string;
    title: string;
    description: string;
    responsible: string;
    date: string;
    type: 'Préventive' | 'Protectrice' | 'Corrective' | 'Organisationnelle';
    status: 'Planifiée' | 'En cours' | 'Mise en œuvre' | 'Suspendue';
    evaluation: {
      effectiveness: number;
      justification: string;
      beforeProbability: number;
      beforeImpact: number;
      afterProbability: number;
      afterImpact: number;
    };
  }) => Promise<void>;
}

export const AddMeasureModal: React.FC<AddMeasureModalProps> = ({
  isOpen,
  onClose,
  risks,
  selectedRiskId,
  onSave
}) => {
  const [riskId, setRiskId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [responsible, setResponsible] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<'Préventive' | 'Protectrice' | 'Corrective' | 'Organisationnelle'>('Préventive');
  const [status, setStatus] = useState<'Planifiée' | 'En cours' | 'Mise en œuvre' | 'Abandonnée'>('Planifiée');

  // Additional fields
  const [priority, setPriority] = useState<string>('Moyenne');
  const [deadline, setDeadline] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<string>('');
  const [expectedEffectiveness, setExpectedEffectiveness] = useState<number>(80);
  const [insurerMandatory, setInsurerMandatory] = useState<boolean>(false);

  // Evaluation Fields
  const [effectiveness, setEffectiveness] = useState<number>(75);
  const [justification, setJustification] = useState<string>('Évaluation de l\'efficacité des mesures préventives mises en place.');
  const [beforeProbability, setBeforeProbability] = useState<number>(3);
  const [beforeImpact, setBeforeImpact] = useState<number>(3);
  const [afterProbability, setAfterProbability] = useState<number>(2);
  const [afterImpact, setAfterImpact] = useState<number>(2);

  // Field error state - Requirement 3
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (selectedRiskId) {
        setRiskId(selectedRiskId);
      } else if (risks.length > 0) {
        setRiskId(risks[0].id);
      }
      setErrors({});
      setBackendError(null);
      setDate(new Date().toISOString().split('T')[0]);
      const deadlineDate = new Date();
      deadlineDate.setMonth(deadlineDate.getMonth() + 3);
      setDeadline(deadlineDate.toISOString().split('T')[0]);
    }
  }, [isOpen, selectedRiskId, risks]);

  // Adjust before/after values if risk is selected
  useEffect(() => {
    if (riskId) {
      const selected = risks.find(r => r.id === riskId);
      if (selected) {
        setBeforeProbability(selected.initialProbability);
        setBeforeImpact(selected.initialImpact);
        setAfterProbability(Math.max(1, selected.initialProbability - 1));
        setAfterImpact(Math.max(1, selected.initialImpact - 1));
      }
    }
  }, [riskId, risks]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    // Requirement 3: Client-side inline validation with exact messages
    const newErrors: Record<string, string> = {};

    if (!riskId.trim()) {
      newErrors.riskId = "Veuillez sélectionner un risque à associer";
    }
    if (!title.trim()) {
      newErrors.title = "Le titre est obligatoire";
    }
    if (!description.trim()) {
      newErrors.description = "La description est obligatoire";
    }
    if (!responsible.trim()) {
      newErrors.responsible = "Le responsable est obligatoire";
    }
    if (!date.trim()) {
      newErrors.date = "La date est obligatoire";
    }
    if (isNaN(effectiveness) || effectiveness < 0 || effectiveness > 100) {
      newErrors.effectiveness = "L'efficacité doit être comprise entre 0 et 100";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        riskId,
        title,
        description,
        responsible,
        date,
        type,
        status,
        priority,
        deadline,
        estimatedCost,
        expectedEffectiveness,
        insurerMandatory,
        evaluation: {
          effectiveness,
          justification: justification || "Évaluation standard",
          beforeProbability,
          beforeImpact,
          afterProbability,
          afterImpact
        }
      });

      // Clear fields & close
      setTitle('');
      setDescription('');
      setResponsible('');
      setDate('');
      setPriority('Moyenne');
      setDeadline('');
      setEstimatedCost('');
      setExpectedEffectiveness(80);
      setInsurerMandatory(false);
      onClose();
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement de la mesure :", err);
      if (err.fields) {
        setErrors(err.fields);
      }
      setBackendError(err.error || err.message || "Erreur serveur lors de la sauvegarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ajouter une mesure de gestion</h3>
              <p className="text-xs text-slate-500">
                Définir une mesure préventive ou protectrice et son évaluation d'efficacité
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {backendError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Erreur de sauvegarde :</p>
                <p>{backendError}</p>
              </div>
            </div>
          )}

          {/* Requirement 5: Risk association */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Risque couvert <span className="text-red-500">*</span>
            </label>
            <select
              id="measure-risk-select"
              value={riskId}
              onChange={(e) => setRiskId(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 ${
                errors.riskId ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            >
              <option value="">-- Sélectionner un risque --</option>
              {risks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.family})
                </option>
              ))}
            </select>
            {errors.riskId && <p className="text-xs text-red-600 mt-1">{errors.riskId}</p>}
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Titre de la mesure <span className="text-red-500">*</span>
            </label>
            <input
              id="measure-title"
              type="text"
              placeholder="Ex: Système automatique d'extinction incendie"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                errors.title ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
            {/* Requirement 3: Inline message */}
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="measure-description"
              rows={3}
              placeholder="Détails techniques, périmètre de mise en place..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                errors.description ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
              }`}
            />
            {/* Requirement 3: Inline message */}
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Responsible Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Responsable <span className="text-red-500">*</span>
              </label>
              <input
                id="measure-responsible"
                type="text"
                placeholder="Ex: Dr. Karim Alami"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.responsible ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                }`}
              />
              {/* Requirement 3: Inline message */}
              {errors.responsible && <p className="text-xs text-red-600 mt-1">{errors.responsible}</p>}
            </div>

            {/* Date Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date de mise en œuvre <span className="text-red-500">*</span>
              </label>
              <input
                id="measure-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.date ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                }`}
              />
              {/* Requirement 3: Inline message */}
              {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type de mesure
              </label>
              <select
                id="measure-type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="Préventive">Préventive</option>
                <option value="Protectrice">Protectrice</option>
                <option value="Corrective">Corrective</option>
                <option value="Organisationnelle">Organisationnelle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Statut
              </label>
              <select
                id="measure-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="Planifiée">Planifiée</option>
                <option value="En cours">En cours</option>
                <option value="Mise en œuvre">Mise en œuvre</option>
                <option value="Abandonnée">Abandonnée</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="Basse">Basse</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Haute">Haute</option>
                <option value="Critique">Critique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Échéance
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Coût estimé (€)
            </label>
            <input
              type="text"
              placeholder="Ex: 5000"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Efficacité attendue (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={expectedEffectiveness}
                onChange={(e) => setExpectedEffectiveness(Number(e.target.value))}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-bold text-blue-600 w-12 text-right">{expectedEffectiveness}%</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <input
              type="checkbox"
              id="insurer-mandatory"
              checked={insurerMandatory}
              onChange={(e) => setInsurerMandatory(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
            />
            <label htmlFor="insurer-mandatory" className="text-sm text-amber-900 font-medium cursor-pointer">
              Mesure obligatoire imposée par l'assureur
            </label>
          </div>

          {/* Requirement 6: Évaluation d'efficacité section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 mt-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Évaluation d'efficacité (0 à 100 %)
            </h4>

            {/* Effectiveness slider/input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Taux d'efficacité (%) <span className="text-red-500">*</span>
                </label>
                <span className="text-sm font-bold text-blue-600">{effectiveness}%</span>
              </div>
              <input
                id="measure-effectiveness"
                type="number"
                min={0}
                max={100}
                value={effectiveness}
                onChange={(e) => setEffectiveness(Number(e.target.value))}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 ${
                  errors.effectiveness ? 'border-red-300 ring-red-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                }`}
              />
              {/* Requirement 3: Inline message */}
              {errors.effectiveness && <p className="text-xs text-red-600 mt-1">{errors.effectiveness}</p>}
            </div>

            {/* Justification */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Justification / Observations
              </label>
              <input
                id="measure-justification"
                type="text"
                placeholder="Ex: Audit de conformité validé"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            {/* Residual Prob & Impact comparison */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                  Probabilité résiduelle (1-4)
                </label>
                <select
                  value={afterProbability}
                  onChange={(e) => setAfterProbability(Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-xs border border-slate-300 rounded-md font-semibold text-slate-800"
                >
                  <option value={1}>1 - Faible</option>
                  <option value={2}>2 - Modéré</option>
                  <option value={3}>3 - Élevé</option>
                  <option value={4}>4 - Critique</option>
                </select>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                  Impact résiduel (1-4)
                </label>
                <select
                  value={afterImpact}
                  onChange={(e) => setAfterImpact(Number(e.target.value))}
                  className="w-full mt-1 px-2 py-1 text-xs border border-slate-300 rounded-md font-semibold text-slate-800"
                >
                  <option value={1}>1 - Faible</option>
                  <option value={2}>2 - Modéré</option>
                  <option value={3}>3 - Élevé</option>
                  <option value={4}>4 - Critique</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              id="btn-save-measure"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
