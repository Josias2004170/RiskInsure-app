import React, { useState } from 'react';
import { CompanyInfo } from '../types';
import { SECTOR_OPTIONS } from '../data/riskCatalog';

interface Props {
  currentCompany?: CompanyInfo | null;
  allCompanies?: CompanyInfo[];
  onRegisterCompany: (data: Partial<CompanyInfo>) => Promise<void>;
  onSwitchCompany: (name: string) => Promise<void>;
  onDone?: () => void;
}

export const AuthPage: React.FC<Props> = ({ currentCompany, allCompanies = [], onRegisterCompany, onSwitchCompany, onDone }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [personal, setPersonal] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [company, setCompany] = useState({ name: '', sector: SECTOR_OPTIONS[0], location: '', employees: '50', revenue: '5M €' });
  const [error, setError] = useState<string | null>(null);

  const next = () => setStep(s => Math.min(3, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  const handleRegister = async () => {
    setError(null);
    if (!personal.email || !personal.password || personal.password !== personal.confirm) {
      setError('Vérifiez les informations personnelles et la confirmation du mot de passe.');
      return;
    }
    if (!company.name) {
      setError('Le nom de l\'entreprise est requis.');
      return;
    }
    setLoading(true);
    try {
      await onRegisterCompany({
        name: company.name,
        sector: company.sector,
        location: company.location || 'Rabat, Maroc',
        employees: parseInt(company.employees) || 50,
        revenue: company.revenue || '5M €',
        admin: `${personal.firstName} ${personal.lastName}`
      });
      setLoading(false);
      if (onDone) onDone();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-slate-200">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Créer un compte / Se connecter</h1>
          <p className="text-sm text-slate-500">Inscrivez-vous en 3 étapes pour configurer votre entreprise et la cartographie des risques.</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-500 gap-4">
            <div className={`flex-1 text-center py-2 rounded ${step===1 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50'}`}>1. Informations</div>
            <div className={`flex-1 text-center py-2 rounded ${step===2 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50'}`}>2. Entreprise</div>
            <div className={`flex-1 text-center py-2 rounded ${step===3 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50'}`}>3. Confirmation</div>
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded mb-4">{error}</div>}

        {step === 1 && (
          <div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Prénom" className="p-2 border rounded" value={personal.firstName} onChange={e => setPersonal({ ...personal, firstName: e.target.value })} />
              <input placeholder="Nom" className="p-2 border rounded" value={personal.lastName} onChange={e => setPersonal({ ...personal, lastName: e.target.value })} />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <input placeholder="Email" className="p-2 border rounded" value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="password" placeholder="Mot de passe" className="p-2 border rounded" value={personal.password} onChange={e => setPersonal({ ...personal, password: e.target.value })} />
                <input type="password" placeholder="Confirmer" className="p-2 border rounded" value={personal.confirm} onChange={e => setPersonal({ ...personal, confirm: e.target.value })} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={next} className="px-4 py-2 rounded bg-blue-600 text-white">Suivant</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-2 text-sm font-semibold">Informations entreprise</div>
            <input placeholder="Nom de l'entreprise" className="w-full p-2 border rounded" value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <select value={company.sector} onChange={e => setCompany({ ...company, sector: e.target.value })} className="p-2 border rounded">
                {SECTOR_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input placeholder="Localisation" className="p-2 border rounded" value={company.location} onChange={e => setCompany({ ...company, location: e.target.value })} />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <input placeholder="Nombre d'employés" className="p-2 border rounded" value={company.employees} onChange={e => setCompany({ ...company, employees: e.target.value })} />
              <input placeholder="Chiffre d'affaires" className="p-2 border rounded" value={company.revenue} onChange={e => setCompany({ ...company, revenue: e.target.value })} />
              <input placeholder="Budget Assurance" className="p-2 border rounded" value={company.revenue} onChange={e => setCompany({ ...company, revenue: e.target.value })} />
            </div>

            <div className="mt-4 flex justify-between">
              <button onClick={prev} className="px-4 py-2 rounded border">Retour</button>
              <button onClick={next} className="px-4 py-2 rounded bg-blue-600 text-white">Suivant</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="p-4 bg-slate-50 rounded mb-3">
              <h4 className="font-bold">Récapitulatif</h4>
              <div className="text-sm text-slate-600 mt-2">
                <div><strong>Nom :</strong> {company.name}</div>
                <div><strong>Secteur :</strong> {company.sector}</div>
                <div><strong>Localisation :</strong> {company.location}</div>
                <div><strong>Responsable :</strong> {personal.firstName} {personal.lastName}</div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={prev} className="px-4 py-2 rounded border">Retour</button>
              <button onClick={handleRegister} disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white">{loading ? 'Création...' : 'Créer mon compte'}</button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t text-xs text-slate-500">
          <div className="mb-2">Déjà inscrit ?</div>
          <div className="space-y-2">
            {allCompanies.map(c => (
              <div key={c.name} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-slate-500">{c.sector} • {c.location}</div>
                </div>
                <button onClick={() => onSwitchCompany(c.name)} className="px-3 py-1 rounded bg-blue-600 text-white text-xs">Se connecter</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
