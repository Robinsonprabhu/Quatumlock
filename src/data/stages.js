import { DEFAULT_20_QUESTIONS } from '../../server/defaultQuestions.js';

export const TOTAL_TIME_SECONDS = 60 * 60; // 1 hour per session

const stagesObj = {};
const all30ForStages = DEFAULT_20_QUESTIONS.map((q, idx) => {
  const levelKey = `level_${idx + 1}`;
  const stageItem = {
    id: idx + 1,
    key: levelKey,
    name: q.title,
    title: q.title,
    subtitle: q.subtitle,
    category: q.category,
    difficulty: q.difficulty,
    investigationType: q.investigationType,
    story: q.story,
    codeLines: q.codeLines,
    question: q.question,
    hints: q.hints,
    fragment: q.fragment || (idx + 1),
    originalId: q.id,
    evidenceTitle: q.evidenceTitle,
    consequence: q.consequence,
    keywords: q.keywords
  };
  stagesObj[levelKey] = stageItem;
  return stageItem;
});

export const ALL_20_QUESTIONS = all30ForStages;
export const STAGES = stagesObj;

export const PARTS = [
  {
    "id": 1,
    "title": "SESSION 1: THE LOWER DUNGEONS & INNER SECTORS",
    "description": "Chambers 1 through 15 of the Battleworld Protocol (1 Hour)",
    "levelKeys": [
      "level_1", "level_2", "level_3", "level_4", "level_5",
      "level_6", "level_7", "level_8", "level_9", "level_10",
      "level_11", "level_12", "level_13", "level_14", "level_15"
    ]
  },
  {
    "id": 2,
    "title": "SESSION 2: THE ROYAL CITADEL & MASTER ARCHIVES",
    "description": "Chambers 16 through 30 of the Battleworld Protocol (1 Hour)",
    "levelKeys": [
      "level_16", "level_17", "level_18", "level_19", "level_20",
      "level_21", "level_22", "level_23", "level_24", "level_25",
      "level_26", "level_27", "level_28", "level_29", "level_30"
    ]
  }
];

export const STAGE_INTRO_DIALOGUES = {
  "level_1": "Analyze incoming authorization credentials to override Room 01.",
  "level_2": "Transmission loop active. Identify the continuous control mechanism.",
  "level_3": "Storage compartments partitioned in numbered offset blocks.",
  "level_4": "Weapon silo operates strictly under first-in last-out rules.",
  "level_5": "Decontamination corridor regulates chronological passage sequence.",
  "level_6": "Scattered archive records require systematic reordering.",
  "level_7": "Sequential sensor sweep scanning security event records.",
  "level_8": "Partitioned search bounds isolate coordinate sectors.",
  "level_9": "Harmonic decryption routines execute self-referential subroutines.",
  "level_10": "Unique record constraint identifies combatant profiles.",
  "level_11": "Subsystem blueprints derive attributes from base architectures.",
  "level_12": "Uniform method triggers distinct behavioral responses.",
  "level_13": "Private attributes shielded behind controlled access methods.",
  "level_14": "Mutual hold-and-wait condition freezes transport droids.",
  "level_15": "Memory architecture partitions virtual space into hardware frames.",
  "level_16": "Wavefront sensor traverses adjacent sectors level by level.",
  "level_17": "Exploration probe pursues deepest branches before returning.",
  "level_18": "Ancient transmission shifts character offsets uniformly.",
  "level_19": "Differential logic conduit masks bits based on equality.",
  "level_20": "Flexible NoSQL datastore retains unstructured records.",
  "level_21": "Pointer references chain non-contiguous memory allocations.",
  "level_22": "Hierarchical node structure branches into at most two paths.",
  "level_23": "Mathematical mapping computes instant key-value bucket lookups.",
  "level_24": "Systematic normalization rules eliminate database redundancy.",
  "level_25": "Lightweight execution units share memory concurrently.",
  "level_26": "Integer counters with wait and signal control resource access.",
  "level_27": "Priority queue relaxation calculates optimal path routes.",
  "level_28": "System interfaces hide complex low-level implementation details.",
  "level_29": "High-speed temporary memory buffer retains recent CPU requests.",
  "level_30": "Relational field links tables to enforce referential integrity."
};
