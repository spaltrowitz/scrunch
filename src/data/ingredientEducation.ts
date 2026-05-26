/**
 * Curated ingredient education data for common hair care ingredients.
 * Each entry explains what an ingredient does and why it matters for curly hair.
 */

export interface IngredientEducation {
  /** Display name */
  name: string
  /** Alternative names this ingredient might appear as */
  aliases: string[]
  /** Functional category */
  category: 'silicone' | 'sulfate' | 'humectant' | 'protein' | 'oil' | 'preservative' | 'conditioning_agent' | 'surfactant' | 'emollient' | 'film_former' | 'drying_alcohol' | 'fatty_alcohol' | 'wax' | 'botanical' | 'other'
  /** One-sentence explanation of what it does */
  whatItDoes: string
  /** Why curly-haired people should care */
  whyItMatters: string
  /** CG Method verdict */
  cgmVerdict: 'approved' | 'not_approved' | 'caution' | 'depends'
  /** Practical tip for the user */
  tip: string
}

export const INGREDIENT_EDUCATION: IngredientEducation[] = [
  // --- SILICONES ---
  {
    name: 'Dimethicone',
    aliases: ['dimethicone', 'polydimethylsiloxane'],
    category: 'silicone',
    whatItDoes: 'Creates a waterproof coating on hair strands for smoothness and shine.',
    whyItMatters: 'Builds up over time and can only be removed with sulfates — blocks moisture from entering the hair shaft.',
    cgmVerdict: 'not_approved',
    tip: 'If you\'ve been using dimethicone products, do a clarifying wash before starting CGM.',
  },
  {
    name: 'Cyclomethicone',
    aliases: ['cyclomethicone', 'cyclopentasiloxane', 'cyclotetrasiloxane'],
    category: 'silicone',
    whatItDoes: 'A lightweight, volatile silicone that evaporates quickly — used as a carrier for other ingredients.',
    whyItMatters: 'While it evaporates, it can still leave residual silicones behind. Most CGM followers avoid it.',
    cgmVerdict: 'not_approved',
    tip: 'Often found in heat protectants and serums.',
  },
  {
    name: 'Amodimethicone',
    aliases: ['amodimethicone', 'amino functional silicone'],
    category: 'silicone',
    whatItDoes: 'A modified silicone that selectively deposits on damaged areas of hair.',
    whyItMatters: 'Some curlies consider it "less bad" because it targets damage rather than coating everything, but it still builds up.',
    cgmVerdict: 'not_approved',
    tip: 'Controversial in the CGM community — some modified-CGM followers allow it.',
  },
  {
    name: 'PEG-Modified Dimethicone',
    aliases: ['peg-dimethicone', 'peg-12 dimethicone', 'peg-8 dimethicone', 'bis-peg-12 dimethicone'],
    category: 'silicone',
    whatItDoes: 'A water-soluble silicone that provides slip and shine without permanent buildup.',
    whyItMatters: 'Can be washed out with gentle cleansers (no sulfates needed). Generally considered CGM-safe.',
    cgmVerdict: 'caution',
    tip: 'Look for "PEG-" or "PPG-" before "dimethicone" — that means water-soluble.',
  },

  // --- SULFATES ---
  {
    name: 'Sodium Lauryl Sulfate (SLS)',
    aliases: ['sodium lauryl sulfate', 'sls'],
    category: 'sulfate',
    whatItDoes: 'A strong surfactant that creates heavy lather and strips oils and product buildup.',
    whyItMatters: 'Too harsh for curly hair — strips natural oils that curls desperately need for moisture and definition.',
    cgmVerdict: 'not_approved',
    tip: 'This is the main ingredient CGM tells you to avoid in daily shampoos.',
  },
  {
    name: 'Sodium Laureth Sulfate (SLES)',
    aliases: ['sodium laureth sulfate', 'sles'],
    category: 'sulfate',
    whatItDoes: 'A milder version of SLS that still creates good lather, but less stripping.',
    whyItMatters: 'Still considered too harsh for regular use on curly hair, though slightly gentler than SLS.',
    cgmVerdict: 'not_approved',
    tip: 'Often in "gentle" shampoos but still not CGM-friendly for regular use.',
  },
  {
    name: 'Sodium Coco-Sulfate',
    aliases: ['sodium coco-sulfate', 'sodium coco sulfate'],
    category: 'sulfate',
    whatItDoes: 'A coconut-derived surfactant that cleanses gently with moderate lather.',
    whyItMatters: 'Milder than SLS/SLES. Some CGM followers use it for clarifying, others avoid all sulfates.',
    cgmVerdict: 'caution',
    tip: 'Acceptable for occasional clarifying washes if your hair tolerates it.',
  },
  {
    name: 'Cocamidopropyl Betaine',
    aliases: ['cocamidopropyl betaine', 'coco betaine'],
    category: 'surfactant',
    whatItDoes: 'A gentle, coconut-derived surfactant that creates mild foam without stripping.',
    whyItMatters: 'The go-to cleanser in CGM-approved shampoos — effective yet gentle enough for curly hair.',
    cgmVerdict: 'approved',
    tip: 'This is what you want to see in your low-poo shampoo.',
  },
  {
    name: 'Decyl Glucoside',
    aliases: ['decyl glucoside', 'decyl polyglucose'],
    category: 'surfactant',
    whatItDoes: 'A plant-derived, ultra-gentle surfactant from glucose and coconut/corn.',
    whyItMatters: 'One of the mildest cleansers available — great for sensitive scalps and very dry curly hair.',
    cgmVerdict: 'approved',
    tip: 'Common in baby shampoos and sensitive scalp formulas.',
  },

  // --- HUMECTANTS ---
  {
    name: 'Glycerin',
    aliases: ['glycerin', 'glycerine', 'vegetable glycerin'],
    category: 'humectant',
    whatItDoes: 'Draws moisture from the air into your hair, keeping it hydrated.',
    whyItMatters: 'Amazing in moderate humidity. In very high humidity it can cause frizz; in very low humidity it can pull moisture OUT of hair.',
    cgmVerdict: 'approved',
    tip: 'Check the dew point: glycerin works best when humidity is 40-60%. Too high or too low = frizz.',
  },
  {
    name: 'Aloe Vera',
    aliases: ['aloe barbadensis', 'aloe vera', 'aloe barbadensis leaf juice', 'aloe leaf extract'],
    category: 'humectant',
    whatItDoes: 'A natural humectant and soothing agent that provides lightweight moisture and reduces scalp irritation.',
    whyItMatters: 'Lightweight hydration without weighing down curls. Also helps define curl clumps.',
    cgmVerdict: 'approved',
    tip: 'Aloe gel makes a great DIY curl refresher mixed with water.',
  },
  {
    name: 'Honey',
    aliases: ['honey', 'mel', 'honey extract'],
    category: 'humectant',
    whatItDoes: 'A natural humectant that attracts and seals in moisture, with natural antioxidants.',
    whyItMatters: 'Adds softness and shine to curls. Similar humidity concerns as glycerin.',
    cgmVerdict: 'approved',
    tip: 'Great in deep conditioners. Be aware it can lighten hair slightly over time with sun exposure.',
  },
  {
    name: 'Panthenol',
    aliases: ['panthenol', 'pro-vitamin b5', 'provitamin b-5', 'd-panthenol'],
    category: 'humectant',
    whatItDoes: 'Penetrates the hair shaft and attracts moisture, adding flexibility and strength.',
    whyItMatters: 'One of the few ingredients that actually penetrates hair — adds elasticity and reduces breakage.',
    cgmVerdict: 'approved',
    tip: 'A curly hair superstar. Look for it in leave-ins and deep conditioners.',
  },
  {
    name: 'Hyaluronic Acid',
    aliases: ['hyaluronic acid', 'sodium hyaluronate'],
    category: 'humectant',
    whatItDoes: 'Holds up to 1000x its weight in water — a powerful moisture magnet.',
    whyItMatters: 'Newer in hair care but excellent for lightweight deep hydration without heaviness.',
    cgmVerdict: 'approved',
    tip: 'Best applied to damp hair so it has water to bind to.',
  },

  // --- PROTEINS ---
  {
    name: 'Hydrolyzed Keratin',
    aliases: ['hydrolyzed keratin', 'keratin'],
    category: 'protein',
    whatItDoes: 'Broken-down protein that fills gaps in damaged hair cuticles, reinforcing structure.',
    whyItMatters: 'Strengthens over-processed or high-porosity hair. But too much protein on protein-sensitive hair causes brittleness.',
    cgmVerdict: 'approved',
    tip: 'If your hair feels straw-like after protein treatments, you may be protein-sensitive — switch to moisture-only products.',
  },
  {
    name: 'Hydrolyzed Silk',
    aliases: ['hydrolyzed silk', 'silk amino acids', 'silk protein'],
    category: 'protein',
    whatItDoes: 'A lightweight protein that smooths the cuticle and adds shine without stiffness.',
    whyItMatters: 'One of the gentlest proteins — less likely to cause overload than keratin or wheat protein.',
    cgmVerdict: 'approved',
    tip: 'Good option if you\'re protein-sensitive but still want some strengthening.',
  },
  {
    name: 'Hydrolyzed Wheat Protein',
    aliases: ['hydrolyzed wheat protein', 'wheat protein', 'wheat amino acids'],
    category: 'protein',
    whatItDoes: 'Penetrates the hair cortex and adds volume by swelling the hair shaft slightly.',
    whyItMatters: 'Adds body and strength. Can be too much for fine hair or protein-sensitive curls.',
    cgmVerdict: 'approved',
    tip: 'Contains gluten — relevant if you have celiac and touch your hair frequently before eating.',
  },
  {
    name: 'Hydrolyzed Rice Protein',
    aliases: ['hydrolyzed rice protein', 'rice protein', 'rice amino acids'],
    category: 'protein',
    whatItDoes: 'A lightweight protein that improves elasticity and adds shine without heaviness.',
    whyItMatters: 'One of the best proteins for fine curly hair — strengthens without weighing down.',
    cgmVerdict: 'approved',
    tip: 'Rice water rinses are popular in CGM for a reason — this is the science behind it.',
  },

  // --- FATTY ALCOHOLS (the good ones) ---
  {
    name: 'Cetyl Alcohol',
    aliases: ['cetyl alcohol'],
    category: 'fatty_alcohol',
    whatItDoes: 'A waxy fatty alcohol that smooths the cuticle and adds slip for detangling.',
    whyItMatters: 'NOT a drying alcohol! Fatty alcohols are curly hair\'s best friend — they condition and smooth without stripping.',
    cgmVerdict: 'approved',
    tip: 'Don\'t confuse with isopropyl or denatured alcohol. "Cetyl" and "cetearyl" = good alcohols.',
  },
  {
    name: 'Cetearyl Alcohol',
    aliases: ['cetearyl alcohol', 'cetostearyl alcohol'],
    category: 'fatty_alcohol',
    whatItDoes: 'A blend of cetyl and stearyl alcohols — emulsifies and conditions hair.',
    whyItMatters: 'Makes conditioners creamy and provides slip. Essential for detangling curly hair.',
    cgmVerdict: 'approved',
    tip: 'This is why your conditioner feels silky. It\'s one of the most common (and best) conditioning ingredients.',
  },

  // --- DRYING ALCOHOLS (the bad ones) ---
  {
    name: 'Isopropyl Alcohol',
    aliases: ['isopropyl alcohol', 'isopropanol'],
    category: 'drying_alcohol',
    whatItDoes: 'Evaporates quickly, used to help products dry faster or as a solvent.',
    whyItMatters: 'Strips moisture from already-dry curly hair. Makes hair brittle and frizzy.',
    cgmVerdict: 'not_approved',
    tip: 'Common in hairsprays and some gels. Check for it even in products labeled "curl-friendly."',
  },
  {
    name: 'Alcohol Denat',
    aliases: ['alcohol denat', 'denatured alcohol', 'sd alcohol'],
    category: 'drying_alcohol',
    whatItDoes: 'A fast-evaporating solvent that helps products absorb quickly and dry without residue.',
    whyItMatters: 'Dries out curly hair with repeated use. Especially problematic for high-porosity hair that already loses moisture easily.',
    cgmVerdict: 'not_approved',
    tip: 'If it\'s in the first 5 ingredients, the concentration is high enough to be damaging.',
  },

  // --- OILS & EMOLLIENTS ---
  {
    name: 'Coconut Oil',
    aliases: ['cocos nucifera', 'coconut oil', 'cocos nucifera oil'],
    category: 'oil',
    whatItDoes: 'One of the few oils that penetrates the hair shaft, reducing protein loss during washing.',
    whyItMatters: 'Great for high-porosity hair. BUT can cause buildup/heaviness on low-porosity or fine hair.',
    cgmVerdict: 'approved',
    tip: 'Low-porosity curlies: use sparingly or only as a pre-poo. It can sit on top and make hair feel waxy.',
  },
  {
    name: 'Argan Oil',
    aliases: ['argania spinosa kernel oil', 'argan oil'],
    category: 'oil',
    whatItDoes: 'A lightweight oil rich in vitamin E and fatty acids that adds shine and tames frizz.',
    whyItMatters: 'Light enough for most curl types. Provides frizz control without the weight of heavier oils.',
    cgmVerdict: 'approved',
    tip: 'Works great as a finishing oil scrunched into dry curls.',
  },
  {
    name: 'Jojoba Oil',
    aliases: ['simmondsia chinensis', 'jojoba oil', 'simmondsia chinensis seed oil'],
    category: 'oil',
    whatItDoes: 'Technically a liquid wax that mimics the hair\'s natural sebum.',
    whyItMatters: 'Balances scalp oil production and seals moisture without heaviness. Good for all porosity types.',
    cgmVerdict: 'approved',
    tip: 'One of the few oils that works well for low-porosity hair.',
  },
  {
    name: 'Castor Oil',
    aliases: ['ricinus communis', 'castor oil', 'ricinus communis seed oil'],
    category: 'oil',
    whatItDoes: 'A thick, viscous oil that seals in moisture and is believed to support hair growth.',
    whyItMatters: 'Great for sealing in high-porosity hair and edges. Too heavy for fine hair as a leave-in.',
    cgmVerdict: 'approved',
    tip: 'Mix with a lighter oil for easier application. Popular for edge care and scalp massage.',
  },
  {
    name: 'Mineral Oil',
    aliases: ['mineral oil', 'paraffinum liquidum', 'liquid paraffin'],
    category: 'wax',
    whatItDoes: 'A petroleum-derived oil that creates a strong moisture barrier on hair.',
    whyItMatters: 'Blocks moisture from entering or leaving the hair shaft. Requires sulfates to remove — creates a dependency cycle.',
    cgmVerdict: 'not_approved',
    tip: 'Often found in cheaper hair oils and anti-frizz serums. Check those bargain products!',
  },
  {
    name: 'Petrolatum',
    aliases: ['petrolatum', 'petroleum jelly', 'vaseline'],
    category: 'wax',
    whatItDoes: 'An occlusive that creates a waterproof seal, preventing moisture loss.',
    whyItMatters: 'Same issue as mineral oil — impenetrable barrier that needs sulfates to wash out.',
    cgmVerdict: 'not_approved',
    tip: 'Sometimes hidden in "hair grease" products marketed to textured hair.',
  },

  // --- CONDITIONING AGENTS ---
  {
    name: 'Behentrimonium Methosulfate',
    aliases: ['behentrimonium methosulfate', 'btms'],
    category: 'conditioning_agent',
    whatItDoes: 'A conditioning emulsifier derived from rapeseed oil — provides intense slip and detangling.',
    whyItMatters: 'Despite having "sulfate" in the name, this is NOT a sulfate cleanser. It\'s one of the best conditioning agents for curly hair.',
    cgmVerdict: 'approved',
    tip: 'Don\'t be scared by the name! BTMS is a curly hair hero ingredient.',
  },
  {
    name: 'Cetrimonium Chloride',
    aliases: ['cetrimonium chloride'],
    category: 'conditioning_agent',
    whatItDoes: 'An anti-static conditioning agent that smooths the cuticle and reduces tangles.',
    whyItMatters: 'Provides slip for detangling and reduces flyaways. Common in rinse-out and leave-in conditioners.',
    cgmVerdict: 'approved',
    tip: 'A workhorse in conditioners — this is what gives you that "my comb slides through" feeling.',
  },
  {
    name: 'Polyquaternium-10',
    aliases: ['polyquaternium-10', 'polyquat-10'],
    category: 'conditioning_agent',
    whatItDoes: 'A film-forming conditioning polymer that provides hold and smoothness.',
    whyItMatters: 'Water-soluble, so it washes out easily. Adds soft hold and conditioning — common in CGM products.',
    cgmVerdict: 'approved',
    tip: 'The "polyquaternium" family (7, 10, 37, etc.) are generally CGM-safe and provide varying hold levels.',
  },

  // --- FILM FORMERS & HOLD ---
  {
    name: 'Flaxseed Extract',
    aliases: ['linum usitatissimum', 'flaxseed', 'flax seed extract', 'linseed'],
    category: 'film_former',
    whatItDoes: 'A natural gel-former that provides flexible hold and moisture simultaneously.',
    whyItMatters: 'One of the best natural hold agents for curly hair — gives definition without crunch.',
    cgmVerdict: 'approved',
    tip: 'You can even make DIY flaxseed gel at home — it\'s a CGM staple.',
  },
  {
    name: 'Xanthan Gum',
    aliases: ['xanthan gum'],
    category: 'film_former',
    whatItDoes: 'A natural thickener and film-former that adds slip and light hold.',
    whyItMatters: 'Creates a humidity-resistant film on curls — helps definition last in frizzy conditions.',
    cgmVerdict: 'approved',
    tip: 'Common in "clean" or natural-ingredient gels.',
  },

  // --- PRESERVATIVES ---
  {
    name: 'Phenoxyethanol',
    aliases: ['phenoxyethanol'],
    category: 'preservative',
    whatItDoes: 'A broad-spectrum preservative that prevents bacterial and fungal growth in products.',
    whyItMatters: 'Safe and CGM-approved. A necessary evil — without preservatives, your products would spoil in days.',
    cgmVerdict: 'approved',
    tip: 'This replaced parabens in most modern formulas. Generally well-tolerated.',
  },

  // --- BOTANICALS ---
  {
    name: 'Shea Butter',
    aliases: ['butyrospermum parkii', 'shea butter', 'butyrospermum parkii butter'],
    category: 'botanical',
    whatItDoes: 'A rich, natural butter that deeply moisturizes and seals the cuticle.',
    whyItMatters: 'Excellent for thick, coarse, or high-porosity curls. Can be too heavy for fine or low-porosity hair.',
    cgmVerdict: 'approved',
    tip: 'Amazing in curl creams. If it weighs you down, look for it lower in the ingredient list (= less concentrated).',
  },
  {
    name: 'Avocado Oil',
    aliases: ['persea gratissima', 'avocado oil', 'persea gratissima oil'],
    category: 'oil',
    whatItDoes: 'A nutrient-rich oil with fatty acids and vitamins that penetrates the hair shaft.',
    whyItMatters: 'One of the few oils (like coconut) that can actually get inside the hair. Great for damaged or high-porosity curls.',
    cgmVerdict: 'approved',
    tip: 'Heavier than argan but lighter than castor — a good middle-ground oil.',
  },

  // --- OTHER COMMON INGREDIENTS ---
  {
    name: 'Water',
    aliases: ['water', 'aqua', 'eau'],
    category: 'other',
    whatItDoes: 'The base solvent and primary hydrator in almost every hair product.',
    whyItMatters: 'When water is the first ingredient, the product is water-based (lightweight). Curly hair loves water-based products.',
    cgmVerdict: 'approved',
    tip: 'Always apply products to wet/damp hair — water is the #1 moisturizer.',
  },
  {
    name: 'Carbomer',
    aliases: ['carbomer', 'carbomer 940', 'carbomer 934'],
    category: 'other',
    whatItDoes: 'A synthetic thickener that gives gels their gel-like consistency.',
    whyItMatters: 'Completely inert and CGM-safe. It\'s just there for texture — no effect on your hair.',
    cgmVerdict: 'approved',
    tip: 'If you see this, you\'re looking at a gel or gel-cream formula.',
  },
]

/**
 * Look up education data for a given ingredient string.
 * Matches against aliases using case-insensitive substring matching.
 */
export function findIngredientEducation(ingredientName: string): IngredientEducation | null {
  const lower = ingredientName.toLowerCase().trim()
  for (const entry of INGREDIENT_EDUCATION) {
    for (const alias of entry.aliases) {
      if (lower.includes(alias.toLowerCase()) || alias.toLowerCase().includes(lower)) {
        return entry
      }
    }
  }
  return null
}

/** Category display labels */
export const INGREDIENT_CATEGORY_LABELS: Record<IngredientEducation['category'], string> = {
  silicone: 'Silicone',
  sulfate: 'Sulfate',
  humectant: 'Humectant',
  protein: 'Protein',
  oil: 'Oil',
  preservative: 'Preservative',
  conditioning_agent: 'Conditioning Agent',
  surfactant: 'Surfactant',
  emollient: 'Emollient',
  film_former: 'Film Former',
  drying_alcohol: 'Drying Alcohol',
  fatty_alcohol: 'Fatty Alcohol',
  wax: 'Wax/Mineral Oil',
  botanical: 'Botanical',
  other: 'Other',
}
