export type RiskFamily = 'Responsabilité civile' | 'Bien matériel' | 'Personne civile';

export interface RiskItem {
  id: string;
  title: string;
  family: RiskFamily;
  description?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  coverageAreas: RiskFamily[];
  description?: string;
}

// Standard risk catalogue (24+ items) with families
export const risks: RiskItem[] = [
  { id: 'r_fire', title: 'Incendie', family: 'Bien matériel', description: 'Dommages par feu aux locaux et biens.' },
  { id: 'r_theft', title: 'Vol / Cambriolage', family: 'Bien matériel' },
  { id: 'r_water', title: 'Dégâts des eaux', family: 'Bien matériel' },
  { id: 'r_natural', title: 'Catastrophes naturelles', family: 'Bien matériel' },
  { id: 'r_vandalism', title: 'Vandalisme', family: 'Bien matériel' },
  { id: 'r_machine_breakdown', title: 'Bris de machine', family: 'Bien matériel' },
  { id: 'r_transport', title: 'Dommages transport', family: 'Bien matériel' },
  { id: 'r_business_interruption', title: 'Pertes d\'exploitation', family: 'Bien matériel' },

  { id: 'r_product_liability', title: 'Responsabilité produit', family: 'Responsabilité civile' },
  { id: 'r_professional_liability', title: 'Responsabilité professionnelle', family: 'Responsabilité civile' },
  { id: 'r_third_party_injury', title: 'Blessures tiers', family: 'Responsabilité civile' },
  { id: 'r_environmental', title: 'Pollution & dégâts environnementaux', family: 'Responsabilité civile' },
  { id: 'r_legal_expenses', title: 'Frais juridiques', family: 'Responsabilité civile' },
  { id: 'r_directors_officers', title: 'D&O (Dirigeants)', family: 'Responsabilité civile' },

  { id: 'r_employee_injury', title: 'Accident du travail', family: 'Personne civile' },
  { id: 'r_occupational_disease', title: 'Maladie professionnelle', family: 'Personne civile' },
  { id: 'r_personal_accident', title: 'Accident corporel', family: 'Personne civile' },
  { id: 'r_life', title: 'Assurance vie collective', family: 'Personne civile' },

  { id: 'r_cyber', title: 'Cyber / Violation de données', family: 'Responsabilité civile' },
  { id: 'r_fraud', title: 'Fraude interne / externe', family: 'Bien matériel' },
  { id: 'r_terrorism', title: 'Attentat / Terrorisme', family: 'Bien matériel' },
  { id: 'r_credit', title: 'Risque crédit', family: 'Responsabilité civile' },
  { id: 'r_supply_chain', title: 'Rupture chaîne d\'approvisionnement', family: 'Bien matériel' },
  { id: 'r_motor_fleet', title: 'Flotte automobile', family: 'Bien matériel' }
];

// Standard insurance products available on market
export const products: ProductItem[] = [
  { id: 'p_multirisque', name: 'Multirisque Entreprise', coverageAreas: ['Bien matériel', 'Responsabilité civile'], description: 'Protection bâtiments, stocks, mobilier, RC.' },
  { id: 'p_rc_generale', name: 'Responsabilité Civile Générale', coverageAreas: ['Responsabilité civile'] },
  { id: 'p_rc_professionnelle', name: 'Responsabilité Professionnelle', coverageAreas: ['Responsabilité civile'] },
  { id: 'p_cyber', name: 'Cyber Assurance', coverageAreas: ['Responsabilité civile'], description: 'Couverture des fuites de données et pertes numériques.' },
  { id: 'p_dandO', name: 'D&O (Dirigeants & Administrateurs)', coverageAreas: ['Responsabilité civile'] },
  { id: 'p_brismachine', name: 'Bris de machine', coverageAreas: ['Bien matériel'] },
  { id: 'p_transport', name: 'Transport / Marchandises en transit', coverageAreas: ['Bien matériel'] },
  { id: 'p_flotte', name: 'Flotte automobile', coverageAreas: ['Bien matériel'] },
  { id: 'p_credit', name: 'Assurance Crédit', coverageAreas: ['Responsabilité civile'] },
  { id: 'p_pertes_exploitation', name: 'Pertes d\'exploitation', coverageAreas: ['Bien matériel'] },
  { id: 'p_sante_collective', name: 'Santé collective', coverageAreas: ['Personne civile'] },
  { id: 'p_accident', name: 'Assurance Accidents du travail / Personne', coverageAreas: ['Personne civile'] }
];

// Typical sector -> list of risk ids commonly covered by default
export const sectorDefaultCoverage: { [sector: string]: string[] } = {
  General: [
    'r_fire', 'r_theft', 'r_water', 'r_product_liability', 'r_third_party_injury', 'r_cyber', 'r_business_interruption'
  ],
  Construction: [
    'r_fire', 'r_theft', 'r_natural', 'r_vandalism', 'r_machine_breakdown', 'r_transport', 'r_terrorism', 'r_motor_fleet'
  ],
  Manufacturing: [
    'r_fire', 'r_machine_breakdown', 'r_brismachine', 'r_product_liability', 'r_business_interruption', 'r_supply_chain'
  ],
  Technology: ['r_cyber', 'r_product_liability', 'r_business_interruption', 'r_theft'],
  Healthcare: ['r_third_party_injury', 'r_professional_liability', 'r_employee_injury', 'r_personal_accident'],
  Retail: ['r_theft', 'r_vandalism', 'r_product_liability', 'r_business_interruption'],
  Transport: ['r_transport', 'r_motor_fleet', 'r_theft', 'r_business_interruption']
};

export const families: RiskFamily[] = ['Responsabilité civile', 'Bien matériel', 'Personne civile'];

export default { risks, products, sectorDefaultCoverage, families };
