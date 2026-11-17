import React from 'react';
import {
  LayoutDashboard,
  Compass,
  AlertTriangle,
  Map,
  ShieldAlert,
  ShieldCheck,
  FileSearch,
  FileText,
  Settings,
  ChevronLeft,
  LogOut,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';

export type NavigationTab =
  | 'overview'
  | 'panorama'
  | 'risks'
  | 'mapping'
  | 'measures'
  | 'contracts'
  | 'create-contract'
  | 'scan'
  | 'claims'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onResetData?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onResetData }) => {
  const navItems = [
    { id: 'overview' as NavigationTab, label: 'Aperçu', icon: LayoutDashboard },
    { id: 'panorama' as NavigationTab, label: 'Panorama', icon: Compass },
    { id: 'risks' as NavigationTab, label: 'Risques', icon: AlertTriangle },
    { id: 'mapping' as NavigationTab, label: 'Cartographie', icon: Map },
    { id: 'measures' as NavigationTab, label: 'Mesures préventives', icon: ShieldAlert },
    { id: 'contracts' as NavigationTab, label: 'Contrats', icon: ShieldCheck },
    { id: 'create-contract' as NavigationTab, label: 'Créer un contrat', icon: FileText },
    { id: 'scan' as NavigationTab, label: 'Numérisation / Scan', icon: FileSearch },
    { id: 'claims' as NavigationTab, label: 'Suivi des sinistres', icon: FileSpreadsheet },
    { id: 'reports' as NavigationTab, label: 'Rapports', icon: FileText },
    { id: 'settings' as NavigationTab, label: 'Paramètres', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
              RiskInsure
            </h1>
            <p className="text-xs text-slate-500 font-medium">Risk management</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        {onResetData && (
          <button
            onClick={onResetData}
            title="Réinitialiser les données de démonstration"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Réinitialiser Demo Data</span>
          </button>
        )}
        <button
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400" />
          <span>Reduce</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
