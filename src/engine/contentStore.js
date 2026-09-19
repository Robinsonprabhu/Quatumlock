import { PARTS as DEFAULT_PARTS, STAGES as DEFAULT_STAGES, STAGE_INTRO_DIALOGUES as DEFAULT_STAGE_INTRO_DIALOGUES, TOTAL_TIME_SECONDS as DEFAULT_TOTAL_TIME } from '../data/stages';
import { QUESTION_POOLS as DEFAULT_QUESTION_POOLS } from '../data/questionPools';
import { LEVEL_DIALOGUES as DEFAULT_LEVEL_DIALOGUES, CINEMATIC_EVENTS as DEFAULT_CINEMATIC_EVENTS } from '../data/doomDialogue';

const STORAGE_KEY = 'DOOMSDAY_ADMIN_CONTENT_V1';

const DEFAULT_DOOM_QUOTES = [
  "\"Arre, welcome to Level 1! Let's see if you can solve Doctor Doom's network probe!\"",
  "\"Level 2 already? Don't be overconfident, do the CPU calculation properly!\"",
  "\"Level 3: Loop iteration! Count carefully, don't make a simple calculation mistake!\"",
  "\"Level 4: Memory Cache Controller! Calculate the hit rate properly!\"",
  "\"Level 5: Binary tree depth! Solve 2^d - 1 = 15 to unlock Part 2!\"",
  "\"Part 2 begins! Level 6: Circular buffer modulo arithmetic... calculate remainder!\"",
  "\"Level 7: Stack Operations! What is at the top of the stack after pops?\"",
  "\"Level 8: Logic circuit truth table! Output for input 1 and 0?\"",
  "\"Level 9: Array memory address! Base 1000 + 5 × 4... calculate!\"",
  "\"LEVEL 10: DOOMSDAY CORE! Trace my central loop if you dare!\""
];

const DEFAULT_TICKER_MESSAGES = [
  "⚠ LATVERIA-NET SECURITY ALERT  ∙∙∙  UNAUTHORIZED ACCESS DETECTED  ∙∙∙  TRACING INFILTRATION VECTOR  ∙∙∙  DOOM CORE OPERATIONAL  ∙∙∙  DOOMSDAY PROTOCOL T-MINUS ACTIVE  ∙∙∙  ALL AGENTS ON HIGH ALERT  ∙∙∙  LATVERIA-NET FIREWALL ENGAGED  ∙∙∙  BREACH CONTAINMENT IN PROGRESS  ∙∙∙"
];

