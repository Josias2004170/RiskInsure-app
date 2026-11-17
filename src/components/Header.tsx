import React from 'react';
import { Bell, Building2, LogOut, RefreshCw } from 'lucide-react';
import { CompanyInfo } from '../types';

interface HeaderProps {
  company: CompanyInfo;
  onLogout?: () => void;
  onChangeCompany?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ company, onLogout, onChangeCompany }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {company.name}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              {company.sector}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            📍 {company.location} • 👥 {company.employees} salariés
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Change Company Button */}
        {onChangeCompany && (
          <button
            onClick={onChangeCompany}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 font-bold text-xs transition-all shadow-2xs"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Changer d'entreprise</span>
            <span className="sm:hidden">Changer</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          id="btn-notifications"
          className="relative p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
            {company.admin.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-left hidden lg:block">
            <h3 className="text-xs font-bold text-slate-900 leading-none">
              {company.admin}
            </h3>
            <span className="text-[11px] font-medium text-slate-500">Administrator</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
