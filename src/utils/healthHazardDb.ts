/**
 * Ingredient Health Hazard Database
 *
 * Built from publicly available regulatory and scientific sources:
 * - EU Cosmetics Regulation Annex II (banned) & Annex III (restricted)
 * - California Prop 65 known carcinogens/reproductive toxins
 * - IARC (International Agency for Research on Cancer) classifications
 * - SCCS (Scientific Committee on Consumer Safety) opinions
 * - Endocrine Disruptor Lists (TEDX, EU priority lists)
 */

export type HazardCategory =
  | 'carcinogen'
  | 'endocrine_disruptor'
  | 'allergen'
  | 'irritant'
  | 'reproductive_toxin'
  | 'environmental'
  | 'organ_toxin'

export type HazardSeverity = 'high' | 'moderate' | 'low'

export interface HazardIngredient {
  /** INCI name (primary) */
  name: string
  /** Alternative names / regex patterns for matching */
  aliases: RegExp[]
  category: HazardCategory
  severity: HazardSeverity
  /** Why this ingredient is flagged */
  concern: string
  /** Regulatory/scientific source */
  source: string
}

/** Deduction points per severity level */
export const SEVERITY_DEDUCTIONS: Record<HazardSeverity, number> = {
  high: 15,
  moderate: 8,
  low: 3,
}

export const HAZARD_CATEGORY_LABELS: Record<HazardCategory, { label: string; icon: string }> = {
  carcinogen: { label: 'Potential Carcinogen', icon: '☢️' },
  endocrine_disruptor: { label: 'Endocrine Disruptor', icon: '⚠️' },
  allergen: { label: 'Known Allergen', icon: '🤧' },
  irritant: { label: 'Irritant', icon: '🔥' },
  reproductive_toxin: { label: 'Reproductive Toxin', icon: '⛔' },
  environmental: { label: 'Environmental Concern', icon: '🌍' },
  organ_toxin: { label: 'Organ Toxicity', icon: '💀' },
}

