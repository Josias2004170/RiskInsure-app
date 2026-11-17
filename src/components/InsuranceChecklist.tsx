import React, { useMemo, useState, useEffect } from 'react';
import { risks as catalogRisks, sectorDefaultCoverage } from '../data/insuranceCatalog';
import { Download, Printer } from 'lucide-react';
import { Risk, Contract } from '../types';

interface Props {
  appRisks: Risk[];
  contracts: Contract[];
  initialSector?: string;
  sector?: string;
  onSectorChange?: (s: string) => void;
}

const mapContractToFamilies = (type: string) => {
  const t = (type || '').toLowerCase();
  const covered: string[] = [];
  if (t.includes('sant') || t.includes('prev') || t.includes('prév')) covered.push('Personne civile');
  if (t.includes('dommag') || t.includes('biens') || t.includes('perte') || t.includes('bris') || t.includes('brise')) covered.push('Bien matériel');
  if (t.includes('responsabil') || t.includes('rc') || t.includes('d&o') || t.includes('direct')) covered.push('Responsabilité civile');
  if (t.includes('cyber')) covered.push('Responsabilité civile');
  if (t.includes('flotte') || t.includes('automobile') || t.includes('transport')) covered.push('Bien matériel');
  if (covered.length === 0) covered.push('Responsabilité civile');
  return covered as Array<'Responsabilité civile'|'Bien matériel'|'Personne civile'>;
};

const normalizeRiskFamily = (family: string) => {
  const f = (family || '').toLowerCase();
  if (f.includes('sant') || f.includes('personne') || f.includes('vie') || f.includes('accident')) return 'Personne civile';
  if (f.includes('dommag') || f.includes('bien') || f.includes('incendie') || f.includes('vol') || f.includes('bris') || f.includes('transport')) return 'Bien matériel';
  return 'Responsabilité civile';
};

export const InsuranceChecklist: React.FC<Props> = ({ appRisks, contracts, initialSector, sector: controlledSector, onSectorChange }) => {
  const sectors = useMemo(() => Object.keys(sectorDefaultCoverage), []);
  const [internalSector, setInternalSector] = useState<string>(initialSector || 'General');
  const sector = controlledSector || internalSector;

  useEffect(() => {
    if (initialSector && !controlledSector) setInternalSector(initialSector);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSector]);

  const setSector = (s: string) => {
    if (onSectorChange) onSectorChange(s);
    else setInternalSector(s);
  };

  const defaultCovered = useMemo(() => new Set(sectorDefaultCoverage[sector] || []), [sector]);

  // Catalog check state (by catalog id)
  const initialCatalogState = useMemo(() => {
    const map: Record<string, boolean> = {};
    catalogRisks.forEach((r) => { map[r.id] = defaultCovered.has(r.id); });
    return map;
  }, [defaultCovered]);
  const [catalogChecked, setCatalogChecked] = useState<Record<string, boolean>>(initialCatalogState);
  useEffect(() => setCatalogChecked(initialCatalogState), [initialCatalogState]);

  const toggleCatalog = (id: string) => setCatalogChecked(prev => ({ ...prev, [id]: !prev[id] }));

  // Company risks: determine coverage by contract link
  const isRiskCovered = (risk: Risk) => {
    const c = contracts.find(ct => ct.id === risk.contractId);
    if (!c || c.status !== 'Actif') return false;
    const coveredFamilies = mapContractToFamilies(c.type);
    const rFamily = normalizeRiskFamily(risk.family);
    return coveredFamilies.includes(rFamily);
  };

  const exportJSON = () => {
    const catalogData = catalogRisks.map(r => ({ id: r.id, title: r.title, covered: !!catalogChecked[r.id] }));
    const appData = appRisks.map(r => ({ id: r.id, title: r.title, covered: isRiskCovered(r), contractId: r.contractId }));
    const blob = new Blob([JSON.stringify({ sector, catalog: catalogData, company: appData }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `checklist_${sector}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const printChecklist = () => {
    const html = `
      <html>
        <head>
          <title>Checklist assurances - ${sector}</title>
          <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px} table{width:100%;border-collapse:collapse} th,td{padding:8px;border:1px solid #ddd;text-align:left} th{background:#f4f4f6}</style>
        </head>
        <body>
          <h2>Checklist assurances — ${sector}</h2>
          <h3>Risques enregistrés</h3>
          <table>
            <thead><tr><th>Risque</th><th>Famille</th><th>Couvert</th><th>Contrat</th></tr></thead>
            <tbody>
              ${appRisks.map(r => {
                const covered = isRiskCovered(r);
                const ct = contracts.find(c => c.id === r.contractId)?.insurer || '-';
                return `<tr><td>${r.title}</td><td>${r.family}</td><td>${covered ? 'Oui' : 'Non'}</td><td>${ct}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
          <h3>Catalogue standard</h3>
          <table>
            <thead><tr><th>Risque</th><th>Famille</th><th>Couvert (par défaut)</th></tr></thead>
            <tbody>
              ${catalogRisks.map(r => `<tr><td>${r.title}</td><td>${r.family}</td><td>${catalogChecked[r.id] ? 'Oui' : 'Non'}</td></tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const w = window.open('', '_blank'); if (!w) return alert('Impossible d\'ouvrir une nouvelle fenêtre pour l\'impression');
    w.document.write(html); w.document.close(); w.focus(); w.print();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Checklist des risques</h3>
        <div className="flex items-center gap-2">
          <button onClick={exportJSON} className="flex items-center gap-2 px-3 py-1 rounded-md border text-xs"><Download className="w-4 h-4" /> Exporter JSON</button>
          <button onClick={printChecklist} className="flex items-center gap-2 px-3 py-1 rounded-md border text-xs"><Printer className="w-4 h-4" /> Imprimer</button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs text-slate-500">Secteur :</label>
        <select value={sector} onChange={(e) => setSector(e.target.value)} className="text-xs rounded-md border px-2 py-1">
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 mb-2">Risques enregistrés</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {appRisks.map(r => {
              const covered = isRiskCovered(r);
              const ct = contracts.find(c => c.id === r.contractId);
              return (
                <div key={r.id} className={`p-2 rounded-md border flex items-center justify-between ${covered ? 'bg-emerald-50' : 'bg-white'}`}>
                  <div>
                    <div className="text-sm font-semibold">{r.title}</div>
                    <div className="text-[11px] text-slate-500">{r.family} — {ct ? ct.insurer : 'Pas de contrat'}</div>
                  </div>
                  <div className={`text-sm font-bold ${covered ? 'text-emerald-600' : 'text-slate-500'}`}>{covered ? 'Couvert' : 'Non couvert'}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-800 mb-2">Catalogue standard</h4>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {catalogRisks.map(cr => (
              <label key={cr.id} className="flex items-center justify-between p-2 rounded-md border">
                <div className="text-sm font-medium">{cr.title} <span className="text-[11px] text-slate-400">({cr.family})</span></div>
                <input type="checkbox" checked={!!catalogChecked[cr.id]} onChange={() => toggleCatalog(cr.id)} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceChecklist;
