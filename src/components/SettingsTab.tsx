import React, { useState } from 'react';
import { Settings, Building, Save, Users, ShieldAlert, FileText, Bell, History, ChevronDown, ChevronRight } from 'lucide-react';
import { CompanyInfo } from '../types';

interface SettingsTabProps {
  company: CompanyInfo;
  onUpdateCompany: (company: Partial<CompanyInfo>) => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ company, onUpdateCompany }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'users' | 'risk' | 'insurance' | 'notifications' | 'audit'>('profile');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Paramètres</h2>
        <p className="text-xs text-slate-500 font-medium">Centre d'administration de RiskInsure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeSection === 'profile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Profil entreprise</span>
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeSection === 'users'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Utilisateurs</span>
          </button>
          <button
            onClick={() => setActiveSection('risk')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeSection === 'risk'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Risk Management</span>
          </button>
          <button
            onClick={() => setActiveSection('insurance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeSection === 'insurance'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Assurance</span>
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeSection === 'notifications'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => setActiveSection('audit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeSection === 'audit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && <CompanyProfileSection company={company} onUpdateCompany={onUpdateCompany} />}
          {activeSection === 'users' && <UsersSection />}
          {activeSection === 'risk' && <RiskManagementSection expandedSections={expandedSections} toggleSection={toggleSection} />}
          {activeSection === 'insurance' && <InsuranceSection expandedSections={expandedSections} toggleSection={toggleSection} />}
          {activeSection === 'notifications' && <NotificationsSection />}
          {activeSection === 'audit' && <AuditSection />}
        </div>
      </div>
    </div>
  );
};

// Company Profile Section
const CompanyProfileSection: React.FC<{ company: CompanyInfo; onUpdateCompany: (company: Partial<CompanyInfo>) => Promise<void> }> = ({ company, onUpdateCompany }) => {
  const [name, setName] = useState(company.name);
  const [sector, setSector] = useState(company.sector);
  const [location, setLocation] = useState(company.location);
  const [employees, setEmployees] = useState(company.employees);
  const [revenue, setRevenue] = useState(company.revenue);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage(false);
    try {
      await onUpdateCompany({ name, sector, location, employees: Number(employees), revenue });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Building className="w-5 h-5 text-blue-600" />
        Profil de l'entreprise
      </h3>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold mb-4">
          Modifications enregistrées avec succès.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Raison sociale</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Secteur d'activité</label>
            <input type="text" value={sector} onChange={(e) => setSector(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de salariés</label>
            <input type="number" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Chiffre d'affaires</label>
          <input type="text" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md">
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// Users Section
const UsersSection: React.FC = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <Users className="w-5 h-5 text-blue-600" />
      Utilisateurs et accès
    </h3>
    <div className="space-y-4">
      <div className="p-4 bg-slate-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-900">ARZ Assureur Conseil</span>
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Administrator</span>
        </div>
        <p className="text-xs text-slate-600">admin@riskinsure.com</p>
      </div>
      <button className="w-full px-4 py-2 rounded-xl border border-dashed border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50">
        + Ajouter un utilisateur
      </button>
    </div>
  </div>
);

// Risk Management Section
const RiskManagementSection: React.FC<{ expandedSections: Record<string, boolean>; toggleSection: (section: string) => void }> = ({ expandedSections, toggleSection }) => (
  <div className="space-y-4">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <button onClick={() => toggleSection('risk-params')} className="w-full flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-600" />
          Paramètres Risk Management
        </h3>
        {expandedSections['risk-params'] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {expandedSections['risk-params'] && (
        <div className="mt-4 space-y-4 pt-4 border-t border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Échelle de probabilité</label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm">
              <option>1-5 (Très faible à Très élevé)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Échelle d'impact</label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm">
              <option>1-5 (Très faible à Très élevé)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Seuils de criticité</label>
            <input type="text" placeholder="Faible: 1-4, Modéré: 5-9, ..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>
        </div>
      )}
    </div>

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <button onClick={() => toggleSection('risk-catalog')} className="w-full flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Référentiel des risques</h3>
        {expandedSections['risk-catalog'] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {expandedSections['risk-catalog'] && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Gérer le catalogue de risques par secteur d'activité</p>
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium">Consulter le catalogue</button>
        </div>
      )}
    </div>
  </div>
);

// Insurance Section
const InsuranceSection: React.FC<{ expandedSections: Record<string, boolean>; toggleSection: (section: string) => void }> = ({ expandedSections, toggleSection }) => (
  <div className="space-y-4">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <button onClick={() => toggleSection('insurance-params')} className="w-full flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Paramètres Assurance
        </h3>
        {expandedSections['insurance-params'] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {expandedSections['insurance-params'] && (
        <div className="mt-4 space-y-4 pt-4 border-t border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Types de contrats</label>
            <input type="text" placeholder="Dommages aux biens, RC, Cyber..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assureurs partenaires</label>
            <input type="text" placeholder="AXA, Allianz, Zurich..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alertes de renouvellement (jours)</label>
            <input type="number" defaultValue={30} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>
        </div>
      )}
    </div>
  </div>
);

// Notifications Section
const NotificationsSection: React.FC = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <Bell className="w-5 h-5 text-blue-600" />
      Notifications et alertes
    </h3>
    <div className="space-y-3">
      {[
        'Contrat arrivant à expiration',
        'Mesure préventive en retard',
        'Risque critique sans mesure',
        'Risque critique non assuré',
        'Nouveau sinistre déclaré',
        'Réévaluation de risque nécessaire'
      ].map((alert, index) => (
        <label key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
          <input type="checkbox" defaultChecked={index < 3} className="w-4 h-4 text-blue-600 rounded" />
          <span className="text-sm text-slate-700">{alert}</span>
        </label>
      ))}
    </div>
  </div>
);

// Audit Section
const AuditSection: React.FC = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
      <History className="w-5 h-5 text-blue-600" />
      Audit et historique
    </h3>
    <div className="space-y-3">
      <div className="p-3 bg-slate-50 rounded-xl text-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-900">Création d'un risque</span>
          <span className="text-xs text-slate-500">2026-11-01 14:30</span>
        </div>
        <p className="text-xs text-slate-600">Utilisateur: admin</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl text-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-900">Modification d'un contrat</span>
          <span className="text-xs text-slate-500">2026-11-01 12:15</span>
        </div>
        <p className="text-xs text-slate-600">Utilisateur: admin</p>
      </div>
    </div>
  </div>
);