export const HAZARD_DB: HazardIngredient[] = [
  // ── FORMALDEHYDE RELEASERS (carcinogens) ─────────────────────────────
  {
    name: 'DMDM Hydantoin',
    aliases: [/\bdmdm hydantoin\b/i],
    category: 'carcinogen',
    severity: 'high',
    concern: 'Formaldehyde releaser — classified as a human carcinogen by IARC',
    source: 'IARC Group 1; EU Annex III restricted',
  },
  {
    name: 'Quaternium-15',
    aliases: [/\bquaternium[- ]?15\b/i],
    category: 'carcinogen',
    severity: 'high',
    concern: 'Formaldehyde releaser — releases formaldehyde over time',
    source: 'IARC Group 1 (formaldehyde); CIR restricted',
  },
  {
    name: 'Imidazolidinyl Urea',
    aliases: [/\bimidazolidinyl urea\b/i],
    category: 'carcinogen',
    severity: 'high',
    concern: 'Formaldehyde releaser',
    source: 'IARC Group 1 (formaldehyde)',
  },
  {
    name: 'Diazolidinyl Urea',
    aliases: [/\bdiazolidinyl urea\b/i],
    category: 'carcinogen',
    severity: 'high',
    concern: 'Formaldehyde releaser',
    source: 'IARC Group 1 (formaldehyde)',
  },
  {
    name: 'Bronopol (2-Bromo-2-Nitropropane-1,3-Diol)',
    aliases: [/\bbronopol\b/i, /\b2-bromo-2-nitropropane\b/i],
    category: 'carcinogen',
    severity: 'moderate',
    concern: 'Can form nitrosamines; formaldehyde releaser',
    source: 'SCCS opinion; EU Annex III',
  },

  // ── ENDOCRINE DISRUPTORS ─────────────────────────────────────────────
  {
    name: 'Methylparaben',
    aliases: [/\bmethylparaben\b/i, /\bmethyl paraben\b/i],
    category: 'endocrine_disruptor',
    severity: 'moderate',
    concern: 'Weak estrogenic activity; accumulates in tissue',
    source: 'SCCS 2013; TEDX list',
  },
  {
    name: 'Propylparaben',
    aliases: [/\bpropylparaben\b/i, /\bpropyl paraben\b/i],
    category: 'endocrine_disruptor',
    severity: 'moderate',
    concern: 'Stronger estrogenic activity than methylparaben',
    source: 'EU restricted to 0.14%; TEDX list',
  },
  {
    name: 'Butylparaben',
    aliases: [/\bbutylparaben\b/i, /\bbutyl paraben\b/i],
    category: 'endocrine_disruptor',
    severity: 'high',
    concern: 'Strongest estrogenic activity among common parabens',
    source: 'EU banned in products for children under 3; TEDX',
  },
  {
    name: 'Ethylparaben',
    aliases: [/\bethylparaben\b/i, /\bethyl paraben\b/i],
    category: 'endocrine_disruptor',
    severity: 'low',
    concern: 'Mild estrogenic activity',
    source: 'SCCS generally regarded as safe at low levels',
  },
  {
    name: 'BHT (Butylated Hydroxytoluene)',
    aliases: [/\bbht\b/i, /\bbutylated hydroxytoluene\b/i],
    category: 'endocrine_disruptor',
    severity: 'moderate',
    concern: 'Possible endocrine disruptor; linked to organ toxicity in high doses',
    source: 'TEDX list; NTP study',
  },
  {
    name: 'BHA (Butylated Hydroxyanisole)',
    aliases: [/\bbha\b/i, /\bbutylated hydroxyanisole\b/i],
    category: 'endocrine_disruptor',
    severity: 'high',
    concern: 'Reasonably anticipated carcinogen; endocrine disruptor',
    source: 'NTP Report on Carcinogens; Prop 65',
  },
  {
    name: 'Triclosan',
    aliases: [/\btriclosan\b/i],
    category: 'endocrine_disruptor',
    severity: 'high',
    concern: 'Thyroid disruptor; bioaccumulative; FDA banned in OTC antiseptics',
    source: 'FDA 2016 ban; EU restricted in cosmetics',
  },
  {
    name: 'Oxybenzone (Benzophenone-3)',
    aliases: [/\boxybenzone\b/i, /\bbenzophenone[- ]?3\b/i],
    category: 'endocrine_disruptor',
    severity: 'moderate',
    concern: 'Estrogenic activity; coral reef damage; skin penetration',
    source: 'Hawaii/Key West ban; TEDX list',
  },
  {
    name: 'Homosalate',
    aliases: [/\bhomosalate\b/i],
    category: 'endocrine_disruptor',
    severity: 'low',
    concern: 'Potential hormonal activity; EU reduced max concentration',
    source: 'SCCS 2021 opinion; EU Annex III',
  },
  {
    name: 'Octinoxate (Ethylhexyl Methoxycinnamate)',
    aliases: [/\boctinoxate\b/i, /\bethylhexyl methoxycinnamate\b/i],
    category: 'endocrine_disruptor',
    severity: 'moderate',
    concern: 'Estrogenic and thyroid-disrupting activity',
    source: 'Hawaii ban; TEDX list',
  },
  {
    name: 'Resorcinol',
    aliases: [/\bresorcinol\b/i],
    category: 'endocrine_disruptor',
    severity: 'moderate',
    concern: 'Thyroid disruptor at high exposures; skin sensitizer',
    source: 'EU Annex III restricted; TEDX list',
  },

  // ── ALLERGENS & SENSITIZERS ──────────────────────────────────────────
  {
    name: 'Methylisothiazolinone (MI)',
    aliases: [/\bmethylisothiazolinone\b/i, /\b(mi)\b/i],
    category: 'allergen',
    severity: 'high',
    concern: 'Potent contact allergen; "Allergen of the Year" 2013',
    source: 'EU banned in leave-on products; ACDS Allergen of the Year',
  },
  {
    name: 'Methylchloroisothiazolinone (MCI)',
    aliases: [/\bmethylchloroisothiazolinone\b/i, /\bmci\b/i],
    category: 'allergen',
    severity: 'high',
    concern: 'Potent contact allergen; typically used with MI',
    source: 'EU banned in leave-on products',
  },
  {
    name: 'Lilial (Butylphenyl Methylpropional)',
    aliases: [/\blilial\b/i, /\bbutylphenyl methylpropional\b/i],
    category: 'allergen',
    severity: 'high',
    concern: 'EU-banned fragrance allergen; reproductive toxin',
    source: 'EU Annex II banned March 2022',
  },
  {
    name: 'Linalool',
    aliases: [/\blinalool\b/i],
    category: 'allergen',
    severity: 'low',
    concern: 'Fragrance allergen; can cause contact dermatitis when oxidized',
    source: 'EU Annex III (must be declared >10ppm in leave-on)',
  },
  {
    name: 'Limonene',
    aliases: [/\blimonene\b/i],
    category: 'allergen',
    severity: 'low',
    concern: 'Fragrance allergen; oxidizes to sensitizing compounds',
    source: 'EU Annex III (must be declared)',
  },
  {
    name: 'Geraniol',
    aliases: [/\bgeraniol\b/i],
    category: 'allergen',
    severity: 'low',
    concern: 'Fragrance allergen; contact sensitizer',
    source: 'EU Annex III (must be declared)',
  },
  {
    name: 'Citronellol',
    aliases: [/\bcitronellol\b/i],
    category: 'allergen',
    severity: 'low',
    concern: 'Fragrance allergen',
    source: 'EU Annex III (must be declared)',
  },
  {
    name: 'Coumarin',
    aliases: [/\bcoumarin\b/i],
    category: 'allergen',
    severity: 'low',
    concern: 'Fragrance allergen; liver toxicity at high doses',
    source: 'EU Annex III; SCCS restricted',
  },
  {
    name: 'Cinnamal (Cinnamaldehyde)',
    aliases: [/\bcinnamal\b/i, /\bcinnamaldehyde\b/i],
    category: 'allergen',
    severity: 'moderate',
    concern: 'Strong fragrance allergen; high sensitization rate',
    source: 'EU Annex III; top allergen in patch testing',
  },
  {
    name: 'Isoeugenol',
    aliases: [/\bisoeugenol\b/i],
    category: 'allergen',
    severity: 'moderate',
    concern: 'Fragrance allergen; high sensitization rate',
    source: 'EU Annex III; SCCS opinion',
  },
  {
    name: 'Cocamidopropyl Betaine',
    aliases: [/\bcocamidopropyl betaine\b/i],
    category: 'allergen',
    severity: 'low',
    concern: 'Contact allergen for sensitive individuals (due to impurities)',
    source: 'ACDS Allergen of the Year 2004',
  },

  // ── IRRITANTS ────────────────────────────────────────────────────────
  {
    name: 'Sodium Hydroxide',
    aliases: [/\bsodium hydroxide\b/i],
    category: 'irritant',
    severity: 'low',
    concern: 'pH adjuster; safe at cosmetic levels but irritant at high concentrations',
    source: 'Generally recognized as safe as pH adjuster',
  },
  {
    name: 'Coal Tar',
    aliases: [/\bcoal tar\b/i],
    category: 'carcinogen',
    severity: 'high',
    concern: 'Known human carcinogen; found in some dandruff shampoos',
    source: 'IARC Group 1; Prop 65; EU restricted',
  },
  {
    name: 'Diethanolamine (DEA)',
    aliases: [/\bdiethanolamine\b/i, /\b\bdea\b\b/i],
    category: 'organ_toxin',
    severity: 'moderate',
    concern: 'Can form carcinogenic nitrosamines; liver and kidney effects',
    source: 'EU restricted; Prop 65 (nitrosamine formation)',
  },
  {
    name: 'Triethanolamine (TEA)',
    aliases: [/\btriethanolamine\b/i, /\btea\b(?=.*(?:amine|ethanol))/i],
    category: 'irritant',
    severity: 'low',
    concern: 'Can form nitrosamines; mild irritant',
    source: 'EU restricted (nitrosamine limits)',
  },
  {
    name: 'PEG compounds (Polyethylene Glycol)',
    aliases: [/\bpeg-\d+\b/i],
    category: 'irritant',
    severity: 'low',
    concern: 'May contain 1,4-dioxane (carcinogen) as manufacturing contaminant',
    source: 'FDA monitoring; depends on purification',
  },

  // ── REPRODUCTIVE TOXINS ──────────────────────────────────────────────
  {
    name: 'Toluene',
    aliases: [/\btoluene\b/i],
    category: 'reproductive_toxin',
    severity: 'high',
    concern: 'Reproductive and developmental toxin; neurotoxic',
    source: 'Prop 65; EU restricted in cosmetics',
  },
  {
    name: 'Dibutyl Phthalate (DBP)',
    aliases: [/\bdibutyl phthalate\b/i, /\bdbp\b/i],
    category: 'reproductive_toxin',
    severity: 'high',
    concern: 'Reproductive toxin; endocrine disruptor',
    source: 'EU banned in cosmetics; Prop 65',
  },
  {
    name: 'Diethylhexyl Phthalate (DEHP)',
    aliases: [/\bdiethylhexyl phthalate\b/i, /\bdehp\b/i],
    category: 'reproductive_toxin',
    severity: 'high',
    concern: 'Reproductive toxin; endocrine disruptor',
    source: 'EU banned in cosmetics; Prop 65',
  },

  // ── ENVIRONMENTAL TOXINS ─────────────────────────────────────────────
  {
    name: 'Cyclopentasiloxane (D5)',
    aliases: [/\bcyclopentasiloxane\b/i, /\bd5\b/i],
    category: 'environmental',
    severity: 'low',
    concern: 'Persistent in environment; potential bioaccumulation; EU restricted in wash-off',
    source: 'EU REACH restricted in wash-off products >0.1%',
  },
  {
    name: 'Cyclotetrasiloxane (D4)',
    aliases: [/\bcyclotetrasiloxane\b/i, /\bd4\b/i],
    category: 'environmental',
    severity: 'moderate',
    concern: 'Persistent, bioaccumulative; potential endocrine disruptor',
    source: 'EU REACH restricted; ECHA Substance of Very High Concern',
  },
  {
    name: 'Microplastics (Polyethylene beads)',
    aliases: [/\bpolyethylene\b/i, /\bpolypropylene\b/i, /\bnylon-\d+\b/i],
    category: 'environmental',
    severity: 'moderate',
    concern: 'Microplastic pollution; non-biodegradable',
    source: 'EU microbead ban (rinse-off products)',
  },

  // ── ADDITIONAL COMMON CONCERNS ───────────────────────────────────────
  {
    name: 'Formaldehyde',
    aliases: [/\bformaldehyde\b/i, /\bformalin\b/i],
    category: 'carcinogen',
    severity: 'high',
    concern: 'Known human carcinogen',
    source: 'IARC Group 1; EU Annex II banned (as intentional ingredient)',
  },
  {
    name: 'Hydroquinone',
    aliases: [/\bhydroquinone\b/i],
    category: 'carcinogen',
    severity: 'high',
    concern: 'Possible carcinogen; organ toxicity',
    source: 'EU banned in cosmetics (except professional use); Prop 65',
  },
  {
    name: 'Phenoxyethanol',
    aliases: [/\bphenoxyethanol\b/i],
    category: 'irritant',
    severity: 'low',
    concern: 'Generally safe preservative; mild irritant for some; EU restricts for infants',
    source: 'SCCS safe up to 1%; restricted for under-3 in some countries',
  },
  {
    name: 'Fragrance/Parfum (undisclosed mix)',
    aliases: [/\bfragrance\b/i, /\bparfum\b/i],
    category: 'allergen',
    severity: 'moderate',
    concern: 'Undisclosed mix may contain allergens, phthalates, or sensitizers',
    source: 'IFRA standards; EU requires allergen disclosure >threshold',
  },
  {
    name: 'Ethanolamines (MEA/DEA/TEA)',
    aliases: [/\bmonoethanolamine\b/i, /\bmea\b(?=.*amine)/i, /\bcocamide mea\b/i, /\bcocamide dea\b/i, /\blauramide dea\b/i],
    category: 'irritant',
    severity: 'low',
    concern: 'Can form nitrosamines; respiratory sensitizer',
    source: 'EU restricted (nitrosamine limits)',
  },
  {
    name: 'Propylene Glycol',
    aliases: [/\bpropylene glycol\b/i],
    category: 'irritant',
    severity: 'low',
    concern: 'Contact allergen for some; generally safe; ACDS allergen',
    source: 'ACDS Allergen of the Year 2018; safe per CIR at cosmetic levels',
  },

  // ── ADDITIONAL HAIR-CARE SPECIFIC HAZARDS ────────────────────────────
  {
    name: 'Benzene (contaminant)',
    aliases: [/\bbenzene\b/i],
    category: 'carcinogen',
    severity: 'high',
    concern: 'Known human carcinogen; sometimes found as contaminant in dry shampoos',
    source: 'IARC Group 1; FDA recalls (Unilever dry shampoo 2022)',
  },
  {
    name: 'p-Phenylenediamine (PPD)',
    aliases: [/\bp-phenylenediamine\b/i, /\bppd\b/i, /\bp-aminoaniline\b/i],
    category: 'allergen',
    severity: 'high',
    concern: 'Strong contact allergen in hair dyes; can cause severe reactions',
    source: 'EU Annex III restricted (max 2%); top contact allergen',
  },
  {
    name: 'Toluene-2,5-Diamine',
    aliases: [/\btoluene-2,5-diamine\b/i, /\btoluenediamine\b/i],
    category: 'allergen',
    severity: 'moderate',
    concern: 'Hair dye intermediate; sensitizer related to PPD',
    source: 'EU Annex III restricted',
  },
  {
    name: 'Aminophenol',
    aliases: [/\baminophenol\b/i, /\bp-aminophenol\b/i, /\bm-aminophenol\b/i],
    category: 'irritant',
    severity: 'moderate',
    concern: 'Hair dye ingredient; skin sensitizer; possible mutagenic activity',
    source: 'EU Annex III restricted',
  },
  {
    name: 'Sodium Borate (Borax)',
    aliases: [/\bsodium borate\b/i, /\bborax\b/i],
    category: 'reproductive_toxin',
    severity: 'moderate',
    concern: 'Reproductive toxin; EU restricted in cosmetics',
    source: 'EU CMR Category 1B; REACH restricted',
  },
  {
    name: 'Chlorhexidine',
    aliases: [/\bchlorhexidine\b/i],
    category: 'allergen',
    severity: 'moderate',
    concern: 'Can cause severe allergic reactions including anaphylaxis',
    source: 'FDA warning 2017; EU Annex III restricted',
  },
  {
    name: 'Benzophenone-1',
    aliases: [/\bbenzophenone-1\b/i, /\bbenzophenone 1\b/i],
    category: 'endocrine_disruptor',
    severity: 'moderate',
    concern: 'Estrogenic activity; potential thyroid disruptor',
    source: 'TEDX list; EU Annex III',
  },
  {
    name: 'Benzophenone-2',
    aliases: [/\bbenzophenone-2\b/i, /\bbenzophenone 2\b/i],
    category: 'endocrine_disruptor',
    severity: 'moderate',
    concern: 'Anti-estrogenic and anti-androgenic activity',
    source: 'TEDX list; restricted in several countries',
  },
  {
    name: 'Cyclohexasiloxane (D6)',
    aliases: [/\bcyclohexasiloxane\b/i, /\bd6\b/i],
    category: 'environmental',
    severity: 'low',
    concern: 'Persistent in environment; potential bioaccumulation',
    source: 'EU REACH under evaluation',
  },
  {
    name: 'Octamethylcyclotetrasiloxane',
    aliases: [/\boctamethylcyclotetrasiloxane\b/i],
    category: 'environmental',
    severity: 'moderate',
    concern: 'Persistent, bioaccumulative; endocrine disruption concerns',
    source: 'EU REACH Substance of Very High Concern candidate',
  },
  {
    name: 'EDTA (Disodium EDTA)',
    aliases: [/\bedta\b/i, /\bdisodium edta\b/i, /\btetrasodium edta\b/i],
    category: 'environmental',
    severity: 'low',
    concern: 'Not biodegradable; chelates heavy metals in waterways',
    source: 'Environmental concern; safe for human use per CIR',
  },
  {
    name: 'Retinyl Palmitate',
    aliases: [/\bretinyl palmitate\b/i, /\bretinol\b/i],
    category: 'reproductive_toxin',
    severity: 'moderate',
    concern: 'Vitamin A derivative; reproductive concerns at high doses; photosensitizing',
    source: 'NTP study; Prop 65 (retinoid acids); EU restricted in cosmetics',
  },
  {
    name: 'Lead Acetate',
    aliases: [/\blead acetate\b/i],
    category: 'carcinogen',
    severity: 'high',
    concern: 'Neurotoxic heavy metal; formerly used in progressive hair dyes',
    source: 'FDA banned 2018; EU Annex II',
  },
  {
    name: 'Mercury (Thimerosal)',
    aliases: [/\bthimerosal\b/i, /\bmercury\b/i, /\bmerthiolate\b/i],
    category: 'organ_toxin',
    severity: 'high',
    concern: 'Neurotoxic; banned in cosmetics',
    source: 'EU Annex II banned; FDA restricted; Minamata Convention',
  },
  {
    name: 'Acrylates Copolymer',
    aliases: [/\bacrylates copolymer\b/i, /\bacrylates\/c10-30\b/i],
    category: 'environmental',
    severity: 'low',
    concern: 'Microplastic polymer; persistent in environment',
    source: 'ECHA microplastic restriction proposal',
  },
  {
    name: 'Carbomer',
    aliases: [/\bcarbomer\b/i],
    category: 'environmental',
    severity: 'low',
    concern: 'Synthetic polymer (microplastic); may contain residual benzene',
    source: 'ECHA microplastic restriction proposal; generally safe for human use',
  },
]

