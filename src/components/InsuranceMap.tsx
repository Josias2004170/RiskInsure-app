import React, { useMemo, useState } from 'react';
import { risks, products, sectorDefaultCoverage, families } from '../data/insuranceCatalog';
import { Contract } from '../types';
import { Info, CheckCircle2, XCircle } from 'lucide-react';

interface InsuranceMapProps {
  initialSector?: string;
  contracts?: Contract[];
  sector?: string;
  onSectorChange?: (s: string) => void;
}

const COVERED_CLASS = 'bg-emerald-600 text-white';
const NOT_COVERED_CLASS = 'bg-slate-100 text-slate-700';
const PARTIAL_CLASS = 'bg-amber-500 text-white';

export const InsuranceMap: React.FC<InsuranceMapProps> = ({ initialSector = 'General', contracts, sector: controlledSector, onSectorChange }) => {
  const sectors = useMemo(() => Object.keys(sectorDefaultCoverage), []);
  const [internalSector, setInternalSector] = useState(initialSector);
  const sector = controlledSector || internalSector;

  const setSector = (s: string) => {
    if (onSectorChange) onSectorChange(s);
    else setInternalSector(s);
  };

  const coverageSet = useMemo(() => new Set(sectorDefaultCoverage[sector] || []), [sector]);

  const mapContractToFamilies = (type: string) => {
    const t = type.toLowerCase();
    const covered: string[] = [];
    if (t.includes('sant') || t.includes('prév') || t.includes('prévoy')) covered.push('Personne civile');
    if (t.includes('dommage') || t.includes('biens') || t.includes('brise') || t.includes('perte')) covered.push('Bien matériel');
    if (t.includes('responsabil') || t.includes('rc') || t.includes('d&o') || t.includes('direct')) covered.push('Responsabilité civile');
    if (t.includes('cyber')) covered.push('Responsabilité civile');
    if (t.includes('flotte') || t.includes('automobile') || t.includes('transport')) covered.push('Bien matériel');
    if (covered.length === 0) covered.push('Responsabilité civile');
    return covered as Array<typeof families[number]>;
  };

  // Heuristic mapping of keywords in contract.type -> specific risk ids
  const keywordRiskMap: Record<string, string[]> = {
    incendie: ['r_fire'],
    fire: ['r_fire'],
    vol: ['r_theft'],
    cambriolage: ['r_theft'],
    eau: ['r_water', 'r_business_interruption'],
    'dégâts': ['r_water', 'r_vandalism'],
    vandal: ['r_vandalism'],
    bris: ['r_machine_breakdown', 'r_brismachine'],
    'bris de machine': ['r_machine_breakdown', 'r_brismachine'],
    transport: ['r_transport'],
    'perte d\'exploitation': ['r_business_interruption'],
    'perte exploitation': ['r_business_interruption'],
    product: ['r_product_liability'],
    'responsabil': ['r_professional_liability', 'r_third_party_injury', 'r_product_liability'],
    'd&o': ['r_directors_officers'],
    cyber: ['r_cyber'],
    fraude: ['r_fraud'],
    terror: ['r_terrorism'],
    flotte: ['r_motor_fleet']
  };

  // Compute a status map per risk: 'COVERED' | 'PARTIAL' | 'NONE'
  const companyCoverageStatus = useMemo(() => {
    const statusMap: Record<string, 'COVERED' | 'PARTIAL' | 'NONE'> = {};
    // init NONE
    risks.forEach(r => { statusMap[r.id] = 'NONE'; });

    if (!contracts || contracts.length === 0) return statusMap;

    contracts.forEach(c => {
      if (c.status !== 'Actif') return;
      const typeLower = (c.type || '').toLowerCase();
      // 1) exact keyword -> mark specific risks as COVERED
      Object.entries(keywordRiskMap).forEach(([kw, rids]) => {
        if (typeLower.includes(kw)) {
          rids.forEach(rid => { statusMap[rid] = 'COVERED'; });
        }
      });

      // 2) fallback: if contract implies families, mark those family risks PARTIAL if not already COVERED
      const fams = mapContractToFamilies(c.type);
      risks.forEach(r => {
        if (fams.includes(r.family as any)) {
          if (statusMap[r.id] !== 'COVERED') statusMap[r.id] = 'PARTIAL';
        }
      });
    });

    return statusMap;
  }, [contracts]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Cartographie des assurances</h3>
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500">Secteur :</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="text-xs rounded-md border px-2 py-1"
          >
            <option value="General">Général</option>
            {sectors.map(s => s !== 'General' && <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {families.map((f) => (
          <div key={f} className="p-3 border rounded-lg">
            <h4 className="text-xs font-bold text-slate-800 mb-2">{f}</h4>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {risks
                .filter(r => r.family === f)
                .filter(r => sector === 'General' ? true : coverageSet.has(r.id))
                .map(r => {
                const status = contracts && contracts.length > 0 ? companyCoverageStatus[r.id] : (coverageSet.has(r.id) ? 'COVERED' : 'NONE');
                const cls = status === 'COVERED' ? COVERED_CLASS : status === 'PARTIAL' ? PARTIAL_CLASS : NOT_COVERED_CLASS;
                return (
                  <div key={r.id} className={`flex items-center justify-between p-2 rounded-md ${cls}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{r.title}</span>
                      <span className="text-[11px] text-slate-200/80">{r.description ? '' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {status === 'COVERED' && <CheckCircle2 className="w-4 h-4" />}
                      {status === 'PARTIAL' && <Info className="w-4 h-4 text-white/80" />}
                      {status === 'NONE' && <XCircle className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t">
        <div className="flex items-center gap-4 mb-2 text-xs">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-600"></span> Couvert</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300"></span> Non couvert</div>
          <div className="flex items-center gap-2"><Info className="w-4 h-4 text-slate-400"/> <span className="text-slate-500">Sélectionnez un secteur pour voir les couvertures habituelles</span></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-bold text-slate-800">Produits d'assurance disponibles</h5>
            <ul className="text-xs mt-2 space-y-1">
              {products.map(p => (
                <li key={p.id} className="flex justify-between items-center">
                  <span>{p.name}</span>
                  <span className="text-[11px] text-slate-400">{p.coverageAreas.join(', ')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-800">Légende</h5>
            <div className="mt-2 text-xs space-y-1">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-600"></span> Risque couvert (courant)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300"></span> Risque non couvert par défaut</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Couverture conditionnelle / partielle</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceMap;
