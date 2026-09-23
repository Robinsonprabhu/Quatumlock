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
  "level_1": "Analyze the conditional logic gate to breach Room 01.",
  "level_2": "Signal looping endlessly. Identify the repetition mechanism.",
  "level_3": "Storage cells indexed in numbered array blocks.",
  "level_4": "Weapon silo operates strictly on LIFO stack access.",
  "level_5": "Decontamination triage queue operates FIFO protocol.",
  "level_6": "Archive catalog requires systematic sorting order.",
  "level_7": "Sequential scan required for linear target discovery.",
  "level_8": "Logarithmic division isolates sorted sector coordinates.",
  "level_9": "Decryption loop invokes self-similar recursive functions.",
  "level_10": "Unique relational primary key constraint identifies records.",
  "level_11": "Subclass inherits attributes from the base class blueprint.",
  "level_12": "Polymorphic dispatch produces distinct class responses.",
  "level_13": "Encapsulated private attributes shielded from external tampering.",
  "level_14": "Circular resource lock creates permanent execution deadlock.",
  "level_15": "Paging architecture maps virtual memory to physical frames.",
  "level_16": "Breadth-first search traverses adjacent neighbors level by level.",
  "level_17": "Depth-first search dives deep along branch exploration paths.",
  "level_18": "Caesar substitution cipher shifts characters by uniform offset.",
  "level_19": "Bitwise XOR mask switches matching and differing bits.",
  "level_20": "MongoDB document stores flexible schema-less key-value pairs.",
  "level_21": "Pointer references chain scattered dynamic memory nodes.",
  "level_22": "Hierarchical node structure restricts each parent to two children.",
  "level_23": "Mathematical hash functions map keys for instant O(1) lookups.",
  "level_24": "Systematic normal forms eliminate data redundancy and anomalies.",
  "level_25": "Lightweight execution threads share process memory concurrently.",
  "level_26": "Counting semaphores coordinate shared resource access.",
  "level_27": "Greedy edge relaxation finds optimal weighted shortest paths.",
  "level_28": "Abstract interfaces hide internal implementation complexity.",
  "level_29": "High-speed cache memory stores recently accessed instructions.",
  "level_30": "Foreign key relationships enforce referential integrity."
};