/**
 * Human-readable explanation of how the Health Score is calculated.
 * Display this in the UI to build trust and transparency.
 */
export const HEALTH_SCORE_EXPLAINER = {
  title: 'How the Health Score Works',
  description: 'The Health Score rates ingredient safety on a 0–100 scale using publicly available regulatory and scientific data. It is independent of the Scrunch (CG) Score.',
  methodology: [
    'Every product starts at 100 points.',
    'Points are deducted for each ingredient flagged by regulatory bodies or scientific research.',
    'Deductions are weighted by severity: high-concern (−15), moderate (−8), low (−3).',
    'Ingredient list position matters: ingredients listed earlier are present in higher concentrations, so their deductions are amplified (up to 1.5×).',
    'Ingredients listed near the end (position 20+) receive reduced deductions (0.6×) as they are present in trace amounts.',
  ],
  sources: [
    'EU Cosmetics Regulation Annex II (banned substances) & Annex III (restricted)',
    'IARC — International Agency for Research on Cancer (carcinogen classifications)',
    'California Proposition 65 (known carcinogens & reproductive toxins)',
    'TEDX — The Endocrine Disruption Exchange (endocrine disruptors)',
    'SCCS — EU Scientific Committee on Consumer Safety (safety opinions)',
    'EU REACH regulation (Substances of Very High Concern)',
  ],
  disclaimer: 'This score reflects potential ingredient concerns based on published research and regulatory data. It is not a medical assessment. A lower score means more flagged ingredients were found — not that a product is unsafe at normal use levels. Concentration, formulation, and individual sensitivity all matter.',
} as const
