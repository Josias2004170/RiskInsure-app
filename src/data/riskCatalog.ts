export interface CatalogRiskItem {
  id: string;
  title: string;
  description: string;
  family: 'Risques humains' | 'Risques opérationnels' | 'Risques financiers' | 'Risques juridiques et réglementaires' | 'Risques technologiques / cyber' | 'Risques matériels' | 'Risques environnementaux' | 'Risques stratégiques' | 'Risques fournisseurs / tiers' | 'Risques de responsabilité';
  applicableSectors: string[];
  defaultProbability: number;
  defaultImpact: number;
  isMandatoryByLaw?: boolean;
  mandatoryForSectors?: string[]; // Secteurs où ce risque est obligatoire
}

export const MASTER_RISK_CATALOG: CatalogRiskItem[] = [
  // =============================================================================
  // ÉDUCATION / ÉCOLES / UNIVERSITÉS
  // =============================================================================
  {
    id: "edu-001",
    title: "Incendie des bâtiments scolaires",
    description: "Risque d'incendie dans les salles de classe, amphithéâtres, laboratoires ou résidences étudiantes.",
    family: "Risques matériels",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Éducation / Écoles / Universités"]
  },
  {
    id: "edu-002",
    title: "Accident d'étudiant sur le campus",
    description: "Blessures, chutes, accidents lors d'activités sportives ou déplacements sur le campus.",
    family: "Risques humains",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Éducation / Écoles / Universités"]
  },
  {
    id: "edu-003",
    title: "Accident du personnel enseignant et administratif",
    description: "Accidents du travail, troubles musculo-squelettiques, stress professionnel du personnel.",
    family: "Risques humains",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Éducation / Écoles / Universités"]
  },
  {
    id: "edu-004",
    title: "Dégât des eaux dans les installations",
    description: "Rupture de canalisations, inondations des salles de classe, bibliothèques ou laboratoires.",
    family: "Risques matériels",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "edu-005",
    title: "Vol de matériel informatique et équipements",
    description: "Vol d'ordinateurs, projecteurs, équipements de laboratoire ou matériel pédagogique.",
    family: "Risques matériels",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "edu-006",
    title: "Cyberattaque et fuite de données personnelles",
    description: "Accès non autorisé aux données étudiantes, notes, dossiers administratifs et recherche.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "edu-007",
    title: "Incendie de laboratoire",
    description: "Accident chimique, incendie ou explosion dans les laboratoires de recherche ou d'enseignement.",
    family: "Risques matériels",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "edu-008",
    title: "Accident en laboratoire",
    description: "Brûlures, intoxications, coupures lors de manipulations en laboratoire.",
    family: "Risques humains",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "edu-009",
    title: "Vandalisme et dégradations",
    description: "Détérioration volontaire des installations, tags, bris de vitres ou équipements.",
    family: "Risques matériels",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "edu-010",
    title: "Risques liés aux événements étudiants",
    description: "Accidents, troubles, altercations lors de fêtes, manifestations ou événements étudiants.",
    family: "Risques humains",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "edu-011",
    title: "Interruption d'activité pédagogique",
    description: "Grèves, pandémies, crises sanitaires empêchant le déroulement normal des cours.",
    family: "Risques opérationnels",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "edu-012",
    title: "Responsabilité civile éducative",
    description: "Préjudice causé aux étudiants ou visiteurs du fait de l'activité éducative.",
    family: "Risques de responsabilité",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Éducation / Écoles / Universités"]
  },
  {
    id: "edu-013",
    title: "Défaillance électrique",
    description: "Coupures électriques, surtensions endommageant les équipements sensibles.",
    family: "Risques matériels",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "edu-014",
    title: "Catastrophes naturelles",
    description: "Tempêtes, inondations, séismes affectant les infrastructures universitaires.",
    family: "Risques environnementaux",
    applicableSectors: ["Éducation / Écoles / Universités"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // BTP / CONSTRUCTION / TRAVAUX PUBLICS
  // =============================================================================
  {
    id: "btp-001",
    title: "Accident de chantier",
    description: "Chutes de hauteur, coincements, écrasements sur les lieux de travail.",
    family: "Risques humains",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["BTP / Construction / Travaux publics"]
  },
  {
    id: "btp-002",
    title: "Chute de hauteur",
    description: "Chutes de toitures, échafaudages, échafaudages roulants ou plateformes.",
    family: "Risques humains",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["BTP / Construction / Travaux publics"]
  },
  {
    id: "btp-003",
    title: "Effondrement de structure",
    description: "Effondrement de bâtiments en construction, murs, planchers ou coffrages.",
    family: "Risques matériels",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "btp-004",
    title: "Incendie de chantier",
    description: "Feux liés au soudage, stockage de matériaux combustibles ou installations temporaires.",
    family: "Risques matériels",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "btp-005",
    title: "Dommages aux engins de chantier",
    description: "Destruction, vol ou panne de grues, pelleteuses, bétonneuses et engins lourds.",
    family: "Risques matériels",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "btp-006",
    title: "Vol de matériel",
    description: "Vol d'outils, câbles, métaux, équipements sur les chantiers.",
    family: "Risques matériels",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "btp-007",
    title: "Responsabilité civile chantier",
    description: "Dommages causés aux tiers, riverains ou voisins du chantier.",
    family: "Risques de responsabilité",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["BTP / Construction / Travaux publics"]
  },
  {
    id: "btp-008",
    title: "Retard de chantier",
    description: "Retards liés aux intempéries, ruptures de livraison ou problèmes techniques.",
    family: "Risques opérationnels",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "btp-009",
    title: "Défaillance d'un sous-traitant",
    description: "Qualité insuffisante, abandon de chantier ou faillite d'un sous-traitant.",
    family: "Risques fournisseurs / tiers",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "btp-010",
    title: "Accident impliquant un tiers",
    description: "Blessure ou décès d'un passant, riverain ou visiteur sur le chantier.",
    family: "Risques de responsabilité",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "btp-011",
    title: "Risque électrique",
    description: "Électrocution, électrisation lors de travaux sur installations électriques.",
    family: "Risques humains",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "btp-012",
    title: "Dommages aux ouvrages existants",
    description: "Dégâts causés aux bâtiments voisins lors de travaux de fondation ou terrassement.",
    family: "Risques de responsabilité",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "btp-013",
    title: "Pollution accidentelle",
    description: "Déversement de produits chimiques, hydrocarbures ou déchets sur le chantier.",
    family: "Risques environnementaux",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "btp-014",
    title: "Non-conformité réglementaire",
    description: "Manquement aux normes de sécurité, urbanisme ou qualité des constructions.",
    family: "Risques juridiques et réglementaires",
    applicableSectors: ["BTP / Construction / Travaux publics"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // INDUSTRIE
  // =============================================================================
  {
    id: "ind-001",
    title: "Panne de machines",
    description: "Arrêt de production suite à défaillance d'équipements industriels.",
    family: "Risques opérationnels",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "ind-002",
    title: "Incendie industriel",
    description: "Feux dans les zones de production, stockage ou processus à haute température.",
    family: "Risques matériels",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "ind-003",
    title: "Explosion",
    description: "Explosions liées à produits chimiques, gaz comprimés ou poussières combustibles.",
    family: "Risques matériels",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 5
  },
  {
    id: "ind-004",
    title: "Accident du travail",
    description: "Blessures, amputations, intoxications sur les lignes de production.",
    family: "Risques humains",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Industrie"]
  },
  {
    id: "ind-005",
    title: "Interruption de production",
    description: "Arrêt de l'activité industrielle pour maintenance, panne ou rupture d'approvisionnement.",
    family: "Risques opérationnels",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "ind-006",
    title: "Défaillance fournisseur",
    description: "Rupture de stock, retard de livraison ou qualité insuffisante des matières premières.",
    family: "Risques fournisseurs / tiers",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "ind-007",
    title: "Défaut qualité produit",
    description: "Production non conforme aux standards, rejets, rappels de produits.",
    family: "Risques opérationnels",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "ind-008",
    title: "Pollution",
    description: "Rejets atmosphériques, effluents liquides ou déchets dangereux non conformes.",
    family: "Risques environnementaux",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "ind-009",
    title: "Cyberattaque industrielle",
    description: "Attaque des systèmes de contrôle industriel (SCADA), piratage de processus.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "ind-010",
    title: "Dommages aux équipements",
    description: "Destruction ou endommagement de machines, robots ou outils de production.",
    family: "Risques matériels",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "ind-011",
    title: "Bris de machine",
    description: "Casse mécanique critique nécessitant remplacement ou réparation majeure.",
    family: "Risques matériels",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "ind-012",
    title: "Risque électrique",
    description: "Électrocution, courts-circuits, surtensions dans les installations industrielles.",
    family: "Risques matériels",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "ind-013",
    title: "Vol",
    description: "Vol de métaux, produits finis, composants ou matières premières.",
    family: "Risques matériels",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "ind-014",
    title: "Rupture de chaîne d'approvisionnement",
    description: "Impossibilité de se procurer les composants ou matières essentielles.",
    family: "Risques fournisseurs / tiers",
    applicableSectors: ["Industrie"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // PHARMACEUTIQUE / BIOMÉDICAL
  // =============================================================================
  {
    id: "pharma-001",
    title: "Contamination d'un produit",
    description: "Contamination microbiologique, chimique ou particulaire d'un médicament ou dispositif médical.",
    family: "Risques opérationnels",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Pharmaceutique / Biomédical"]
  },
  {
    id: "pharma-002",
    title: "Non-conformité réglementaire",
    description: "Manquement aux BPF, normes FDA, EMA ou autorités de santé.",
    family: "Risques juridiques et réglementaires",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Pharmaceutique / Biomédical"]
  },
  {
    id: "pharma-003",
    title: "Rappel de produits",
    description: "Rappel national ou international de lots défectueux ou non conformes.",
    family: "Risques opérationnels",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "pharma-004",
    title: "Rupture de chaîne du froid",
    description: "Défaillance des systèmes de réfrigération affectant les produits sensibles.",
    family: "Risques opérationnels",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "pharma-005",
    title: "Erreur de production",
    description: "Erreur de formulation, dosage ou procédé de fabrication.",
    family: "Risques opérationnels",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "pharma-006",
    title: "Défaillance d'un équipement de laboratoire",
    description: "Panne d'analyseur, spectromètre ou équipement de contrôle qualité.",
    family: "Risques matériels",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "pharma-007",
    title: "Accident de laboratoire",
    description: "Exposition à produits dangereux, aérosols ou agents pathogènes.",
    family: "Risques humains",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "pharma-008",
    title: "Responsabilité produit",
    description: "Actions en responsabilité pour effets secondaires ou défauts de produits.",
    family: "Risques de responsabilité",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Pharmaceutique / Biomédical"]
  },
  {
    id: "pharma-009",
    title: "Cyberattaque",
    description: "Piratage de données de recherche, brevets ou essais cliniques.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "pharma-010",
    title: "Fuite de données sensibles",
    description: "Divulgation de données de patients, essais cliniques ou propriété intellectuelle.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "pharma-011",
    title: "Interruption de production",
    description: "Arrêt forcé des lignes de production pour maintenance ou contrôle qualité.",
    family: "Risques opérationnels",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "pharma-012",
    title: "Rupture d'approvisionnement",
    description: "Indisponibilité des principes actifs ou excipients essentiels.",
    family: "Risques fournisseurs / tiers",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "pharma-013",
    title: "Incendie",
    description: "Feu dans les zones de stockage, production ou laboratoires.",
    family: "Risques matériels",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "pharma-014",
    title: "Erreur de stockage",
    description: "Non-respect des conditions de température, humidité ou conservation.",
    family: "Risques opérationnels",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "pharma-015",
    title: "Risques liés aux essais cliniques",
    description: "Incidents, effets secondaires graves ou arrêt d'essais cliniques.",
    family: "Risques juridiques et réglementaires",
    applicableSectors: ["Pharmaceutique / Biomédical"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // SANTÉ / HÔPITAUX / CLINIQUES
  // =============================================================================
  {
    id: "sante-001",
    title: "Responsabilité civile médicale",
    description: "Erreurs médicales, diagnostics incorrects ou complications post-opératoires.",
    family: "Risques de responsabilité",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Santé / Hôpitaux / Cliniques"]
  },
  {
    id: "sante-002",
    title: "Infection nosocomiale",
    description: "Infections contractées lors d'un séjour hospitalier.",
    family: "Risques humains",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "sante-003",
    title: "Erreur médicamenteuse",
    description: "Mauvais dosage, mauvais médicament ou interaction médicamenteuse.",
    family: "Risques humains",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "sante-004",
    title: "Accident patient",
    description: "Chutes, brûlures ou accidents dans les services de soins.",
    family: "Risques humains",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "sante-005",
    title: "Défaillance équipement médical",
    description: "Panne d'IRM, scanner, respirateur ou autre équipement vital.",
    family: "Risques matériels",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "sante-006",
    title: "Incendie",
    description: "Feu dans les services, blocs opératoires ou zones techniques.",
    family: "Risques matériels",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "sante-007",
    title: "Fuite de données patients",
    description: "Violation de la confidentialité des dossiers médicaux (RGPD).",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "sante-008",
    title: "Ransomware",
    description: "Chiffrement des systèmes hospitaliers paralysant les soins.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "sante-009",
    title: "Interruption de soins",
    description: "Impossibilité de prodiguer les soins pour panne système ou pénurie.",
    family: "Risques opérationnels",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "sante-010",
    title: "Rupture d'approvisionnement médicaments",
    description: "Pénurie de médicaments essentiels ou dispositifs médicaux.",
    family: "Risques fournisseurs / tiers",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "sante-011",
    title: "Accident du personnel soignant",
    description: "Piqures, coupures, exposition aux agents pathogènes ou épuisement professionnel.",
    family: "Risques humains",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "sante-012",
    title: "Non-conformité réglementaire",
    description: "Manquement aux normes d'hygiène, sécurité ou qualité des soins.",
    family: "Risques juridiques et réglementaires",
    applicableSectors: ["Santé / Hôpitaux / Cliniques"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // COMMERCE / RETAIL
  // =============================================================================
  {
    id: "retail-001",
    title: "Vol à l'étalage",
    description: "Vol de marchandises par les clients dans les magasins.",
    family: "Risques matériels",
    applicableSectors: ["Commerce / Retail"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "retail-002",
    title: "Cambriolage",
    description: "Effraction, vol après fermeture ou braquage.",
    family: "Risques matériels",
    applicableSectors: ["Commerce / Retail"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "retail-003",
    title: "Accident client",
    description: "Chutes, glissades ou blessures de clients dans le magasin.",
    family: "Risques de responsabilité",
    applicableSectors: ["Commerce / Retail"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "retail-004",
    title: "Incendie",
    description: "Feu dans les zones de stockage, rayons ou locaux techniques.",
    family: "Risques matériels",
    applicableSectors: ["Commerce / Retail"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "retail-005",
    title: "Dégât des eaux",
    description: "Inondation endommageant le stock et les installations.",
    family: "Risques matériels",
    applicableSectors: ["Commerce / Retail"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "retail-006",
    title: "Rupture de chaîne d'approvisionnement",
    description: "Impossibilité de se procurer les produits à vendre.",
    family: "Risques fournisseurs / tiers",
    applicableSectors: ["Commerce / Retail"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "retail-007",
    title: "Obsolescence des stocks",
    description: "Produits invendus devenus périmés ou obsolètes.",
    family: "Risques financiers",
    applicableSectors: ["Commerce / Retail"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "retail-008",
    title: "Cyberattaque caisse",
    description: "Piratage des systèmes de paiement et données bancaires des clients.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Commerce / Retail"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "retail-009",
    title: "Responsabilité produit",
    description: "Préjudice causé par un produit défectueux vendu.",
    family: "Risques de responsabilité",
    applicableSectors: ["Commerce / Retail"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // TRANSPORT / LOGISTIQUE
  // =============================================================================
  {
    id: "trans-001",
    title: "Accident de la route",
    description: "Collision, carambolage ou accident des véhicules de la flotte.",
    family: "Risques humains",
    applicableSectors: ["Transport / Logistique"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Transport / Logistique"]
  },
  {
    id: "trans-002",
    title: "Vol de marchandises",
    description: "Vol de cargaison, camion entier ou conteneurs.",
    family: "Risques matériels",
    applicableSectors: ["Transport / Logistique"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "trans-003",
    title: "Dommage marchandise en transit",
    description: "Avarie, casse ou détérioration pendant le transport.",
    family: "Risques matériels",
    applicableSectors: ["Transport / Logistique"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "trans-004",
    title: "Retard de livraison",
    description: "Non-respect des délais de livraison contractuels.",
    family: "Risques opérationnels",
    applicableSectors: ["Transport / Logistique"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "trans-005",
    title: "Panne véhicule",
    description: "Immobilisation d'un véhicule pour panne mécanique.",
    family: "Risques matériels",
    applicableSectors: ["Transport / Logistique"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "trans-006",
    title: "Pollution accidentelle",
    description: "Déversement de carburant, produits chimiques ou huiles lors d'un accident.",
    family: "Risques environnementaux",
    applicableSectors: ["Transport / Logistique"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "trans-007",
    title: "Responsabilité transporteur",
    description: "Dommages causés aux marchandises transportées.",
    family: "Risques de responsabilité",
    applicableSectors: ["Transport / Logistique"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // HÔTELLERIE / TOURISME
  // =============================================================================
  {
    id: "hotel-001",
    title: "Incendie",
    description: "Feu dans les chambres, zones communes ou restaurants.",
    family: "Risques matériels",
    applicableSectors: ["Hôtellerie / Tourisme"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "hotel-002",
    title: "Accident client",
    description: "Chutes, glissades, brûlures ou blessures des clients.",
    family: "Risques de responsabilité",
    applicableSectors: ["Hôtellerie / Tourisme"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "hotel-003",
    title: "Vol client",
    description: "Vol d'effets personnels dans les chambres ou zones communes.",
    family: "Risques de responsabilité",
    applicableSectors: ["Hôtellerie / Tourisme"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "hotel-004",
    title: "Intoxication alimentaire",
    description: "Toxi-infection alimentaire suite à consommation au restaurant.",
    family: "Risques de responsabilité",
    applicableSectors: ["Hôtellerie / Tourisme"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "hotel-005",
    title: "Dégât des eaux",
    description: "Inondation affectant les chambres et installations.",
    family: "Risques matériels",
    applicableSectors: ["Hôtellerie / Tourisme"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "hotel-006",
    title: "Baisse de fréquentation",
    description: "Chute de réservations due à crise sanitaire, économique ou événement.",
    family: "Risques stratégiques",
    applicableSectors: ["Hôtellerie / Tourisme"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // AGROALIMENTAIRE
  // =============================================================================
  {
    id: "agro-001",
    title: "Contamination alimentaire",
    description: "Contamination bactérienne, virale ou chimique des produits.",
    family: "Risques opérationnels",
    applicableSectors: ["Agroalimentaire"],
    defaultProbability: 3,
    defaultImpact: 3,
    mandatoryForSectors: ["Agroalimentaire"]
  },
  {
    id: "agro-002",
    title: "Rappel de produits",
    description: "Rappel de lots pour contamination ou non-conformité.",
    family: "Risques opérationnels",
    applicableSectors: ["Agroalimentaire"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "agro-003",
    title: "Rupture chaîne du froid",
    description: "Défaillance des systèmes de réfrigération.",
    family: "Risques opérationnels",
    applicableSectors: ["Agroalimentaire"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "agro-004",
    title: "Incendie",
    description: "Feu dans les zones de production ou stockage.",
    family: "Risques matériels",
    applicableSectors: ["Agroalimentaire"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "agro-005",
    title: "Responsabilité produit",
    description: "Actions en responsabilité pour produits contaminés ou défectueux.",
    family: "Risques de responsabilité",
    applicableSectors: ["Agroalimentaire"],
    defaultProbability: 3,
    defaultImpact: 4
  },

  // =============================================================================
  // TECHNOLOGIE / INFORMATIQUE
  // =============================================================================
  {
    id: "tech-001",
    title: "Ransomware",
    description: "Chiffrement des systèmes et demande de rançon.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Technologie / Informatique"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "tech-002",
    title: "Violation de données",
    description: "Fuite de données clients ou propriété intellectuelle.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Technologie / Informatique"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "tech-003",
    title: "DDoS",
    description: "Attaque par déni de service paralysant les services.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Technologie / Informatique"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "tech-004",
    title: "Perte de données",
    description: "Perte irréversible de données sans sauvegarde.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Technologie / Informatique"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "tech-005",
    title: "Perte de talent clé",
    description: "Départ de développeurs ou experts critiques.",
    family: "Risques humains",
    applicableSectors: ["Technologie / Informatique"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "tech-006",
    title: "Litige propriété intellectuelle",
    description: "Contestation de brevets, licences ou code source.",
    family: "Risques juridiques et réglementaires",
    applicableSectors: ["Technologie / Informatique"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // SERVICES FINANCIERS
  // =============================================================================
  {
    id: "fin-001",
    title: "Fraude interne",
    description: "Détournement de fonds par des employés.",
    family: "Risques financiers",
    applicableSectors: ["Services financiers"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "fin-002",
    title: "Blanchiment",
    description: "Utilisation des services pour blanchiment d'argent.",
    family: "Risques juridiques et réglementaires",
    applicableSectors: ["Services financiers"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "fin-003",
    title: "Cyberattaque bancaire",
    description: "Piratage de comptes ou systèmes de paiement.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Services financiers"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "fin-004",
    title: "Risque de marché",
    description: "Pertes dues aux fluctuations des marchés financiers.",
    family: "Risques financiers",
    applicableSectors: ["Services financiers"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "fin-005",
    title: "Risque de crédit",
    description: "Défaillance des emprunteurs ou contreparties.",
    family: "Risques financiers",
    applicableSectors: ["Services financiers"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "fin-006",
    title: "Non-conformité réglementaire",
    description: "Manquement aux régulations bancaires et financières.",
    family: "Risques juridiques et réglementaires",
    applicableSectors: ["Services financiers"],
    defaultProbability: 3,
    defaultImpact: 3
  },

  // =============================================================================
  // IMMOBILIER
  // =============================================================================
  {
    id: "immo-001",
    title: "Incendie",
    description: "Feu dans les bâtiments gérés.",
    family: "Risques matériels",
    applicableSectors: ["Immobilier"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "immo-002",
    title: "Dégât des eaux",
    description: "Inondation ou fuite endommageant les biens.",
    family: "Risques matériels",
    applicableSectors: ["Immobilier"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "immo-003",
    title: "Accident locataire",
    description: "Blessure d'un locataire dans les parties communes.",
    family: "Risques de responsabilité",
    applicableSectors: ["Immobilier"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "immo-004",
    title: "Vacance locative",
    description: "Prolongée vacance des biens immobiliers.",
    family: "Risques financiers",
    applicableSectors: ["Immobilier"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "immo-005",
    title: "Dégradation locataire",
    description: "Dommages causés par un locataire aux biens.",
    family: "Risques matériels",
    applicableSectors: ["Immobilier"],
    defaultProbability: 3,
    defaultImpact: 2
  },

  // =============================================================================
  // ÉNERGIE
  // =============================================================================
  {
    id: "ener-001",
    title: "Incendie installation",
    description: "Feu dans les installations de production ou distribution.",
    family: "Risques matériels",
    applicableSectors: ["Énergie"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "ener-002",
    title: "Explosion",
    description: "Explosion de gaz, transformateur ou installation.",
    family: "Risques matériels",
    applicableSectors: ["Énergie"],
    defaultProbability: 3,
    defaultImpact: 5
  },
  {
    id: "ener-003",
    title: "Panne réseau",
    description: "Interruption de distribution d'électricité ou gaz.",
    family: "Risques opérationnels",
    applicableSectors: ["Énergie"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "ener-004",
    title: "Pollution environnementale",
    description: "Rejets ou fuites polluantes.",
    family: "Risques environnementaux",
    applicableSectors: ["Énergie"],
    defaultProbability: 3,
    defaultImpact: 4
  },
  {
    id: "ener-005",
    title: "Cyberattaque SCADA",
    description: "Attaque des systèmes de contrôle industriel.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Énergie"],
    defaultProbability: 3,
    defaultImpact: 4
  },

  // =============================================================================
  // ADMINISTRATION / SERVICES
  // =============================================================================
  {
    id: "admin-001",
    title: "Violation de données",
    description: "Fuite de données citoyens ou administratives.",
    family: "Risques technologiques / cyber",
    applicableSectors: ["Administration / Services"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "admin-002",
    title: "Non-conformité réglementaire",
    description: "Manquement aux obligations légales et réglementaires.",
    family: "Risques juridiques et réglementaires",
    applicableSectors: ["Administration / Services"],
    defaultProbability: 3,
    defaultImpact: 3
  },
  {
    id: "admin-003",
    title: "Grève",
    description: "Mouvement social paralysant l'activité.",
    family: "Risques opérationnels",
    applicableSectors: ["Administration / Services"],
    defaultProbability: 3,
    defaultImpact: 2
  },
  {
    id: "admin-004",
    title: "Erreur administrative",
    description: "Erreur de traitement ou décision administrative erronée.",
    family: "Risques juridiques et réglementaires",
    applicableSectors: ["Administration / Services"],
    defaultProbability: 3,
    defaultImpact: 2
  }
];

export const SECTOR_OPTIONS = [
  "Éducation / Écoles / Universités",
  "BTP / Construction / Travaux publics",
  "Industrie",
  "Pharmaceutique / Biomédical",
  "Santé / Hôpitaux / Cliniques",
  "Commerce / Retail",
  "Transport / Logistique",
  "Hôtellerie / Tourisme",
  "Agroalimentaire",
  "Technologie / Informatique",
  "Services financiers",
  "Immobilier",
  "Énergie",
  "Administration / Services",
  "Autre secteur d'activité"
];

// Fonction pour obtenir les risques par défaut selon le secteur de l'entreprise
export const getDefaultRisksForSector = (sector: string): CatalogRiskItem[] => {
  return MASTER_RISK_CATALOG.filter(item =>
    item.applicableSectors.some(s =>
      s === 'Tous secteurs' ||
      s.toLowerCase().includes(sector.toLowerCase()) ||
      sector.toLowerCase().includes(s.toLowerCase())
    )
  );
};

// Fonction pour obtenir les risques obligatoires pour un secteur
export const getMandatoryRisksForSector = (sector: string): CatalogRiskItem[] => {
  return MASTER_RISK_CATALOG.filter(item =>
    (item.isMandatoryByLaw && item.applicableSectors.some(s =>
      s === 'Tous secteurs' ||
      s.toLowerCase().includes(sector.toLowerCase()) ||
      sector.toLowerCase().includes(s.toLowerCase())
    )) ||
    (item.mandatoryForSectors && item.mandatoryForSectors.some(s =>
      s.toLowerCase().includes(sector.toLowerCase()) ||
      sector.toLowerCase().includes(s.toLowerCase())
    ))
  );
};

// Fonction pour générer une sélection variée de risques pour une entreprise
// Utilise un algorithme déterministe basé sur le nom de l'entreprise pour que
// la sélection soit reproductible mais varie entre entreprises du même secteur
export const generateCompanyRisks = (sector: string, companyName: string): CatalogRiskItem[] => {
  const sectorRisks = getDefaultRisksForSector(sector);
  const mandatoryRisks = getMandatoryRisksForSector(sector);

  // Créer un seed déterministe à partir du nom de l'entreprise
  let seed = 0;
  for (let i = 0; i < companyName.length; i++) {
    seed = ((seed << 5) - seed) + companyName.charCodeAt(i);
    seed = seed & seed; // Convertir en entier 32-bit
  }
  seed = Math.abs(seed);

  // Fonction pseudo-aléatoire déterministe
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Sélectionner 8-12 risques additionnels parmi les risques non obligatoires
  const optionalRisks = sectorRisks.filter(r => !mandatoryRisks.includes(r));
  const additionalCount = 8 + Math.floor(pseudoRandom() * 5); // 8-12 risques

  // Mélanger les risques optionnels avec notre seed
  const shuffled = [...optionalRisks].sort(() => pseudoRandom() - 0.5);
  const selectedAdditional = shuffled.slice(0, Math.min(additionalCount, shuffled.length));

  // Combiner risques obligatoires et sélectionnés
  return [...mandatoryRisks, ...selectedAdditional];
};
