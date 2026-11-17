import React from 'react';
import { Contract } from '../types';
import { attachConditionsToContract } from '../data/contractConditions';
import { X } from 'lucide-react';

interface Props {
  contract: Contract;
  onClose: () => void;
}

export const ContractDetails: React.FC<Props> = ({ contract, onClose }) => {
  const c = attachConditionsToContract(contract);

  const exportPDF = () => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Résumé contrat - ${c.contractNumber}</title>
          <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px} h1{font-size:18px} table{width:100%;border-collapse:collapse} th,td{padding:8px;border:1px solid #ddd;text-align:left} th{background:#f4f4f6}</style>
        </head>
        <body>
          <h1>${c.insurer} — ${c.contractNumber}</h1>
          <p>Type: ${c.type} • Statut: ${c.status}</p>
          <h2>Conditions principales</h2>
          <p>${c.conditions.coverageScope}</p>
          <h3>Exclusions</h3>
          <ul>${c.conditions.exclusions.map(e => `<li>${e}</li>`).join('')}</ul>
          <h3>Procédure sinistre</h3>
          <p>${c.conditions.claimProcedure}</p>
          <h3>Ventilation de la prime</h3>
          <table>
            <thead><tr><th>Élément</th><th>Montant (€)</th></tr></thead>
            <tbody>
              <tr><td>Base</td><td>${c.premiumBreakdown.basePremium}</td></tr>
              <tr><td>Taxes</td><td>${c.premiumBreakdown.taxes}</td></tr>
              <tr><td>Frais</td><td>${c.premiumBreakdown.fees}</td></tr>
              <tr><td>Autres / Discounts</td><td>${c.premiumBreakdown.discounts}</td></tr>
              <tr><th>Total</th><th>${c.premiumBreakdown.total}</th></tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (!w) return alert('Impossible d\'ouvrir la fenêtre d\'impression');
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-slate-500">Contrat</div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{c.insurer} — {c.contractNumber}</h3>
            <div className="text-[12px] text-slate-500">Type: {c.type} • Statut: {c.status}</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-md">
            <div className="font-semibold">Conditions principales</div>
            <p className="text-xs text-slate-600 mt-2">{c.conditions.coverageScope}</p>
            <div className="mt-2 text-xs">
              <div className="font-semibold">Exclusions</div>
              <ul className="list-disc ml-4 text-xs text-slate-600">
                {c.conditions.exclusions.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-md">
            <div className="font-semibold">Détails opérationnels</div>
            <div className="text-xs text-slate-600 mt-2">Procédure sinistre: {c.conditions.claimProcedure}</div>
            <div className="text-xs mt-1">Préavis: {c.conditions.noticePeriodDays} jours</div>
            <div className="text-xs mt-1">Territoire: {c.conditions.territory}</div>
            <div className="text-xs mt-1">Durée: {c.conditions.durationMonths} mois</div>
            <div className="text-xs mt-1">Subrogation: {c.conditions.subrogation ? 'Oui' : 'Non'}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="font-semibold text-sm">Ventilation de la prime</div>
          <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
            <div className="p-3 bg-white rounded-md border">Base: <div className="font-bold">€{c.premiumBreakdown.basePremium}</div></div>
            <div className="p-3 bg-white rounded-md border">Taxes: <div className="font-bold">€{c.premiumBreakdown.taxes}</div></div>
            <div className="p-3 bg-white rounded-md border">Frais: <div className="font-bold">€{c.premiumBreakdown.fees}</div></div>
            <div className="p-3 bg-white rounded-md border">Autres/Discounts: <div className="font-bold">€{c.premiumBreakdown.discounts}</div></div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t flex justify-end">
          <button onClick={exportPDF} className="mr-2 px-4 py-2 rounded-md bg-emerald-600 text-white text-sm">Exporter PDF</button>
          <button onClick={onClose} className="px-4 py-2 rounded-md border text-sm">Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
