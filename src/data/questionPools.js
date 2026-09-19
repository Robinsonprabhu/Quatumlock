// QUESTION POOL — AIDEX'26: DOOMSDAY ESCAPE ROOM
// Avengers vs Doctor Doom — Pure Investigation Narrative Architecture
// Zero cryptography, zero networking jargon. Pure CS concepts embedded in immersive story investigations.

export const QUESTION_POOLS = {
  level_1: [
    {
      id: 'l1_q1',
      question: "ROOM 1: THE BROKEN SENTINEL",
      narrative: `The Avengers Tower had been unusually quiet for the last twenty minutes. That was not necessarily a good thing.

After Doom's attack, the tower's primary control system had been damaged. Most of the hardware was still functional, but the main processor had lost three of its four cores.

Bruce Banner sat in front of the monitoring console while Peter Parker stood behind him, watching hundreds of lines move across the screen.

Five systems were marked active:
SURVEILLANCE | SECURITY | DOOR CONTROL | LIFE SUPPORT | REACTOR MONITOR

Peter frowned: "Five systems. One processor. That's not supposed to work."
Bruce didn't look away from the screen: "It doesn't work the way you think it does."

He opened the CPU monitor. Only one process was executing at any particular moment:
03:14:01 SURVEILLANCE → 03:14:02 SECURITY → 03:14:03 DOOR CONTROL → 03:14:04 LIFE SUPPORT → 03:14:05 REACTOR → 03:14:06 SURVEILLANCE...

The system was repeatedly moving between tasks. When a task stopped receiving CPU time, its current state was stored. When it received CPU time again, it continued from where it had stopped.

Peter noticed that every task was receiving a small time interval before another task was allowed to execute: TIME SLICE: 1 SECOND.

There was no second processor. There was no hidden hardware. There was only one CPU repeatedly deciding which waiting process should receive CPU time next and for how long.

Peter looked at the rotating process list again. For the first time, the tower's strange behavior made sense: Banner needed to identify the exact CPU scheduling algorithm driving this time-slicing process to override the system.`,
      objective: "Identify the operating system CPU scheduling algorithm or technique being used to rotate CPU time slices across the active processes. Transmit your answer.",
      investigationHook: "Review the CPU process state logs in the Terminal"
    },
    {
      id: 'l1_q2',
      question: "ROOM 1: PROCESS TIME SLICER",
      narrative: `The tower's single core CPU switches execution between SURVEILLANCE, SECURITY, DOOR CONTROL, LIFE SUPPORT, and REACTOR, granting each process a fixed 1-second time slice before context-switching to the next. Identify the CPU scheduling algorithm in use.`,
      objective: "What OS scheduling algorithm rotates fixed time slots among processes? Transmit 'Round Robin' (or 'Context Switching').",
      investigationHook: "Terminal displays process state switcher"
    }
  ],

  level_2: [
    {
      id: 'l2_q1',
      question: "ROOM 2: THE MISSING MEMORY",
      narrative: `The laboratory beneath Avengers Tower had no windows. On the central table sat a storage device containing five years of Avengers operations.

Bruce connected it to the computer. In the original database:
HERO: 101|Steve, 102|Thor, 103|Tony, 104|Natasha
WEAPON: 101|Shield, 102|Hammer, 103|Armor, 104|Batons
LOCATION: 101|Compound, 102|Asgard, 103|Laboratory, 104|Safehouse

The same identifier (HERO_ID) connected the records. Bruce changed Tony's location once in LOCATION, and the location updated everywhere.

Then Bruce opened Doom's modified copy. There, Tony's information had been repeatedly copied into different records:
Tony | Armor | Workshop
Tony | Armor | Workshop
Tony | Armor | Laboratory
Tony | Armor | Workshop

Natasha changed one Workshop entry to Laboratory. Another Workshop entry remained unchanged. Now the database contained contradictory information:
DATA CONSISTENCY ERROR

Bruce looked at the two designs side by side: "In one system, information is stored once and connected when needed. Here, the same fact has been copied everywhere."

Natasha began examining the structure Doom had created, looking for the database design mistake responsible for the duplicated and conflicting information. Identifying this database normalization process was required to restore system consistency.`,
      objective: "Identify the database design principle (or the flaw of duplicate copying) that eliminates redundant data and prevents inconsistency errors. Transmit your answer.",
      investigationHook: "Check Signal Receiver for database table schema comparison"
    },
    {
      id: 'l2_q2',
      question: "ROOM 2: DATABASE REDUNDANCY FLAW",
      narrative: `In Doom's corrupted database, the same facts are duplicated across multiple records instead of being normalized across separate linked tables, causing consistency errors. Identify the database structuring process.`,
      objective: "What database design process structures tables to eliminate data redundancy and duplication? Transmit 'Normalization' (or 'Data Redundancy').",
      investigationHook: "Signal receiver shows database schema breakdown"
    }
  ],

  level_3: [
    {
      id: 'l3_q1',
      question: "ROOM 3: THE SHORTEST PATH TO THE REACTOR",
      narrative: `Between the Avengers and the underground reactor lies a network of corridors:

                         START
                       /   |   \
                      A    B    C
                     / \   |   / \
                    D   E  F  G   H
                     \  |  |  |  /
                      \ |  |  | /
                       REACTOR

Energy costs for each corridor connection:
START → A: 4 | START → B: 2 | START → C: 7
A → D: 3 | A → E: 6
B → E: 1 | B → F: 5
C → G: 1 | C → H: 4
D → REACTOR: 5 | E → REACTOR: 3 | F → REACTOR: 2 | G → REACTOR: 6 | H → REACTOR: 1

Peter pointed at corridor B: "Two. That's the smallest number."
Natasha shook her head: "The corridor isn't the journey."

Bruce calculated the complete paths from START to REACTOR:
- Route A-D: 4 + 3 + 5 = 12
- Route A-E: 4 + 6 + 3 = 13
- Route B-E: 2 + 1 + 3 = 6
- Route B-F: 2 + 5 + 2 = 9
- Route C-G: 7 + 1 + 6 = 14
- Route C-H: 7 + 4 + 1 = 12

AVAILABLE ENERGY: 14. REACTOR LOCK: 00:11:42. By the time they finished tracing the available paths, there was only one thing left to determine: which complete route consumed the least energy before reaching the reactor.`,
      objective: "Determine the minimum total energy cost required by the shortest complete path from START to REACTOR. Transmit that number (6).",
      investigationHook: "Inspect the corridor path map in the Code Inspector"
    },
    {
      id: 'l3_q2',
      question: "ROOM 3: MINIMUM PATH ENERGY COST",
      narrative: "Tracing all complete paths from START to REACTOR: Route B-E (START → B → E → REACTOR) consumes 2 + 1 + 3 = 6 energy units, which is the absolute minimum cost.",
      objective: "Calculate the minimum total energy cost to reach the reactor. Transmit that integer (6).",
      investigationHook: "Code Inspector calculates path costs"
    }
  ],

  level_4: [
    {
      id: 'l4_q1',
      question: "ROOM 4: THE TWO IDENTICAL DOORS",
      narrative: `Peter Parker is locked inside Doom's storage chamber containing two machines:

Machine 1 (Single top opening, REMOVE TOP command):
Peter inserts: Shield → Hammer → Arc Reactor → Tesseract.
Machine 1 displays: TESSERACT, ARC REACTOR, HAMMER, SHIELD.
Executing REMOVE TOP releases Tesseract first, then Arc Reactor, then Hammer, and finally Shield. Inscription: 'THE MOST RECENT WAITS THE LEAST.'

Machine 2 (Horizontal tunnel, enters left, exits right):
Peter inserts the same four objects in the exact same order: Shield → Hammer → Arc Reactor → Tesseract.
Machine 2 releases: Shield first, Hammer second, Arc Reactor third, Tesseract last.

Both machines received the same four objects in the exact same order. One released the newest object first, while the other released the oldest object first.

Peter began writing down the order in which each machine released the four objects, ready to enter the two underlying data structures into the unlock panel.`,
      objective: "Identify the two data structures represented by Machine 1 and Machine 2 based on their item release behavior. Transmit your answer (Stack and Queue).",
      investigationHook: "Inspect both storage machines in Code Inspector"
    },
    {
      id: 'l4_q2',
      question: "ROOM 4: SEQUENTIAL DATA STRUCTURES",
      narrative: `Machine 1 releases the newest inserted item first (reversing input order). Machine 2 releases the oldest inserted item first (preserving arrival order).`,
      objective: "Name the two data structures demonstrated by the two machines. Transmit 'Stack and Queue' (or 'Stack').",
      investigationHook: "Code Inspector shows machine release order"
    }
  ],

  level_5: [
    {
      id: 'l5_q1',
      question: "ROOM 5: THE FINAL SYSTEM DECISION",
      narrative: `The central terminal displays Doom's decision rules:

RULE 01: HIGH ENERGY, FEW INTRUDERS, STABLE REACTOR → STANDBY
RULE 02: HIGH ENERGY, MANY INTRUDERS, STABLE REACTOR → DEFEND
RULE 03: LOW ENERGY, FEW INTRUDERS, STABLE REACTOR → RECHARGE
RULE 04: LOW ENERGY, MANY INTRUDERS, STABLE REACTOR → EMERGENCY
RULE 05: HIGH ENERGY, MANY INTRUDERS, UNSTABLE REACTOR → EMERGENCY
RULE 06: LOW ENERGY, FEW INTRUDERS, UNSTABLE REACTOR → EMERGENCY

The Avengers enter the current situation:
ENERGY LEVEL: HIGH
INTRUDERS: MANY
REACTOR: UNSTABLE

The system compares the inputs against each rule:
RULE 01: ENERGY MATCH, INTRUDERS NO MATCH, REACTOR NO MATCH
RULE 02: ENERGY MATCH, INTRUDERS MATCH, REACTOR NO MATCH
RULE 05: ENERGY MATCH, INTRUDERS MATCH, REACTOR MATCH → MATCH FOUND!

Four possible responses: STANDBY | DEFEND | RECHARGE | EMERGENCY

The terminal remained frozen. It would not proceed until the correct response triggered by the matching Rule 05 was entered into the doomsday console.`,
      objective: "Based on the rule evaluation for HIGH ENERGY, MANY INTRUDERS, and UNSTABLE REACTOR, which system response is triggered? Transmit that response word (EMERGENCY).",
      investigationHook: "Use Network Map to trace rule evaluation logic"
    },
    {
      id: 'l5_q2',
      question: "ROOM 5: RULE MATCHING RESPONSE",
      narrative: "The system matches RULE 05 (HIGH ENERGY, MANY INTRUDERS, UNSTABLE REACTOR) which triggers the EMERGENCY system action.",
      objective: "What system response is triggered by Rule 05? Transmit 'EMERGENCY'.",
      investigationHook: "Network map highlights Rule 05"
    }
  ],

  level_6: [
    {
      id: 'l6_q1',
      question: "ROOM 06: THE VANISHING CLUE",
      narrative: `Part 2 begins. Natasha Romanoff discovers three pieces of evidence stored in memory:

[Helmet, Shield, Hammer]

She removes Shield (contaminated), leaving:

[Helmet, Hammer]

Peter asks: 'Why didn't the entire collection disappear when one item was removed?' Natasha replies: 'Because I removed an element, not the container.'`,
      objective: "What data structure is most naturally represented by this ordered collection of elements? Transmit the data structure name (List or Array).",
      investigationHook: "Check Code Inspector for evidence collection layout"
    },
    {
      id: 'l6_q2',
      question: "ROOM 06: ORDERED ELEMENT CONTAINER",
      narrative: "An ordered collection `[Helmet, Shield, Hammer]` allows individual elements to be removed or modified without destroying the container.",
      objective: "What fundamental data structure represents an ordered sequence of elements? Transmit 'List' (or 'Array').",
      investigationHook: "Code Inspector displays container array"
    }
  ],

  level_7: [
    {
      id: 'l7_q1',
      question: "ROOM 07: THE RECURSIVE MESSAGE",
      narrative: `Doctor Doom leaves a mysterious message for the Avengers:

'To find me, ask the next machine where I am.'

The team activates Machine 1 → Machine 1 says: 'Ask Machine 2' → Machine 2 says: 'Ask Machine 3' → Machine 3 says: 'Ask Machine 4'.

Bruce realizes every machine is solving the overall task by calling another instance of the exact same problem.`,
      objective: "What programming technique is being demonstrated where a process solves a problem by calling another instance of itself? Transmit the technique name (Recursion).",
      investigationHook: "Terminal shows self-referential call sequence"
    },
    {
      id: 'l7_q2',
      question: "ROOM 07: SELF-CALLING PATTERN",
      narrative: "A function or process that solves a problem by invoking smaller instances of itself until reaching a base condition.",
      objective: "Identify the programming concept where a process calls itself. Transmit 'Recursion'.",
      investigationHook: "Code Inspector displays call chain"
    }
  ],

  level_8: [
    {
      id: 'l8_q1',
      question: "ROOM 08: THE MEMORY THAT REMEMBERS",
      narrative: `Peter Parker enters a room containing a computation engine. The first time he asks:

calculate(5)

the machine performs heavy calculation. The second time he asks calculate(5) with the same input, the machine does not calculate anything—it immediately returns the cached result from memory (5 → previous result).`,
      objective: "What optimization technique stores the results of expensive function calls to avoid recalculating the same input repeatedly? Transmit the technique name (Memoization or Caching).",
      investigationHook: "Check Code Inspector for calculation cache lookup"
    },
    {
      id: 'l8_q2',
      question: "ROOM 08: RESULT CACHING OPTIMIZATION",
      narrative: "Storing previous function outputs in a lookup table so subsequent calls with identical arguments return instantly.",
      objective: "Name the optimization technique that caches function results for repeated inputs. Transmit 'Memoization' (or 'Caching').",
      investigationHook: "Inspector displays memo lookup table"
    }
  ],

  level_9: [
    {
      id: 'l9_q1',
      question: "ROOM 09: THE SLOW AVENGER",
      narrative: `Doom releases 1,000 robots into the compound. Sam Wilson needs to find one specific robot.

Linear check (slow): Check Robot 1, Robot 2, Robot 3... (up to 1,000 checks).

Bruce's strategy: The robots are already sorted in order. Bruce checks the middle robot. If the target is smaller, he discards the second half; if larger, he discards the first half, cutting the search space in half at each step.`,
      objective: "What logarithmic search algorithm is Bruce describing? Transmit the algorithm name (Binary Search).",
      investigationHook: "Terminal displays divide-and-conquer search trace"
    },
    {
      id: 'l9_q2',
      question: "ROOM 09: DIVIDE-AND-CONQUER SEARCH",
      narrative: "Searching a sorted array by repeatedly dividing the search interval in half by comparing with the middle element.",
      objective: "What O(log n) searching algorithm cuts the search area in half each step? Transmit 'Binary Search'.",
      investigationHook: "Trace search steps in Terminal"
    }
  ],

  level_10: [
    {
      id: 'l10_q1',
      question: "FINAL ROOM: DOOM'S DECISION",
      narrative: `The Avengers reach Doctor Doom's central core. The terminal displays:

[python code]
energy = 100
count = 3

while count > 0:
    energy = energy - 20
    count = count - 1

print(energy)

The machine executes the loop until count > 0 becomes false.`,
      objective: "Trace the execution: Initial (energy=100, count=3) → Pass 1 (energy=80, count=2) → Pass 2 (energy=60, count=1) → Pass 3 (energy=40, count=0). What final number will print on Doom's screen? Transmit that number (40).",
      investigationHook: "FinalRecapWidget displays central core code trace"
    },
    {
      id: 'l10_q2',
      question: "FINAL ROOM: CORE LOOP EXECUTION RESULT",
      narrative: "Trace the python loop: energy starts at 100 and subtracts 20 exactly 3 times (for count = 3, 2, 1).",
      objective: "Calculate 100 - (3 * 20) = 100 - 60. What number is printed? Transmit 40.",
      investigationHook: "Check FinalRecapWidget for final core state"
    }
  ]
};

// Pick a random question from a level's pool
export function getRandomQuestion(levelKey) {
  const pool = QUESTION_POOLS[levelKey];
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Persist chosen question per session (so it doesn't change on re-render)
const sessionQuestions = {};
export function getSessionQuestion(levelKey) {
  if (!sessionQuestions[levelKey]) {
    sessionQuestions[levelKey] = getRandomQuestion(levelKey);
  }
  return sessionQuestions[levelKey];
}

export function resetSessionQuestions() {
  Object.keys(sessionQuestions).forEach((key) => {
    delete sessionQuestions[key];
  });
}