const DEFAULT_SOLUTIONS = {
  "level_1": {
    "keywords": [
      "STACK",
      "LIFO",
      "PUSH",
      "POP"
    ],
    "fragment": 1,
    "evidenceTitle": "LIFO Restraint Cabinet Blueprint",
    "successNote": "Room 1 cleared! Stack verified."
  },
  "level_2": {
    "keywords": [
      "QUEUE",
      "FIFO",
      "ENQUEUE",
      "DEQUEUE"
    ],
    "fragment": 2,
    "evidenceTitle": "FIFO Evacuation Channel Blueprint",
    "successNote": "Room 2 cleared! Queue verified."
  },
  "level_3": {
    "keywords": [
      "LINKED LIST",
      "LINKEDLIST",
      "NODE",
      "HEAD",
      "NEXT"
    ],
    "fragment": 3,
    "evidenceTitle": "Linked Relic Chain Blueprint",
    "successNote": "Room 3 cleared! Linked List verified."
  },
  "level_4": {
    "keywords": [
      "BINARY TREE",
      "BINARYTREE",
      "TREE",
      "ROOT",
      "LEFT",
      "RIGHT",
      "BST"
    ],
    "fragment": 4,
    "evidenceTitle": "Binary Genealogy Tree Blueprint",
    "successNote": "Room 4 cleared! Binary Tree verified."
  },
  "level_5": {
    "keywords": [
      "BFS",
      "BREADTH FIRST SEARCH",
      "BREADTH-FIRST",
      "GRAPH",
      "QUEUE",
      "TRAVERSAL"
    ],
    "fragment": 5,
    "evidenceTitle": "Breadth-First Rescue Map",
    "successNote": "Room 5 cleared! BFS verified."
  },
  "level_6": {
    "keywords": [
      "DIJKSTRA",
      "DIJKSTRAS",
      "DIJKSTRA'S",
      "SHORTEST PATH",
      "WEIGHTED GRAPH",
      "RELAXATION"
    ],
    "fragment": 6,
    "evidenceTitle": "Weighted Shortest-Path Map",
    "successNote": "Room 6 cleared! Dijkstra verified."
  },
  "level_7": {
    "keywords": [
      "RECURSION",
      "RECURSIVE",
      "FUNCTION",
      "BASE CASE",
      "CALL"
    ],
    "fragment": 7,
    "evidenceTitle": "Recursive Clock Mechanism",
    "successNote": "Room 7 cleared! Recursion verified."
  },
  "level_8": {
    "keywords": [
      "GREEDY",
      "GREEDY ALGORITHM",
      "LOCAL OPTIMUM",
      "ALGORITHM",
      "SELECTION"
    ],
    "fragment": 8,
    "evidenceTitle": "Greedy Resource Selection Blueprint",
    "successNote": "Room 8 cleared! Greedy verified."
  },
  "level_9": {
    "keywords": [
      "TRANSACTION",
      "COMMIT",
      "ROLLBACK",
      "DATABASE",
      "ATOMIC",
      "ACID"
    ],
    "fragment": 9,
    "evidenceTitle": "Atomic Mission Transaction Log",
    "successNote": "Room 9 cleared! Transaction verified."
  },
  "level_10": {
    "keywords": [
      "NORMALIZATION",
      "NORMALIZE",
      "DATABASE",
      "REDUNDANCY",
      "ANOMALY"
    ],
    "fragment": 10,
    "evidenceTitle": "Normalized Citizen Database Schema",
    "successNote": "Room 10 cleared! Normalization verified."
  },
  "level_11": {
    "keywords": [
      "DEADLOCK",
      "OPERATING SYSTEM",
      "RESOURCE",
      "CIRCULAR WAIT"
    ],
    "fragment": 11,
    "evidenceTitle": "Circular Resource Dependency Graph",
    "successNote": "Room 11 cleared! Deadlock verified."
  },
  "level_12": {
    "keywords": [
      "POLYMORPHISM",
      "OOP",
      "METHOD",
      "INTERFACE",
      "OVERRIDING"
    ],
    "fragment": 12,
    "evidenceTitle": "Guardian Polymorphism Interface",
    "successNote": "Room 12 cleared! Polymorphism verified."
  },
  "level_13": {
    "keywords": [
      "INHERITANCE",
      "OOP",
      "PARENT",
      "CHILD",
      "CLASS",
      "DERIVED"
    ],
    "fragment": 13,
    "evidenceTitle": "Guardian Class Inheritance Blueprint",
    "successNote": "Room 13 cleared! Inheritance verified."
  },
  "level_14": {
    "keywords": [
      "STATE MACHINE",
      "STATEMACHINE",
      "FINITE STATE",
      "STATE",
      "TRANSITION",
      "FSM"
    ],
    "fragment": 14,
    "evidenceTitle": "Citadel State Transition Diagram",
    "successNote": "Room 14 cleared! State Machine verified."
  },
  "level_15": {
    "keywords": [
      "PAGING",
      "PAGE",
      "FRAME",
      "PAGE TABLE",
      "VIRTUAL MEMORY"
    ],
    "fragment": 15,
    "evidenceTitle": "Virtual Memory Page-Frame Map",
    "successNote": "Room 15 cleared! Paging verified."
  },
  "level_16": {
    "keywords": [
      "ROUND ROBIN",
      "ROUNDROBIN",
      "RR",
      "CPU",
      "SCHEDULING",
      "TIME QUANTUM"
    ],
    "fragment": 16,
    "evidenceTitle": "Round Robin CPU Scheduler",
    "successNote": "Room 16 cleared! Round Robin verified."
  },
  "level_17": {
    "keywords": [
      "DFS",
      "DEPTH FIRST SEARCH",
      "DEPTH-FIRST",
      "GRAPH",
      "STACK",
      "BACKTRACKING"
    ],
    "fragment": 17,
    "evidenceTitle": "Depth-First Kingdom Exploration Map",
    "successNote": "Room 17 cleared! DFS verified."
  },
  "level_18": {
    "keywords": [
      "BINARY SEARCH",
      "BINARYSEARCH",
      "SORTED",
      "MIDPOINT",
      "SEARCH"
    ],
    "fragment": 18,
    "evidenceTitle": "Binary Search Reality Vault Map",
    "successNote": "Room 18 cleared! Binary Search verified."
  },
  "level_19": {
    "keywords": [
      "DYNAMIC PROGRAMMING",
      "DYNAMICPROGRAMMING",
      "DP",
      "MEMOIZATION",
      "TABULATION",
      "SUBPROBLEM"
    ],
    "fragment": 19,
    "evidenceTitle": "Dynamic Programming Timeline Archive",
    "successNote": "Room 19 cleared! Dynamic Programming verified."
  },
  "level_20": {
    "keywords": [
      "PARSING",
      "PARSER",
      "PARSE",
      "COMPILER",
      "SYNTAX",
      "GRAMMAR",
      "PARSE TREE"
    ],
    "fragment": 20,
    "evidenceTitle": "Compiler Syntax Analysis Blueprint",
    "successNote": "Room 20 cleared! Parsing verified."
  }
};

const DEFAULT_SYSTEM_CONFIG = {
  totalTimeMinutes: 30,
  doomQuotes: DEFAULT_DOOM_QUOTES,
  tickerMessages: DEFAULT_TICKER_MESSAGES,
  titlePrefix: "LATVERIA-NET // DOOMSDAY PROTOCOL"
};

function getInitialState() {
  const base = {
    stages: JSON.parse(JSON.stringify(DEFAULT_STAGES)),
    questionPools: JSON.parse(JSON.stringify(DEFAULT_QUESTION_POOLS)),
    levelDialogues: JSON.parse(JSON.stringify(DEFAULT_LEVEL_DIALOGUES)),
    cinematicEvents: JSON.parse(JSON.stringify(DEFAULT_CINEMATIC_EVENTS)),
    stageIntroDialogues: JSON.parse(JSON.stringify(DEFAULT_STAGE_INTRO_DIALOGUES)),
    solutions: JSON.parse(JSON.stringify(DEFAULT_SOLUTIONS)),
    systemConfig: JSON.parse(JSON.stringify(DEFAULT_SYSTEM_CONFIG))
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...base,
        ...parsed,
        systemConfig: { ...base.systemConfig, ...(parsed.systemConfig || {}) },
        solutions: { ...base.solutions, ...(parsed.solutions || {}) }
      };
    }
  } catch (e) {
    console.warn('[ContentStore] Failed to load custom content from localStorage:', e);
  }

  return base;
}

class ContentStoreManager {
  constructor() {
    this.content = getInitialState();
    this.subscribers = new Set();
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  notify() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.content));
    } catch (e) {
      console.error('[ContentStore] Failed to save to localStorage:', e);
    }
    this.subscribers.forEach((fn) => {
      try {
        fn(this.content);
      } catch (err) {
        console.error('[ContentStore] Subscriber error:', err);
      }
    });
  }

  getContent() {
    return this.content;
  }

  getStages() {
    return this.content.stages;
  }

  getStage(idOrKey) {
    return this.content.stages.find((s) => s.id === idOrKey || s.key === idOrKey) || null;
  }

  getParts() {
    const stages = this.content.stages;
    return [
      {
        id: 1,
        title: "PART 1: THE COMPOUND BREACH",
        description: "5 Avengers investigation rooms. Doctor Doom has invaded the compound — uncover the code behavior to advance.",
        levels: stages.filter((s) => s.id <= 5)
      },
      {
        id: 2,
        title: "PART 2: DOOM'S INNER SANCTUM",
        description: "5 advanced investigation rooms. Lists, recursion, memoization, binary search, and tracing Doom's loop.",
        levels: stages.filter((s) => s.id > 5)
      }
    ];
  }

  updateStage(stageId, partialData) {
    const idx = this.content.stages.findIndex((s) => s.id === stageId);
    if (idx !== -1) {
      this.content.stages[idx] = {
        ...this.content.stages[idx],
        ...partialData
      };
      this.notify();
    }
  }

  updateAllStages(newStages) {
    this.content.stages = newStages;
    this.notify();
  }

  updateQuestionPool(levelKey, pool) {
    this.content.questionPools[levelKey] = pool;
    this.notify();
  }

  updateLevelDialogue(levelKey, dialogueData) {
    this.content.levelDialogues[levelKey] = {
      ...this.content.levelDialogues[levelKey],
      ...dialogueData
    };
    this.notify();
  }

  updateCinematicEvent(eventKey, eventData) {
    this.content.cinematicEvents[eventKey] = {
      ...this.content.cinematicEvents[eventKey],
      ...eventData
    };
    this.notify();
  }

  updateSystemConfig(config) {
    this.content.systemConfig = {
      ...this.content.systemConfig,
      ...config
    };
    this.notify();
  }

  updateSolution(stageKey, solutionData) {
    this.content.solutions[stageKey] = {
      ...this.content.solutions[stageKey],
      ...solutionData
    };
    this.notify();
  }

  resetToDefaults() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    this.content = {
      stages: JSON.parse(JSON.stringify(DEFAULT_STAGES)),
      questionPools: JSON.parse(JSON.stringify(DEFAULT_QUESTION_POOLS)),
      levelDialogues: JSON.parse(JSON.stringify(DEFAULT_LEVEL_DIALOGUES)),
      cinematicEvents: JSON.parse(JSON.stringify(DEFAULT_CINEMATIC_EVENTS)),
      stageIntroDialogues: JSON.parse(JSON.stringify(DEFAULT_STAGE_INTRO_DIALOGUES)),
      solutions: JSON.parse(JSON.stringify(DEFAULT_SOLUTIONS)),
      systemConfig: JSON.parse(JSON.stringify(DEFAULT_SYSTEM_CONFIG))
    };
    this.notify();
  }

  exportContentJSON() {
    return JSON.stringify(this.content, null, 2);
  }

  importContentJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.stages || !Array.isArray(parsed.stages)) {
        throw new Error("Invalid JSON: 'stages' array is required.");
      }
      this.content = {
        ...getInitialState(),
        ...parsed
      };
      this.notify();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  validateAnswer(stageKey, rawAnswer) {
    const clean = (val) => String(val || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const sol = this.content.solutions[stageKey];
    if (!sol) return false;
    const c = clean(rawAnswer);
    if (!c) return false;

    // Direct match against keywords
    return sol.keywords.some((kw) => {
      const cleanKw = clean(kw);
      return c === cleanKw || c.includes(cleanKw) || cleanKw.includes(c);
    });
  }
}

export const contentStore = new ContentStoreManager();
