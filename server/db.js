import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { syncToMongo, loadDataFromMongo, seedDataToMongo, isMongoConnected } from './mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel serverless, only /tmp is writable. Use it for local fallback.
// MongoDB Atlas is always the primary store in production.
const IS_VERCEL = Boolean(process.env.VERCEL);
const DB_FILE = IS_VERCEL
  ? '/tmp/escape_db.json'
  : path.join(__dirname, 'data', 'escape_db.json');

// Ensure data directory exists (local dev only — not needed on Vercel /tmp)
if (!IS_VERCEL) {
  const dataDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 20 CURATED CS ESCAPE-ROOM QUESTIONS BANK (Avengers / Battleworld Secret Wars)
// Every question has exactly 2 hints. Using hints costs both time and points.
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_20_QUESTIONS = [
  {
    "id": "Q01",
    "title": "ROOM 01: THE LAST LIGHT OF BATTLEWORLD",
    "subtitle": "Stack",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE SEALED DUNGEON</strong>",
      "The alarms suddenly activate inside Doom’s Citadel. When the lights return, six prisoners are standing outside a sealed chamber, even though the guards insist that nobody opened the door. Doom orders the team to reconstruct how the prisoners entered and left the dungeon.",
      "The admission ledger lists the prisoners in this order: Mira, Kade, Sol, Nox, Vale, and Rhea. However, the exit records were destroyed, leaving only physical evidence behind.",
      "Inside the inspection room, six numbered restraint bands are discovered in a narrow cabinet. The technician notices something unusual: the band belonging to the <strong>last prisoner admitted is sitting on top</strong>, while the band belonging to the first prisoner is buried underneath.",
      "The cabinet has only one usable opening. To reach anything at the bottom, the guards must first remove everything above it. Shuri immediately notices that this physical arrangement may explain the strange witness statements.",
      "Rhea claims she was the first prisoner released even though her admission number is six. Vale also remembers seeing other prisoners in an order that seems opposite to the admission record.",
      "A damaged surveillance frame shows the prisoners passing through the inspection point one at a time. The scratches inside the cabinet confirm that objects were repeatedly added and removed from the same opening.",
      "<strong>SHURI:</strong> “Do not focus on the prisoners. Focus on what happens when something is added last and removed first.”",
      "Doom activates the final control panel. A message appears:",
      "<strong>“Which fundamental data structure explains why the newest arrival can become the first one recovered?”</strong>",
      "Enter the structure's name to open the lower dungeon."
    ],
    "codeLines": [
      "// Last In, First Out",
      "stack.push(item)",
      "item = stack.pop()"
    ],
    "question": "Which fundamental data structure explains why the newest arrival can become the first one recovered? Enter the structure's name.",
    "hints": [
      {
        "text": "Think about what happens when something is added last and removed first.",
        "penalty": 20
      },
      {
        "text": "The newest item is recovered before the older items beneath it.",
        "penalty": 40
      },
      {
        "text": "Type 'STACK' to open the lower dungeon.",
        "penalty": 60
      }
    ],
    "fragment": 1,
    "evidenceTitle": "LIFO Restraint Cabinet Blueprint",
    "consequence": [
      "DUNGEON UNLOCKED",
      "STACK structure verified! The lower dungeon is accessible."
    ],
    "keywords": [
      "STACK",
      "LIFO",
      "PUSH",
      "POP"
    ],
    "originalId": "Q21",
    "order": 1,
    "cleanTitle": "THE LAST LIGHT OF BATTLEWORLD",
    "originalFragment": 21
  },
  {
    "id": "Q02",
    "title": "ROOM 02: THE ARMY THAT COULD NOT WAIT",
    "subtitle": "Queue",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE EVACUATION PORTAL</strong>",
      "The western district of Battleworld is collapsing, and thousands of civilians are trying to escape through a single portal. The portal can only remain open for a few seconds, so the evacuation team must decide exactly who is allowed through next.",
      "Captain America discovers an evacuation register containing the names of everyone who reached the gate. The names were recorded when each person joined the waiting line.",
      "Peter arrived first, followed by Wanda, Sam, Shuri, Bucky, and Scott. During the first portal opening, Peter, Wanda, and Sam are allowed through.",
      "During the next opening, Shuri crosses first, followed by Bucky. Scott remains behind because the portal closes before his turn arrives.",
      "One guard claims that Scott crossed before Shuri, but another guard immediately rejects the statement. Scott is still holding his red waiting token when Shuri passes through the portal.",
      "The team discovers that every person receives a physical token when entering the waiting area. The token is collected only when that person finally passes through the portal.",
      "The tokens are stored inside a long metal channel. New tokens enter from one side, while completed tokens leave from the opposite side.",
      "<strong>WANDA:</strong> “Nobody was allowed to move around the people who were already waiting.”",
      "The eastern checkpoint confirms the same pattern. The first arrivals are also the first departures.",
      "Doom's control panel displays the final question:",
      "<strong>“Which fundamental data structure matches an evacuation system where the earliest arrival is served first?”</strong>",
      "Enter the structure name."
    ],
    "codeLines": [
      "// First In, First Out",
      "queue.enqueue(person)",
      "person = queue.front()",
      "queue.dequeue()"
    ],
    "question": "Which fundamental data structure matches an evacuation system where the earliest arrival is served first? Enter the structure name.",
    "hints": [
      {
        "text": "Think about a normal waiting line where people are served in arrival order.",
        "penalty": 20
      },
      {
        "text": "The first person entering is the first person leaving.",
        "penalty": 40
      },
      {
        "text": "Type 'QUEUE' to activate the evacuation portal.",
        "penalty": 60
      }
    ],
    "fragment": 2,
    "evidenceTitle": "FIFO Evacuation Channel Blueprint",
    "consequence": [
      "PORTAL ACTIVATED",
      "QUEUE structure verified! The evacuation order is restored."
    ],
    "keywords": [
      "QUEUE",
      "FIFO",
      "ENQUEUE",
      "DEQUEUE"
    ],
    "originalId": "Q22",
    "order": 2,
    "cleanTitle": "THE ARMY THAT COULD NOT WAIT",
    "originalFragment": 22
  },
  {
    "id": "Q03",
    "title": "ROOM 03: THE CHAIN OF VANISHED HEROES",
    "subtitle": "Linked List",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE SCATTERED RELICS</strong>",
      "A strange collection of ancient relics is discovered inside Doom’s abandoned vault. At first, the artifacts appear to have been placed randomly around the room.",
      "However, Shuri discovers that every relic contains a small engraved symbol pointing toward another relic. The physical position of an artifact is therefore not important.",
      "The first relic points toward a second relic. The second points toward a third, and the chain continues through the vault.",
      "<strong>SHURI:</strong> “The location of each relic does not matter. What matters is which relic tells us where to go next.”",
      "One damaged artifact contains only a reference to another artifact. Another relic contains its own information along with a reference to the next one.",
      "Following the references eventually leads to the final relic, which contains no further direction.",
      "Doom’s archivist confirms that the relics were intentionally scattered so that their physical arrangement could not reveal their order.",
      "The rescue team reconstructs the sequence by following each connection from one relic to the next.",
      "A final inscription appears:",
      "<strong>“Each element stores information about itself and identifies the next element in the chain.”</strong>",
      "The Battleworld console asks:",
      "<strong>“What standard data structure does this represent?”</strong>",
      "Enter the structure's name."
    ],
    "codeLines": [
      "// Node stores data and a reference",
      "node = { data, next }",
      "current = head",
      "current = current.next"
    ],
    "question": "What standard data structure does this represent? Enter the structure's name.",
    "hints": [
      {
        "text": "The physical position of each element does not determine the sequence.",
        "penalty": 20
      },
      {
        "text": "Each element contains information and a reference to the next element.",
        "penalty": 40
      },
      {
        "text": "Type 'LINKED LIST' to reconstruct the relic chain.",
        "penalty": 60
      }
    ],
    "fragment": 3,
    "evidenceTitle": "Linked Relic Chain Blueprint",
    "consequence": [
      "CHAIN RESTORED",
      "LINKED LIST structure verified! The scattered relic sequence is reconstructed."
    ],
    "keywords": [
      "LINKED LIST",
      "LINKEDLIST",
      "NODE",
      "HEAD",
      "NEXT"
    ],
    "originalId": "Q23",
    "order": 3,
    "cleanTitle": "THE CHAIN OF VANISHED HEROES",
    "originalFragment": 23
  },
  {
    "id": "Q04",
    "title": "ROOM 04: THE FAMILY DOOM ERASED",
    "subtitle": "Binary Tree",
    "category": "Data Structures",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE DAMAGED ROYAL GENEALOGY</strong>",
      "An ancient genealogy tablet disappears from Doom’s royal archive. When it returns, several names have been damaged, and the historians cannot agree about where the missing rulers belong.",
      "The tablet does not contain a simple list. One ruler appears at the top, with descendants branching beneath the ruler. Those descendants can have their own branches.",
      "Valeria explains that every ruler can have a branch on the left and another branch on the right. The position of a name depends on its relationship with the ruler above it.",
      "A surviving rule gives an even more important clue: when a new ruler is added, its value is compared with the current ruler. Depending on the result, the search continues into one side or the other.",
      "<strong>SHURI:</strong> “Do not read the names as a sentence. Read the structure around them.”",
      "The archive contains several examples where one branch ends immediately while another continues through multiple generations.",
      "Doom’s historians reconstruct the damaged genealogy and discover that the same comparison rule is repeatedly applied at every level.",
      "The final diagram contains one root at the top, two possible branches beneath it, and further branches below those nodes.",
      "<strong>DOOM:</strong> “My dynasty does not grow like a list. It branches according to law.”",
      "The control panel asks:",
      "<strong>“The genealogy repeatedly branches into a left and right descendant according to comparison rules. What standard data structure represents it?”</strong>",
      "Enter the structure name."
    ],
    "codeLines": [
      "// Binary tree node",
      "node = { value, left, right }",
      "if value < node.value:",
      "    node = node.left",
      "else:",
      "    node = node.right"
    ],
    "question": "The genealogy repeatedly branches into a left and right descendant according to comparison rules. What standard data structure represents it? Enter the structure name.",
    "hints": [
      {
        "text": "The structure has a root with branching descendants.",
        "penalty": 20
      },
      {
        "text": "Each node can have a left and right branch.",
        "penalty": 40
      },
      {
        "text": "Type 'BINARY TREE' to reconstruct Doom's genealogy.",
        "penalty": 60
      }
    ],
    "fragment": 4,
    "evidenceTitle": "Binary Genealogy Tree Blueprint",
    "consequence": [
      "GENEALOGY RESTORED",
      "BINARY TREE structure verified! Doom's damaged family hierarchy is reconstructed."
    ],
    "keywords": [
      "BINARY TREE",
      "BINARYTREE",
      "TREE",
      "ROOT",
      "LEFT",
      "RIGHT",
      "BST"
    ],
    "originalId": "Q24",
    "order": 4,
    "cleanTitle": "THE FAMILY DOOM ERASED",
    "originalFragment": 24
  },
  {
    "id": "Q05",
    "title": "ROOM 05: THE CITY WITH NO RETURN",
    "subtitle": "BFS",
    "category": "Algorithms",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE FRACTURED CITY</strong>",
      "A group of civilians is trapped inside a district whose streets have been damaged by reality fractures. The rescue team knows the starting location but must determine the correct order for exploring the connected streets.",
      "Captain America insists that nearby locations should be investigated before locations that are much farther away.",
      "The rescue team begins at the Citadel gate. Three connected locations are discovered immediately. Instead of following one road deeply, the team marks all three locations first.",
      "From those locations, several more streets become available. These new locations are recorded, but the team does not ignore the locations that were already discovered from the starting point.",
      "A second rescue team follows one road as far as possible before returning. Their route becomes deep and winding, leaving several nearby locations unexplored for too long.",
      "<strong>CAPTAIN AMERICA:</strong> “If a survivor is one street away, we should discover them before searching five streets away.”",
      "The map contains no distances, only connections. The important requirement is that locations closer to the starting point are processed before deeper locations.",
      "Some roads eventually lead to the same location. To prevent repeated exploration, each location is marked as soon as it is discovered.",
      "The final rescue record shows a clear pattern: all locations one step from the starting point are processed before locations two steps away, followed by the next level.",
      "<strong>SHURI:</strong> “The search expands outward instead of disappearing down one branch.”",
      "The Battleworld console asks:",
      "<strong>“Which graph-traversal method explores locations outward from the starting point, visiting closer levels before deeper ones?”</strong>",
      "Enter the traversal method."
    ],
    "codeLines": [
      "queue = [start]",
      "visited.add(start)",
      "while queue:",
      "    node = queue.pop(0)",
      "    for neighbor in graph[node]:",
      "        if neighbor not in visited:",
      "            visited.add(neighbor)",
      "            queue.append(neighbor)"
    ],
    "question": "Which graph-traversal method explores locations outward from the starting point, visiting closer levels before deeper ones? Enter the traversal method.",
    "hints": [
      {
        "text": "The search expands outward level by level.",
        "penalty": 20
      },
      {
        "text": "A queue can be used to process locations in discovery order.",
        "penalty": 40
      },
      {
        "text": "Type 'BFS' to activate the rescue map.",
        "penalty": 60
      }
    ],
    "fragment": 5,
    "evidenceTitle": "Breadth-First Rescue Map",
    "consequence": [
      "CITY MAPPED",
      "BFS traversal verified! The rescue search has expanded outward level by level."
    ],
    "keywords": [
      "BFS",
      "BREADTH FIRST SEARCH",
      "BREADTH-FIRST",
      "GRAPH",
      "QUEUE",
      "TRAVERSAL"
    ],
    "originalId": "Q25",
    "order": 5,
    "cleanTitle": "THE CITY WITH NO RETURN",
    "originalFragment": 25
  },
  {
    "id": "Q06",
    "title": "ROOM 06: THE ROAD DOOM COULD NOT FORGET",
    "subtitle": "Dijkstra",
    "category": "Algorithms",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE WEIGHTED BATTLEWORLD MAP</strong>",
      "Doom discovers a map connecting several Battleworld kingdoms. Every road has a travel cost, and the rescue team must determine the cheapest route from the Citadel to the other kingdoms.",
      "The map contains many possible paths. Some routes use fewer roads but have higher costs, while other routes use more roads but are cheaper overall.",
      "The technician begins from the starting kingdom and records its distance as zero. The neighboring kingdoms receive their initial travel costs.",
      "The system then selects the currently known location with the smallest total distance.",
      "After selecting it, the system examines its outgoing roads. If reaching another kingdom through the selected location produces a cheaper route, the recorded distance is updated.",
      "<strong>SHURI:</strong> “Do not choose the road with the fewest steps. Choose the route with the smallest total cost.”",
      "The process continues as the cheapest confirmed location is selected and its neighboring routes are examined.",
      "All road costs on the map are non-negative, so a confirmed shortest distance does not later need to be replaced by a cheaper negative-cost route.",
      "Captain America notices that the algorithm gradually builds the shortest known distance from the starting point to every reachable kingdom.",
      "The final map displays several routes with different costs. The control panel asks:",
      "<strong>“Which standard shortest-path algorithm repeatedly confirms the currently cheapest total route in a graph with non-negative edge costs?”</strong>",
      "Enter the algorithm name."
    ],
    "codeLines": [
      "distance[start] = 0",
      "node = extract_min()",
      "for neighbor in graph[node]:",
      "    new_distance = distance[node] + cost(node, neighbor)",
      "    if new_distance < distance[neighbor]:",
      "        distance[neighbor] = new_distance"
    ],
    "question": "Which standard shortest-path algorithm repeatedly confirms the currently cheapest total route in a graph with non-negative edge costs? Enter the algorithm name.",
    "hints": [
      {
        "text": "The algorithm works on weighted graphs with non-negative edge costs.",
        "penalty": 20
      },
      {
        "text": "It repeatedly selects the currently known location with the smallest total distance.",
        "penalty": 40
      },
      {
        "text": "Type 'DIJKSTRA' to reveal the cheapest routes.",
        "penalty": 60
      }
    ],
    "fragment": 6,
    "evidenceTitle": "Weighted Shortest-Path Map",
    "consequence": [
      "ROUTES OPTIMIZED",
      "DIJKSTRA algorithm verified! The minimum-cost kingdom routes are revealed."
    ],
    "keywords": [
      "DIJKSTRA",
      "DIJKSTRAS",
      "DIJKSTRA'S",
      "SHORTEST PATH",
      "WEIGHTED GRAPH",
      "RELAXATION"
    ],
    "originalId": "Q26",
    "order": 6,
    "cleanTitle": "THE ROAD DOOM COULD NOT FORGET",
    "originalFragment": 26
  },
  {
    "id": "Q07",
    "title": "ROOM 07: THE CLOCK THAT GAVE DOOM TOO MANY TOMORROWS",
    "subtitle": "Recursion",
    "category": "Programming",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE INFINITE CLOCK</strong>",
      "Inside Doom’s laboratory, the team discovers a strange clock that repeatedly performs the same operation. Every time the clock receives a number, it creates a smaller version of the same problem.",
      "The first calculation produces another calculation. That calculation produces another smaller calculation, and the process continues.",
      "At first, the team believes the clock is malfunctioning because it keeps calling the same operation again and again.",
      "Shuri examines the mechanism and notices that each new calculation is performed on a smaller input.",
      "<strong>SHURI:</strong> “It is not repeating forever. Each call moves toward a condition where the process can finally stop.”",
      "A damaged instruction panel shows the same function referring to itself while working on a smaller value.",
      "Captain America tests the mechanism with different starting values. Each time, the same pattern appears: solve part of the problem, call the same operation again with a smaller value, and stop at the base condition.",
      "Doom reveals that the clock was designed to demonstrate a programming technique rather than ordinary repetition.",
      "The final console displays:",
      "<strong>“The chamber repeatedly applies the same operation to a smaller version of itself until a stopping condition is reached.”</strong>",
      "<strong>“What programming technique does this describe?”</strong>",
      "Enter the technique's name."
    ],
    "codeLines": [
      "function solve(n):",
      "    if n == 0:",
      "        return",
      "    solve(n - 1)"
    ],
    "question": "The chamber repeatedly applies the same operation to a smaller version of itself until a stopping condition is reached. What programming technique does this describe? Enter the technique's name.",
    "hints": [
      {
        "text": "The same function refers to itself.",
        "penalty": 20
      },
      {
        "text": "A base condition stops the repeated calls.",
        "penalty": 40
      },
      {
        "text": "Type 'RECURSION' to stop the clock.",
        "penalty": 60
      }
    ],
    "fragment": 7,
    "evidenceTitle": "Recursive Clock Mechanism",
    "consequence": [
      "CLOCK HALTED",
      "RECURSION verified! The clock has reached its stopping condition."
    ],
    "keywords": [
      "RECURSION",
      "RECURSIVE",
      "FUNCTION",
      "BASE CASE",
      "CALL"
    ],
    "originalId": "Q27",
    "order": 7,
    "cleanTitle": "THE CLOCK THAT GAVE DOOM TOO MANY TOMORROWS",
    "originalFragment": 27
  },
  {
    "id": "Q08",
    "title": "ROOM 08: THE FEAST OF A THOUSAND WORLDS",
    "subtitle": "Greedy",
    "category": "Algorithms",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE INTERDIMENSIONAL MARKETPLACE</strong>",
      "The Avengers enter a massive interdimensional marketplace where thousands of worlds are offering limited resources. The team has only enough capacity to make a small number of choices.",
      "At every stage, the system examines the available options and chooses the one that appears best immediately.",
      "One technician suggests reconsidering earlier decisions whenever a better combination becomes visible. However, the original system does not do this.",
      "Instead, once an option is selected, it becomes part of the final solution and the process continues with the remaining choices.",
      "<strong>CAPTAIN AMERICA:</strong> “Are we certain that the first choice will always lead to the best final result?”",
      "Shuri points out that the system's strategy is not based on exploring every possible combination. It simply makes the best valid local decision available at each step.",
      "The selection continues until no more valid choices can be made.",
      "Doom’s records describe the method as fast because it avoids revisiting previous decisions.",
      "The team notices that the central idea is not recursion or exhaustive search. The algorithm commits to the locally best option at every stage.",
      "<strong>DOOM:</strong> “You do not need to examine every future when your strategy is to take the best available choice now.”",
      "The control panel asks:",
      "<strong>“What algorithmic strategy chooses the best immediate valid option at each step without revisiting previous choices?”</strong>",
      "Enter the strategy name."
    ],
    "codeLines": [
      "while choices remain:",
      "    choice = best_valid_choice(choices)",
      "    solution.add(choice)",
      "    choices.remove(choice)"
    ],
    "question": "What algorithmic strategy chooses the best immediate valid option at each step without revisiting previous choices? Enter the strategy name.",
    "hints": [
      {
        "text": "The strategy makes the best available local choice.",
        "penalty": 20
      },
      {
        "text": "It commits to each choice instead of exploring every combination.",
        "penalty": 40
      },
      {
        "text": "Type 'GREEDY' to claim the marketplace resources.",
        "penalty": 60
      }
    ],
    "fragment": 8,
    "evidenceTitle": "Greedy Resource Selection Blueprint",
    "consequence": [
      "RESOURCES CLAIMED",
      "GREEDY strategy verified! The marketplace selection protocol is complete."
    ],
    "keywords": [
      "GREEDY",
      "GREEDY ALGORITHM",
      "LOCAL OPTIMUM",
      "ALGORITHM",
      "SELECTION"
    ],
    "originalId": "Q28",
    "order": 8,
    "cleanTitle": "THE FEAST OF A THOUSAND WORLDS",
    "originalFragment": 28
  },
  {
    "id": "Q09",
    "title": "ROOM 09: THE TWO AVENGERS WHO SHARED ONE MEMORY",
    "subtitle": "Transaction",
    "category": "Database Systems",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE CORRUPTED MISSION RECORD</strong>",
      "Two Avengers are updating the same Battleworld database during a rescue mission. Several related operations must be completed before the mission can be considered successful.",
      "The first operation records the rescued citizen. The next updates the location, and another operation changes the mission status.",
      "A sudden system failure occurs halfway through the process.",
      "The database is now in danger of containing only some of the changes. Shuri explains that this would leave the information inconsistent.",
      "The system therefore treats all the related operations as one logical unit.",
      "If every operation succeeds, the changes are permanently accepted. If one operation fails, the system can undo the earlier changes made as part of that group.",
      "<strong>SHURI:</strong> “The database should not remember half a mission.”",
      "Captain America tests the process again. This time, all operations complete successfully, and the complete set of changes is saved together.",
      "A second test deliberately causes the final operation to fail. The database returns to the state it had before the group began.",
      "The archivist explains that the operations are not independent from the database's point of view. They must either succeed together or be rolled back together.",
      "The final console asks:",
      "<strong>“What database unit groups multiple related operations so they can succeed together or be rolled back together?”</strong>",
      "Enter the database concept."
    ],
    "codeLines": [
      "BEGIN TRANSACTION",
      "UPDATE citizens SET rescued = true",
      "UPDATE locations SET status = 'SAFE'",
      "UPDATE missions SET status = 'COMPLETE'",
      "COMMIT",
      "// On failure: ROLLBACK"
    ],
    "question": "What database unit groups multiple related operations so they can succeed together or be rolled back together? Enter the database concept.",
    "hints": [
      {
        "text": "The related operations are treated as one logical unit.",
        "penalty": 20
      },
      {
        "text": "The group can be committed or rolled back.",
        "penalty": 40
      },
      {
        "text": "Type 'TRANSACTION' to stabilize the mission database.",
        "penalty": 60
      }
    ],
    "fragment": 9,
    "evidenceTitle": "Atomic Mission Transaction Log",
    "consequence": [
      "DATABASE STABILIZED",
      "TRANSACTION verified! The mission records are now safely grouped."
    ],
    "keywords": [
      "TRANSACTION",
      "COMMIT",
      "ROLLBACK",
      "DATABASE",
      "ATOMIC",
      "ACID"
    ],
    "originalId": "Q29",
    "order": 9,
    "cleanTitle": "THE TWO AVENGERS WHO SHARED ONE MEMORY",
    "originalFragment": 29
  },
  {
    "id": "Q10",
    "title": "ROOM 10: THE KINGDOM THAT FORGOT ITS CITIZENS",
    "subtitle": "Normalization",
    "category": "Database Systems",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE CORRUPTED CITIZEN DATABASE</strong>",
      "Doom discovers a huge citizen database containing thousands of records. At first, everything appears organized, but the same citizen information has been copied into many different tables.",
      "When one citizen changes their address, the database administrator must update the same information in several places.",
      "One record is updated while another is forgotten, creating conflicting information.",
      "Shuri investigates and discovers that the database is storing repeated facts instead of separating them into related tables.",
      "<strong>SHURI:</strong> “The problem is not the amount of information. The problem is how the information is organized.”",
      "The team redesigns the database by separating citizens, locations, and other related information into appropriate tables.",
      "Relationships between the tables are then used to connect the information instead of repeatedly storing the same values.",
      "The new design reduces unnecessary duplication and makes updates more consistent.",
      "The archivist explains that the original design could also cause problems when inserting new information or deleting existing records.",
      "After restructuring the database, those anomalies are greatly reduced.",
      "<strong>DOOM:</strong> “You have turned one enormous collection into several organized relationships.”",
      "The final control panel asks:",
      "<strong>“What database design principle restructures repeated information into related collections to reduce duplication and update, insertion, and deletion problems?”</strong>",
      "Enter the principle's name."
    ],
    "codeLines": [
      "// Repeated data causes redundancy",
      "Citizen(name, address, city, department)",
      "// Separate related information",
      "Citizen(id, name, address_id)",
      "Address(id, city)"
    ],
    "question": "What database design principle restructures repeated information into related collections to reduce duplication and update, insertion, and deletion problems? Enter the principle's name.",
    "hints": [
      {
        "text": "The goal is to reduce repeated information.",
        "penalty": 20
      },
      {
        "text": "Related information is separated into appropriate tables.",
        "penalty": 40
      },
      {
        "text": "Type 'NORMALIZATION' to reorganize the citizen database.",
        "penalty": 60
      }
    ],
    "fragment": 10,
    "evidenceTitle": "Normalized Citizen Database Schema",
    "consequence": [
      "DATABASE RESTRUCTURED",
      "NORMALIZATION verified! Redundant citizen information has been organized into related tables."
    ],
    "keywords": [
      "NORMALIZATION",
      "NORMALIZE",
      "DATABASE",
      "REDUNDANCY",
      "ANOMALY"
    ],
    "originalId": "Q30",
    "order": 10,
    "cleanTitle": "THE KINGDOM THAT FORGOT ITS CITIZENS",
    "originalFragment": 30
  },
  {
    "id": "Q11",
    "title": "ROOM 11: THE FOUR GUARDS WHO WOULD NOT MOVE",
    "subtitle": "Deadlock",
    "category": "Operating Systems",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE LOCKED RESOURCE CYCLE</strong>",
      "Four Battleworld security systems are protecting four different resources. Each system has already acquired one resource but needs another resource before it can continue.",
      "The first process is waiting for a resource held by the second. The second is waiting for a resource held by the third.",
      "The third is waiting for a resource held by the fourth, while the fourth is waiting for the resource held by the first.",
      "Captain America tries to free one process, but every process claims that it cannot release its resource until it receives another one.",
      "The waiting pattern forms a complete circle.",
      "<strong>SHURI:</strong> “Nobody is simply slow. Every process is waiting for something another process refuses to release.”",
      "The operating-system monitor shows that none of the four processes can make progress.",
      "Adding more processing time does not solve the problem because the required resources are still locked.",
      "Doom’s engineer confirms that the processes have entered a permanent waiting condition caused by circular resource dependency.",
      "The system cannot continue unless an external action breaks the cycle.",
      "<strong>DOOM:</strong> “Four guards. Four resources. Four waits. Nobody moves.”",
      "The final console displays:",
      "<strong>“What operating-system condition occurs when processes permanently wait for resources held by one another in a circular dependency?”</strong>",
      "Enter the condition's name."
    ],
    "codeLines": [
      "// Circular wait",
      "P1 holds R1 -> waits for R2",
      "P2 holds R2 -> waits for R3",
      "P3 holds R3 -> waits for R4",
      "P4 holds R4 -> waits for R1"
    ],
    "question": "What operating-system condition occurs when processes permanently wait for resources held by one another in a circular dependency? Enter the condition's name.",
    "hints": [
      {
        "text": "Each process holds one resource and waits for another.",
        "penalty": 20
      },
      {
        "text": "The waiting relationships form a circular dependency.",
        "penalty": 40
      },
      {
        "text": "Type 'DEADLOCK' to break the resource cycle.",
        "penalty": 60
      }
    ],
    "fragment": 11,
    "evidenceTitle": "Circular Resource Dependency Graph",
    "consequence": [
      "RESOURCE CYCLE IDENTIFIED",
      "DEADLOCK verified! The circular waiting condition has been detected."
    ],
    "keywords": [
      "DEADLOCK",
      "OPERATING SYSTEM",
      "RESOURCE",
      "CIRCULAR WAIT"
    ],
    "originalId": "Q31",
    "order": 11,
    "cleanTitle": "THE FOUR GUARDS WHO WOULD NOT MOVE",
    "originalFragment": 31
  },
  {
    "id": "Q12",
    "title": "ROOM 12: THE DAY THE CLONES ANSWERED DIFFERENTLY",
    "subtitle": "Polymorphism",
    "category": "Object-Oriented Programming",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE GUARDIAN CLONES</strong>",
      "Doom creates several Guardian clones from different classes. He gives every clone exactly the same command.",
      "The first Guardian moves using one implementation. The second Guardian performs the command differently, while another Guardian produces an entirely different result.",
      "Captain America checks the command and confirms that the instruction itself never changed.",
      "The difference comes from the actual type of object receiving the command.",
      "<strong>CAPTAIN AMERICA:</strong> “Same command. Different behavior. How is that possible?”",
      "Shuri explains that the objects share a common operation, but each specialized object can provide its own implementation of that operation.",
      "The system does not need a completely different command for every Guardian.",
      "Instead, the same operation can be invoked through a common interface while the appropriate implementation is selected according to the object.",
      "Doom tests the system with another clone and receives yet another valid behavior from the same command.",
      "The team realizes that the key is the ability of one interface or operation to represent different forms of behavior.",
      "<strong>SHURI:</strong> “The command stays the same. The object decides how that command behaves.”",
      "The final console asks:",
      "<strong>“Which object-oriented principle allows the same operation to produce different behavior depending on the actual object receiving the command?”</strong>",
      "Enter the principle's name."
    ],
    "codeLines": [
      "guardian.move()",
      "// FlyingGuardian -> flies",
      "// SwimmingGuardian -> swims",
      "// GroundGuardian -> runs",
      "// Same operation, different behavior"
    ],
    "question": "Which object-oriented principle allows the same operation to produce different behavior depending on the actual object receiving the command? Enter the principle's name.",
    "hints": [
      {
        "text": "The same operation can have different implementations.",
        "penalty": 20
      },
      {
        "text": "The actual object's type determines which behavior is used.",
        "penalty": 40
      },
      {
        "text": "Type 'POLYMORPHISM' to control the Guardian clones.",
        "penalty": 60
      }
    ],
    "fragment": 12,
    "evidenceTitle": "Guardian Polymorphism Interface",
    "consequence": [
      "CLONES SYNCHRONIZED",
      "POLYMORPHISM verified! The same command now produces type-specific behavior."
    ],
    "keywords": [
      "POLYMORPHISM",
      "OOP",
      "METHOD",
      "INTERFACE",
      "OVERRIDING"
    ],
    "originalId": "Q32",
    "order": 12,
    "cleanTitle": "THE DAY THE CLONES ANSWERED DIFFERENTLY",
    "originalFragment": 32
  },
  {
    "id": "Q13",
    "title": "ROOM 13: THE HOUSE THAT INHERITED A WAR",
    "subtitle": "Inheritance",
    "category": "Object-Oriented Programming",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE GUARDIAN TRAINING SYSTEM</strong>",
      "A Guardian training system contains a general class called `Guardian`. It defines common abilities such as moving and repairing damaged equipment.",
      "Doom later creates a specialized Guardian called `FlyingGuardian`.",
      "The new Guardian needs all the common abilities of the original Guardian, but it also needs a special ability called `fly()`.",
      "The programmers do not want to copy the existing `move()` and `repair()` code into the new class.",
      "Instead, the specialized class is connected to the general class and automatically receives its common behavior.",
      "<strong>SHURI:</strong> “Why rebuild abilities that already exist in the parent?”",
      "The new Guardian can therefore use `move()` and `repair()` while also providing its own `fly()` functionality.",
      "Captain America tests the specialized Guardian and confirms that both the inherited abilities and its new ability work.",
      "The class structure shows a general class at the top and a more specialized class beneath it.",
      "The specialized class extends the capabilities of the general class rather than starting completely from zero.",
      "<strong>DOOM:</strong> “A stronger class is built from what already exists.”",
      "The final console asks:",
      "<strong>“What object-oriented principle allows specialized classes to receive common attributes and behavior from a more general class while adding their own features?”</strong>",
      "Enter the principle's name."
    ],
    "codeLines": [
      "class Guardian:",
      "    def move(self): pass",
      "    def repair(self): pass",
      "",
      "class FlyingGuardian(Guardian):",
      "    def fly(self): pass"
    ],
    "question": "What object-oriented principle allows specialized classes to receive common attributes and behavior from a more general class while adding their own features? Enter the principle's name.",
    "hints": [
      {
        "text": "A specialized class can receive features from a general class.",
        "penalty": 20
      },
      {
        "text": "The child class can extend the behavior of the parent class.",
        "penalty": 40
      },
      {
        "text": "Type 'INHERITANCE' to activate the FlyingGuardian.",
        "penalty": 60
      }
    ],
    "fragment": 13,
    "evidenceTitle": "Guardian Class Inheritance Blueprint",
    "consequence": [
      "GUARDIAN ACTIVATED",
      "INHERITANCE verified! The specialized Guardian has received its parent capabilities."
    ],
    "keywords": [
      "INHERITANCE",
      "OOP",
      "PARENT",
      "CHILD",
      "CLASS",
      "DERIVED"
    ],
    "originalId": "Q33",
    "order": 13,
    "cleanTitle": "THE HOUSE THAT INHERITED A WAR",
    "originalFragment": 33
  },
  {
    "id": "Q14",
    "title": "ROOM 14: THE DOOR THAT CHANGED ITS MIND",
    "subtitle": "State Machine",
    "category": "Computer Science",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE CITADEL SECURITY DOOR</strong>",
      "Doom’s Citadel contains a security door controlled by a strange electronic system. The door can exist in several distinct conditions.",
      "At first, the door is <strong>LOCKED</strong>. After receiving the correct command, it moves to <strong>ARMED</strong>.",
      "Another input starts the countdown, causing the system to enter the <strong>COUNTDOWN</strong> state.",
      "When the countdown finishes, the door moves into the <strong>OPEN</strong> state.",
      "The system does not behave randomly. Each input is interpreted according to the door's current state.",
      "<strong>SHURI:</strong> “The same input can have a different effect depending on which state the system is currently in.”",
      "For example, an unlock command has meaning while the door is locked, but the same command may have no effect once the door is already open.",
      "A diagram on the control panel shows circles representing the states and arrows representing transitions between them.",
      "The system contains only a finite number of possible states.",
      "Captain America follows the transitions and confirms that every state change is triggered by an input or event.",
      "<strong>DOOM:</strong> “The door does not simply act. It moves from one defined condition to another.”",
      "The console asks:",
      "<strong>“What computational model represents a system with a finite set of states where inputs cause transitions from one state to another?”</strong>",
      "Enter the model's name."
    ],
    "codeLines": [
      "state = 'LOCKED'",
      "if event == 'UNLOCK':",
      "    state = 'ARMED'",
      "if event == 'START':",
      "    state = 'COUNTDOWN'",
      "if event == 'TIMEOUT':",
      "    state = 'OPEN'"
    ],
    "question": "What computational model represents a system with a finite set of states where inputs cause transitions from one state to another? Enter the model's name.",
    "hints": [
      {
        "text": "The system has a finite number of defined conditions.",
        "penalty": 20
      },
      {
        "text": "Inputs or events cause transitions between states.",
        "penalty": 40
      },
      {
        "text": "Type 'STATE MACHINE' to control the Citadel door.",
        "penalty": 60
      }
    ],
    "fragment": 14,
    "evidenceTitle": "Citadel State Transition Diagram",
    "consequence": [
      "DOOR CONTROL RESTORED",
      "STATE MACHINE verified! The Citadel security transitions are operational."
    ],
    "keywords": [
      "STATE MACHINE",
      "STATEMACHINE",
      "FINITE STATE",
      "STATE",
      "TRANSITION",
      "FSM"
    ],
    "originalId": "Q34",
    "order": 14,
    "cleanTitle": "THE DOOR THAT CHANGED ITS MIND",
    "originalFragment": 34
  },
  {
    "id": "Q15",
    "title": "ROOM 15: THE MEMORY VAULT WITH EMPTY SHELVES",
    "subtitle": "Paging",
    "category": "Operating Systems",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE SCATTERED MEMORY VAULT</strong>",
      "The Citadel's memory vault contains a large logical memory space, but the available physical storage is scattered across many locations.",
      "A program requires several pieces of memory, yet there is no single large continuous empty area available.",
      "The engineers divide the program's logical memory into equal-sized sections called pages.",
      "Physical memory is also divided into fixed-size sections called frames.",
      "A page does not need to be placed next to the other pages belonging to the same program.",
      "One page can occupy one physical frame while another page is stored somewhere completely different.",
      "<strong>SHURI:</strong> “The program sees one continuous memory space, even though its pieces are physically scattered.”",
      "A page table records which physical frame contains each logical page.",
      "When the processor requests a particular page, the system uses this mapping to locate the corresponding frame.",
      "The memory diagram shows pages 0, 1, 2, and 3 mapped to different physical frames rather than one continuous block.",
      "This allows memory to be allocated more flexibly without requiring a large contiguous region.",
      "The final control panel asks:",
      "<strong>“Which memory-management technique divides logical memory into fixed-size pieces that can be stored in non-contiguous physical frames?”</strong>",
      "Enter the technique's name."
    ],
    "codeLines": [
      "page = virtual_address // PAGE_SIZE",
      "offset = virtual_address % PAGE_SIZE",
      "frame = page_table[page]"
    ],
    "question": "Which memory-management technique divides logical memory into fixed-size pieces that can be stored in non-contiguous physical frames? Enter the technique's name.",
    "hints": [
      {
        "text": "Logical memory is divided into equal-sized pages.",
        "penalty": 20
      },
      {
        "text": "Physical memory is divided into fixed-size frames.",
        "penalty": 40
      },
      {
        "text": "Type 'PAGING' to restore the memory vault.",
        "penalty": 60
      }
    ],
    "fragment": 15,
    "evidenceTitle": "Virtual Memory Page-Frame Map",
    "consequence": [
      "MEMORY RESTORED",
      "PAGING verified! Scattered physical frames are successfully mapped to logical pages."
    ],
    "keywords": [
      "PAGING",
      "PAGE",
      "FRAME",
      "PAGE TABLE",
      "VIRTUAL MEMORY"
    ],
    "originalId": "Q35",
    "order": 15,
    "cleanTitle": "THE MEMORY VAULT WITH EMPTY SHELVES",
    "originalFragment": 35
  },
  {
    "id": "Q16",
    "title": "ROOM 16: THE FIVE MISSIONS AND ONE IMPOSSIBLE HOUR",
    "subtitle": "Round Robin",
    "category": "Operating Systems",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE SHARED PROCESSOR</strong>",
      "Five rescue missions are waiting for CPU processing time inside Doom’s command center.",
      "The first mission begins running, but the processor does not allow it to continue indefinitely.",
      "After a fixed amount of time, the current mission is paused and another waiting mission receives the processor.",
      "The unfinished mission is placed back into the waiting rotation.",
      "The same process continues through the other missions.",
      "<strong>CAPTAIN AMERICA:</strong> “Nobody should control the processor forever while the others wait.”",
      "The schedule shows Mission A receiving a time slice, followed by Mission B, then Mission C, Mission D, and Mission E.",
      "After E finishes its turn, an unfinished mission from the earlier cycle returns to the end of the rotation.",
      "The system therefore repeatedly cycles through the ready processes.",
      "A second chart shows that a process requiring a long execution time receives several separate turns rather than one uninterrupted run.",
      "Doom's engineers explain that the fixed time slice helps interactive systems give every ready process an opportunity to execute.",
      "<strong>DOOM:</strong> “Every soldier receives a turn. None receives the throne forever.”",
      "The final console asks:",
      "<strong>“Which CPU scheduling method repeatedly gives each ready process a fixed time slice before moving to the next process?”</strong>",
      "Enter the scheduling method."
    ],
    "codeLines": [
      "while ready_queue:",
      "    process = ready_queue.pop(0)",
      "    run(process, time_quantum)",
      "    if not process.finished:",
      "        ready_queue.append(process)"
    ],
    "question": "Which CPU scheduling method repeatedly gives each ready process a fixed time slice before moving to the next process? Enter the scheduling method.",
    "hints": [
      {
        "text": "Each process receives a turn before the next process runs.",
        "penalty": 20
      },
      {
        "text": "The CPU uses a fixed time quantum and cycles through the ready processes.",
        "penalty": 40
      },
      {
        "text": "Type 'ROUND ROBIN' to activate the mission scheduler.",
        "penalty": 60
      }
    ],
    "fragment": 16,
    "evidenceTitle": "Round Robin CPU Scheduler",
    "consequence": [
      "PROCESSOR BALANCED",
      "ROUND ROBIN scheduling verified! Every waiting mission receives CPU time."
    ],
    "keywords": [
      "ROUND ROBIN",
      "ROUNDROBIN",
      "RR",
      "CPU",
      "SCHEDULING",
      "TIME QUANTUM"
    ],
    "originalId": "Q36",
    "order": 16,
    "cleanTitle": "THE FIVE MISSIONS AND ONE IMPOSSIBLE HOUR",
    "originalFragment": 36
  },
  {
    "id": "Q17",
    "title": "ROOM 17: THE MAP OF SHATTERED KINGDOMS",
    "subtitle": "DFS",
    "category": "Algorithms",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE VANISHED EXPLORER</strong>",
      "An explorer disappears while mapping a chain of connected kingdoms. Each kingdom contains roads leading to several others, and some roads eventually return to places already visited.",
      "The rescue team discovers his notebook. It shows that whenever he entered a new kingdom, he immediately followed one unexplored road and continued along that route as far as possible.",
      "When he reached a kingdom with no unexplored road, he returned to the previous kingdom and continued with another road.",
      "This caused distant kingdoms to be explored before nearby alternatives were fully examined.",
      "Captain America argues that the explorer should have inspected every nearby kingdom first. Shuri disagrees.",
      "The notebook clearly shows that the explorer completely investigated one path before returning to an unfinished branch.",
      "<strong>SPIDER-MAN:</strong> “He keeps going down one road until there’s nowhere left to go.”",
      "A damaged map confirms that his route was not based on distance. Whenever he reached a dead end, he returned to the most recently unfinished branch and continued from there.",
      "The explorer marked every kingdom immediately upon arrival. This prevented circular roads from causing him to wander endlessly through places he had already visited.",
      "The final pages contain a long chain of discoveries followed by sudden returns to earlier kingdoms.",
      "The rescue system asks:",
      "<strong>“Which graph-traversal method matches an explorer who follows one branch as deeply as possible before returning to investigate another branch?”</strong>",
      "Enter the traversal method."
    ],
    "codeLines": [
      "visited.add(node)",
      "for neighbor in graph[node]:",
      "    if neighbor not in visited:",
      "        DFS(neighbor)"
    ],
    "question": "Which graph-traversal method matches an explorer who follows one branch as deeply as possible before returning to investigate another branch? Enter the traversal method.",
    "hints": [
      {
        "text": "The search follows one branch as deeply as possible.",
        "penalty": 20
      },
      {
        "text": "When a branch ends, the search returns to an unfinished branch.",
        "penalty": 40
      },
      {
        "text": "Type 'DFS' to reconstruct the explorer's route.",
        "penalty": 60
      }
    ],
    "fragment": 17,
    "evidenceTitle": "Depth-First Kingdom Exploration Map",
    "consequence": [
      "KINGDOMS MAPPED",
      "DFS traversal verified! The explorer's deep-path route has been reconstructed."
    ],
    "keywords": [
      "DFS",
      "DEPTH FIRST SEARCH",
      "DEPTH-FIRST",
      "GRAPH",
      "STACK",
      "BACKTRACKING"
    ],
    "originalId": "Q37",
    "order": 17,
    "cleanTitle": "THE MAP OF SHATTERED KINGDOMS",
    "originalFragment": 37
  },
  {
    "id": "Q18",
    "title": "ROOM 18: THE MIRROR THAT KEPT EVERY VERSION",
    "subtitle": "Binary Search",
    "category": "Algorithms",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE ORDERED REALITY VAULT</strong>",
      "Doom possesses a vault containing thousands of numbered reality fragments arranged in strict ascending order.",
      "One fragment contains the only surviving copy of a weapon capable of repairing a Battleworld incursion.",
      "The vault is far too large to inspect fragment by fragment.",
      "A technician proposes opening the middle fragment first. If the target number is smaller, every fragment above the midpoint can immediately be ignored.",
      "If the target is larger, every fragment below the midpoint can be discarded.",
      "<strong>SHURI:</strong> “The ordering of the fragments is what makes it safe to eliminate half the vault.”",
      "The technician repeats the same process on the remaining range.",
      "For example, a search beginning with fragments 1 through 64 first examines the middle of that range rather than starting from fragment 1.",
      "Each comparison cuts the remaining possibilities roughly in half.",
      "A damaged search log shows only a small number of inspections despite the vault containing thousands of fragments.",
      "Another technician searches sequentially and requires far more checks.",
      "The final log contains repeated midpoint comparisons followed by the elimination of half of the remaining candidates.",
      "<strong>DOOM:</strong> “You do not need to look everywhere when the arrangement itself tells you where not to look.”",
      "The console asks:",
      "<strong>“What search algorithm repeatedly checks the middle of a sorted collection and discards half of the remaining search range?”</strong>",
      "Enter the algorithm name."
    ],
    "codeLines": [
      "low = 0",
      "high = len(items) - 1",
      "mid = (low + high) // 2",
      "if items[mid] == target:",
      "    return mid"
    ],
    "question": "What search algorithm repeatedly checks the middle of a sorted collection and discards half of the remaining search range? Enter the algorithm name.",
    "hints": [
      {
        "text": "The collection must be sorted.",
        "penalty": 20
      },
      {
        "text": "Each comparison eliminates roughly half of the remaining candidates.",
        "penalty": 40
      },
      {
        "text": "Type 'BINARY SEARCH' to locate the weapon fragment.",
        "penalty": 60
      }
    ],
    "fragment": 18,
    "evidenceTitle": "Binary Search Reality Vault Map",
    "consequence": [
      "TARGET LOCATED",
      "BINARY SEARCH verified! The weapon fragment has been identified efficiently."
    ],
    "keywords": [
      "BINARY SEARCH",
      "BINARYSEARCH",
      "SORTED",
      "MIDPOINT",
      "SEARCH"
    ],
    "originalId": "Q38",
    "order": 18,
    "cleanTitle": "THE MIRROR THAT KEPT EVERY VERSION",
    "originalFragment": 38
  },
  {
    "id": "Q19",
    "title": "ROOM 19: THE FEAST THAT COULD NOT REPEAT ITSELF",
    "subtitle": "Dynamic Programming",
    "category": "Algorithms",
    "difficulty": "Hard",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE FRACTURED TIMELINE</strong>",
      "An Avenger is trapped inside a fractured timeline. Each world offers several possible paths, and every decision changes the remaining resources available for the worlds ahead.",
      "At first, the rescue team explores every possible timeline separately.",
      "Soon they discover something strange. Different timelines eventually reach exactly the same smaller situation.",
      "One path may reach a particular world with six units of energy, while another completely different history reaches that same world with the same remaining state.",
      "The team realizes that they have already solved the problem from that point once before.",
      "<strong>SHURI:</strong> “Why solve the same smaller problem again when its answer has already been recorded?”",
      "The team begins storing the best result for every smaller state that it solves.",
      "Whenever another timeline reaches the same state, the system retrieves the stored result instead of recalculating everything.",
      "The number of repeated calculations drops dramatically.",
      "The archive now contains solutions for many smaller problems, which can be combined to determine the solution to the larger problem.",
      "An alternative implementation begins with the smallest states and gradually fills a table until the complete problem is solved.",
      "Both approaches rely on the same central idea: overlapping smaller problems should not be solved repeatedly.",
      "<strong>DOOM:</strong> “The timeline is branching, but the questions underneath the branches repeat.”",
      "The final console asks:",
      "<strong>“What algorithmic technique solves overlapping smaller subproblems once and stores their results for reuse?”</strong>",
      "Enter the technique's name."
    ],
    "codeLines": [
      "memo = {}",
      "function solve(state):",
      "    if state in memo:",
      "        return memo[state]",
      "    result = solve(smaller_state)",
      "    memo[state] = result",
      "    return result"
    ],
    "question": "What algorithmic technique solves overlapping smaller subproblems once and stores their results for reuse? Enter the technique's name.",
    "hints": [
      {
        "text": "Different paths can reach the same smaller problem.",
        "penalty": 20
      },
      {
        "text": "The solution to a smaller problem is stored so it can be reused.",
        "penalty": 40
      },
      {
        "text": "Type 'DYNAMIC PROGRAMMING' to stabilize the fractured timeline.",
        "penalty": 60
      }
    ],
    "fragment": 19,
    "evidenceTitle": "Dynamic Programming Timeline Archive",
    "consequence": [
      "TIMELINE STABILIZED",
      "DYNAMIC PROGRAMMING verified! Repeated subproblems are now solved only once."
    ],
    "keywords": [
      "DYNAMIC PROGRAMMING",
      "DYNAMICPROGRAMMING",
      "DP",
      "MEMOIZATION",
      "TABULATION",
      "SUBPROBLEM"
    ],
    "originalId": "Q39",
    "order": 19,
    "cleanTitle": "THE FEAST THAT COULD NOT REPEAT ITSELF",
    "originalFragment": 39
  },
  {
    "id": "Q20",
    "title": "ROOM 20: THE LIBRARY WHERE WORDS DIED",
    "subtitle": "Parsing",
    "category": "Compiler Design",
    "difficulty": "Medium",
    "enabled": true,
    "investigationType": "code",
    "story": [
      "<strong>⚠ THE FORBIDDEN INSCRIPTION</strong>",
      "An ancient inscription is discovered beneath Doom’s throne. It describes a ritual capable of opening a portal, but the inscription is written in a strict symbolic language.",
      "The symbols themselves are recognizable, but their arrangement determines whether the complete instruction is valid.",
      "One line contains an opening symbol without its required closing symbol. The library immediately rejects it.",
      "Another line contains all the correct symbols but places them in an order that violates the language's rules.",
      "<strong>SHURI:</strong> “The symbols are only the vocabulary. Their arrangement is the language.”",
      "A damaged translator first separates the incoming text into individual tokens.",
      "The system then examines how those tokens fit together according to a defined grammar.",
      "Some commands contain other commands, creating nested structures. Every inner structure must be completed correctly before the outer structure can be considered valid.",
      "The library's grammar defines which combinations of tokens are allowed and how they can be arranged.",
      "Changing the position of one token can therefore turn an otherwise valid instruction into an invalid one.",
      "<strong>DOOM:</strong> “You are not being asked whether the words exist. You are being asked whether they belong together.”",
      "The final console asks for the compiler-related process responsible for analyzing a sequence of tokens according to grammatical structure and determining how they form a valid syntactic structure.",
      "The portal begins accepting the inscription one symbol at a time.",
      "<strong>Enter the correct compiler process to open the portal.</strong>"
    ],
    "codeLines": [
      "// Token stream from lexical analysis",
      "tokens = lexer(source_code)",
      "// Syntax analysis",
      "parse(tokens)",
      "syntax_tree = build_parse_tree(tokens)"
    ],
    "question": "What compiler-related process is responsible for analyzing a sequence of tokens according to grammatical structure and determining how they form a valid syntactic structure? Enter 'PARSING'.",
    "hints": [
      {
        "text": "This process works on tokens produced by lexical analysis.",
        "penalty": 20
      },
      {
        "text": "It checks whether the tokens follow the grammar and form a valid syntactic structure.",
        "penalty": 40
      },
      {
        "text": "Type 'PARSING' to open the portal.",
        "penalty": 60
      }
    ],
    "fragment": 20,
    "evidenceTitle": "Compiler Syntax Analysis Blueprint",
    "consequence": [
      "PORTAL OPENED",
      "PARSING verified! The inscription's syntactic structure has been accepted."
    ],
    "keywords": [
      "PARSING",
      "PARSER",
      "PARSE",
      "COMPILER",
      "SYNTAX",
      "GRAMMAR",
      "PARSE TREE"
    ],
    "originalId": "Q40",
    "order": 20,
    "cleanTitle": "THE LIBRARY WHERE WORDS DIED",
    "originalFragment": 40
  }
];

// Initial In-Memory State
let db = {
  event_state: {
    status: 'CLOSED', // CLOSED | SESSION_1_ACTIVE | SESSION_1_LOCKED | SESSION_2_ACTIVE | SESSION_2_LOCKED | EVENT_FINISHED
    active_session: 0,
    session1_started_at: null,
    session1_locked_at: null,
    session2_started_at: null,
    session2_locked_at: null,
    event_finished_at: null,
    session_duration_minutes: 30,
    timer_paused: false,
    timer_paused_at: null,
    time_adjustment_seconds: 0
  },
  questions: DEFAULT_20_QUESTIONS,
  participants: {}, // participantId -> { id, teamName, token, registeredAt, lastActiveAt }
  question_assignments: {}, // participantId -> [ { assignmentId, questionId, sessionNumber, questionOrder, assignedAt } ]
  answers: [], // [ { answerId, participantId, questionId, sessionNumber, submittedAnswer, isCorrect, submittedAt } ]
  hints_used: {}, // participantId -> [ { questionId, hintIdx, penalty, usedAt } ]
  participant_sessions: {} // participantId -> { session1: { ... }, session2: { ... }, totalScore, totalPoints, totalTime }
};

// Load persistent state from disk if exists
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      db = {
        ...db,
        ...parsed,
        event_state: { ...db.event_state, ...(parsed.event_state || {}) },
        questions: (parsed.questions && parsed.questions.length > 0) ? parsed.questions : DEFAULT_20_QUESTIONS,
        hints_used: parsed.hints_used || {}
      };
    } else {
      saveDb();
    }
  } catch (err) {
    console.error('[DB] Failed to read database file, initializing defaults:', err);
    saveDb();
  }
}

// Instant sync trigger with micro-throttle (50ms) to coalesce rapid synchronous writes
let _syncTimer = null;
function triggerInstantMongoSync() {
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(async () => {
    try {
      if (isMongoConnected()) {
        await seedDataToMongo(db);
      }
    } catch (e) {
      // Non-blocking
    }
  }, 50);
}

// Safe persistent save to disk + immediate MongoDB push
function saveDb() {
  try {
    const json = JSON.stringify(db, null, 2);
    fs.writeFileSync(DB_FILE, json, 'utf8');
    triggerInstantMongoSync();
  } catch (err) {
    console.error('[DB] Failed to save database file:', err);
  }
}

loadDb();

// Periodic background sanity check (heartbeat sync)
setInterval(async () => {
  try {
    if (isMongoConnected()) {
      await seedDataToMongo(db);
    }
  } catch (e) {
    // Non-blocking
  }
}, 30_000);


// ─────────────────────────────────────────────────────────────────────────────
// DATABASE ACCESS METHODS
// ─────────────────────────────────────────────────────────────────────────────

export const Database = {
  // --- MONGODB TWO-WAY INITIALIZATION ---
  async syncWithMongo() {
    try {
      const mongoData = await loadDataFromMongo();
      if (mongoData && mongoData.questions && mongoData.questions.length > 0) {
        db = {
          ...db,
          ...mongoData,
          event_state: mongoData.event_state || db.event_state,
          questions: (mongoData.questions && mongoData.questions.length >= 14) ? mongoData.questions : db.questions,
          participants: { ...(db.participants || {}), ...(mongoData.participants || {}) },
          answers: (mongoData.answers && mongoData.answers.length > (db.answers || []).length) ? mongoData.answers : (db.answers || []),
          participant_sessions: { ...(db.participant_sessions || {}), ...(mongoData.participant_sessions || {}) },
          hints_used: { ...(db.hints_used || {}), ...(mongoData.hints_used || {}) }
        };
        saveDb();
        console.log(`[DB] ✅ Synced state from MongoDB (${Object.keys(db.participants || {}).length} teams, ${db.questions.length} questions).`);
      } else {
        await seedDataToMongo(db);
        console.log('[DB] ✅ Seeded initial questions, event state, and participants to MongoDB.');
      }
      return true;
    } catch (err) {
      console.warn('[DB] MongoDB sync note:', err.message);
      return false;
    }
  },

  getRawDb() {
    return { ...db };
  },

  // --- EVENT STATE ---
  getEventState(participantId = null) {
    const state = db.event_state;
    const now = Date.now();
    const activeSession = state.active_session || (state.status.startsWith('SESSION_2') ? 2 : (state.status.startsWith('SESSION_1') ? 1 : 0));
    const startedAt = activeSession ? state[`session${activeSession}_started_at`] : null;
    const durationMinutes = state.session_duration_minutes || 30;
    const timeAdjustmentSec = state.time_adjustment_seconds || 0;
    const baseAllowedSec = (durationMinutes * 60) + timeAdjustmentSec;

    // Calculate participant-specific hint penalties for the active session
    let participantHintPenaltySec = 0;
    if (participantId && db.hints_used && db.hints_used[participantId]) {
      const assignments = db.question_assignments[participantId] || [];
      const sessionQIds = new Set(assignments.filter(a => a.sessionNumber === activeSession).map(a => a.questionId));
      participantHintPenaltySec = db.hints_used[participantId]
        .filter(h => sessionQIds.has(h.questionId))
        .reduce((sum, h) => sum + (Number(h.penalty) || 20), 0);
    }

    let sessionRemainingSec = 0;
    let isExpired = false;

    if (startedAt && (state.status === 'SESSION_1_ACTIVE' || state.status === 'SESSION_2_ACTIVE')) {
      const effectiveNow = (state.timer_paused && state.timer_paused_at) ? state.timer_paused_at : now;
      const elapsedSec = Math.max(0, Math.floor((effectiveNow - startedAt) / 1000));
      const effectiveAllowedSec = Math.max(0, baseAllowedSec - participantHintPenaltySec);
      sessionRemainingSec = Math.max(0, effectiveAllowedSec - elapsedSec);
      if (sessionRemainingSec <= 0) isExpired = true;
    } else {
      sessionRemainingSec = Math.max(0, baseAllowedSec - participantHintPenaltySec);
    }

    return {
      ...state,
      active_session: activeSession,
      session_remaining_seconds: sessionRemainingSec,
      participant_hint_penalty_seconds: participantHintPenaltySec,
      is_expired: isExpired,
      server_time: now
    };
  },

  updateEventState(newStatus, options = {}) {
    const current = db.event_state;
    const now = Date.now();
    let nextState = { ...current };

    if (options.durationMinutes) {
      nextState.session_duration_minutes = Number(options.durationMinutes) || 30;
    }

    const durationMs = (nextState.session_duration_minutes || 30) * 60 * 1000;

    switch (newStatus) {
      case 'CLOSED':
        nextState = {
          ...nextState,
          status: 'CLOSED',
          active_session: 0
        };
        break;

      case 'SESSION_1_ACTIVE': {
        const isExpired = current.session1_started_at && (now - current.session1_started_at > durationMs);
        const shouldStartFresh = !current.session1_started_at || isExpired || options.resetTimer || current.status === 'CLOSED';
        nextState = {
          ...nextState,
          status: 'SESSION_1_ACTIVE',
          active_session: 1,
          session1_started_at: shouldStartFresh ? now : current.session1_started_at,
          session1_locked_at: null,
          timer_paused: false,
          timer_paused_at: null,
          time_adjustment_seconds: shouldStartFresh ? 0 : (current.time_adjustment_seconds || 0)
        };
        break;
      }

      case 'SESSION_1_LOCKED':
        nextState = {
          ...nextState,
          status: 'SESSION_1_LOCKED',
          active_session: 1,
          session1_locked_at: now
        };
        break;

      case 'SESSION_2_ACTIVE': {
        const isExpired = current.session2_started_at && (now - current.session2_started_at > durationMs);
        const shouldStartFresh = !current.session2_started_at || isExpired || options.resetTimer || current.status === 'SESSION_1_LOCKED' || current.status === 'CLOSED';
        nextState = {
          ...nextState,
          status: 'SESSION_2_ACTIVE',
          active_session: 2,
          session2_started_at: shouldStartFresh ? now : current.session2_started_at,
          session2_locked_at: null,
          timer_paused: false,
          timer_paused_at: null,
          time_adjustment_seconds: shouldStartFresh ? 0 : (current.time_adjustment_seconds || 0)
        };
        break;
      }

      case 'SESSION_2_LOCKED':
        nextState = {
          ...nextState,
          status: 'SESSION_2_LOCKED',
          active_session: 2,
          session2_locked_at: now
        };
        break;

      case 'EVENT_FINISHED':
        nextState = {
          ...nextState,
          status: 'EVENT_FINISHED',
          event_finished_at: now
        };
        break;

      default:
        throw new Error(`Invalid event status transition: ${newStatus}`);
    }

    db.event_state = nextState;
    saveDb();
    syncToMongo('EventState', 'upsert', {}, nextState);
    return this.getEventState();
  },

  adjustEventTime({ minutes, durationMinutes, action } = {}) {
    const current = db.event_state;
    let nextState = { ...current };

    if (action === 'pause') {
      nextState.timer_paused = true;
      nextState.timer_paused_at = Date.now();
    } else if (action === 'resume') {
      if (nextState.timer_paused && nextState.timer_paused_at) {
        const pausedDurationMs = Date.now() - nextState.timer_paused_at;
        const activeSess = nextState.active_session || 1;
        if (nextState[`session${activeSess}_started_at`]) {
          nextState[`session${activeSess}_started_at`] += pausedDurationMs;
        }
      }
      nextState.timer_paused = false;
      nextState.timer_paused_at = null;
    }

    if (durationMinutes !== undefined && durationMinutes !== null) {
      nextState.session_duration_minutes = Math.max(1, parseInt(durationMinutes, 10) || 30);
    }

    if (minutes !== undefined && minutes !== null && minutes !== 0) {
      // Adjust remaining time by shifting started_at timestamp or duration
      const deltaMs = Number(minutes) * 60 * 1000;
      const activeSess = nextState.active_session || 1;
      if (nextState[`session${activeSess}_started_at`]) {
        // If adding minutes (+5), we push started_at back in time (+ deltaMs to timer)
        nextState[`session${activeSess}_started_at`] += deltaMs;
      } else {
        nextState.session_duration_minutes = Math.max(1, (nextState.session_duration_minutes || 30) + Number(minutes));
      }
    }

    db.event_state = nextState;
    saveDb();
    syncToMongo('EventState', 'upsert', {}, nextState);
    return this.getEventState();
  },

  resetCompetition() {
    db.event_state = {
      status: 'CLOSED',
      active_session: 0,
      session1_started_at: null,
      session1_locked_at: null,
      session2_started_at: null,
      session2_locked_at: null,
      event_finished_at: null,
      session_duration_minutes: 30,
      timer_paused: false,
      timer_paused_at: null,
      time_adjustment_seconds: 0
    };
    db.participants = {};
    db.question_assignments = {};
    db.answers = [];
    db.hints_used = {};
    db.participant_sessions = {};
    saveDb();
    syncToMongo('EventState', 'upsert', {}, db.event_state);
    syncToMongo('Participant', 'deleteMany', {});
    syncToMongo('QuestionAssignment', 'deleteMany', {});
    syncToMongo('Answer', 'deleteMany', {});
    syncToMongo('ParticipantSession', 'deleteMany', {});
    return this.getEventState();
  },

  // --- QUESTIONS (BANK) ---
  reloadQuestionsFromDefaults() {
    db.questions = DEFAULT_20_QUESTIONS;
    saveDb();
    return db.questions;
  },

  setQuestions(questionsList) {
    if (Array.isArray(questionsList) && questionsList.length > 0) {
      db.questions = questionsList;
      saveDb();
    }
    return db.questions;
  },

  getAllQuestions(includeSecrets = false) {
    if (includeSecrets) {
      return db.questions;
    }
    // Sanitize question data (remove keywords/solution keys)
    return db.questions.map(({ keywords, ...rest }) => rest);
  },

  getQuestionById(id, includeSecrets = false) {
    const q = db.questions.find((item) => item.id === id);
    if (!q) return null;
    if (includeSecrets) return q;
    const { keywords, ...rest } = q;
    return rest;
  },

  addQuestion(questionData) {
    const newId = questionData.id || `Q${String(db.questions.length + 1).padStart(2, '0')}`;
    const newQ = {
      ...questionData,
      id: newId,
      enabled: questionData.enabled !== undefined ? questionData.enabled : true,
      keywords: questionData.keywords || []
    };
    db.questions.push(newQ);
    saveDb();
    syncToMongo('Question', 'upsert', { id: newQ.id }, newQ);
    return newQ;
  },

  bulkImportQuestions(questionsList) {
    if (!Array.isArray(questionsList) || questionsList.length === 0) {
      throw new Error('Expected a non-empty array of question objects.');
    }

    const imported = [];
    for (let i = 0; i < questionsList.length; i++) {
      const q = questionsList[i];
      if (!q.title && !q.question) {
        throw new Error(`Item ${i + 1} is missing both 'title' and 'question' fields.`);
      }

      const qId = q.id || `Q${String(db.questions.length + 1).padStart(2, '0')}`;
      const existingIdx = db.questions.findIndex((item) => item.id === qId);

      const parsedKeywords = Array.isArray(q.keywords)
        ? q.keywords.map(k => String(k).trim().toUpperCase()).filter(Boolean)
        : (q.keywords ? String(q.keywords).split(',').map(k => k.trim().toUpperCase()).filter(Boolean) : []);

      const finalAnswer = q.answer || parsedKeywords[0] || '';
      if (finalAnswer && !parsedKeywords.includes(finalAnswer.toUpperCase())) {
        parsedKeywords.unshift(finalAnswer.toUpperCase());
      }

      const normalizedQ = {
        id: qId,
        title: q.title || 'Challenge Room',
        subtitle: q.subtitle || 'System Protocol',
        category: q.category || 'Computer Systems',
        difficulty: q.difficulty || 'Medium',
        enabled: q.enabled !== undefined ? Boolean(q.enabled) : true,
        investigationType: q.investigationType || 'code',
        story: Array.isArray(q.story) ? q.story : [String(q.story || 'Classified intel.')],
        codeLines: Array.isArray(q.codeLines) ? q.codeLines : (q.codeLines ? String(q.codeLines).split('\n') : []),
        question: q.question || q.title || 'Examine the telemetry and identify the key.',
        answer: finalAnswer,
        hints: Array.isArray(q.hints) && q.hints.length > 0 ? q.hints : [
          { text: 'Analyze the system telemetry carefully.', penalty: 20 },
          { text: 'Consider fundamental computer science principles.', penalty: 40 }
        ],
        fragment: q.fragment || (db.questions.length + 1),
        evidenceTitle: q.evidenceTitle || `${q.title || 'Security'} Evidence Log`,
        consequence: Array.isArray(q.consequence) ? q.consequence : ['PROTOCOL OVERRIDDEN', 'Access granted.'],
        keywords: parsedKeywords
      };

      if (existingIdx !== -1) {
        db.questions[existingIdx] = normalizedQ;
      } else {
        db.questions.push(normalizedQ);
      }

      syncToMongo('Question', 'upsert', { id: normalizedQ.id }, normalizedQ);
      imported.push(normalizedQ);
    }

    saveDb();
    return imported;
  },

  updateQuestion(id, patch) {
    const idx = db.questions.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    db.questions[idx] = {
      ...db.questions[idx],
      ...patch
    };
    saveDb();
    syncToMongo('Question', 'upsert', { id: db.questions[idx].id }, db.questions[idx]);
    return db.questions[idx];
  },

  deleteQuestion(id) {
    const idx = db.questions.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    db.questions.splice(idx, 1);
    saveDb();
    syncToMongo('Question', 'deleteMany', { id: id });
    return true;
  },

  // --- PARTICIPANTS & CREDENTIAL MANAGEMENT ---
  createParticipantCredentials(teamNameRaw, teamPasswordRaw = '') {
    const teamName = String(teamNameRaw || '').trim().toUpperCase();
    const teamPassword = String(teamPasswordRaw || '').trim();
    if (!teamName) {
      throw new Error('Team name is required.');
    }
    if (!teamPassword) {
      throw new Error('Password is required.');
    }

    // Check if teamName already exists
    let existing = Object.values(db.participants).find((p) => p.teamName === teamName);
    if (existing) {
      throw new Error(`Team '${teamName}' already exists. Please choose a different team name.`);
    }

    // Register new participant credentials
    const participantId = `TEAM_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const token = `tok_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;

    const participant = {
      id: participantId,
      teamName,
      token,
      teamPassword: teamPassword,
      passcode: teamPassword,
      registeredAt: Date.now(),
      lastActiveAt: Date.now(),
      createdByAdmin: true
    };

    db.participants[participantId] = participant;

    // Initialize session records
    const sessionRecord = {
      participantId,
      teamName,
      session1: { startedAt: null, completedAt: null, duration: 0, score: 0, answersCount: 0, completed: false },
      session2: { startedAt: null, completedAt: null, duration: 0, score: 0, answersCount: 0, completed: false },
      totalScore: 0,
      totalTime: 0
    };
    db.participant_sessions[participantId] = sessionRecord;

    // Assign randomized 14 questions (7 for S1, 7 for S2) atomically
    this.generateRandomQuestionsForParticipant(participantId);
    saveDb();

    syncToMongo('Participant', 'upsert', { id: participant.id }, participant);
    syncToMongo('ParticipantSession', 'upsert', { participantId }, sessionRecord);

    return participant;
  },

  updateParticipantCredentials(participantId, newTeamPasswordRaw) {
    const participant = db.participants[participantId];
    if (!participant) {
      throw new Error('Participant not found.');
    }
    const newPassword = String(newTeamPasswordRaw || '').trim();
    if (!newPassword) {
      throw new Error('New password cannot be empty.');
    }

    participant.teamPassword = newPassword;
    participant.passcode = newPassword;
    saveDb();

    syncToMongo('Participant', 'upsert', { id: participant.id }, participant);
    return participant;
  },

  deleteParticipant(participantId) {
    if (!db.participants[participantId]) {
      return false;
    }
    delete db.participants[participantId];
    delete db.participant_sessions[participantId];
    delete db.question_assignments[participantId];
    delete db.hints_used[participantId];
    if (db.answers) {
      db.answers = db.answers.filter((ans) => ans.participantId !== participantId);
    }
    saveDb();

    syncToMongo('Participant', 'deleteMany', { id: participantId });
    syncToMongo('ParticipantSession', 'deleteMany', { participantId });
    syncToMongo('QuestionAssignment', 'deleteMany', { participantId });
    syncToMongo('HintUsed', 'deleteMany', { participantId });
    syncToMongo('Answer', 'deleteMany', { participantId });
    return true;
  },

  registerParticipant(teamNameRaw, teamPasswordRaw = '') {
    return this.createParticipantCredentials(teamNameRaw, teamPasswordRaw);
  },

  loginParticipant(teamNameRaw, teamPasswordRaw = '') {
    const teamName = String(teamNameRaw || '').trim().toUpperCase();
    const teamPassword = String(teamPasswordRaw || '').trim();
    if (!teamName) {
      throw new Error('Team name is required.');
    }

    const participant = Object.values(db.participants).find((p) => p.teamName === teamName);
    if (!participant) {
      throw new Error(`ACCESS DENIED: Team '${teamName}' not found. Please obtain login credentials from the administrator.`);
    }

    if (participant.teamPassword && participant.teamPassword !== teamPassword) {
      throw new Error('INCORRECT PASSWORD: Enter the password provided by your event administrator.');
    }

    participant.lastActiveAt = Date.now();
    saveDb();
    return participant;
  },

  getParticipantByToken(token) {
    if (!token) return null;
    return Object.values(db.participants).find((p) => p.token === token) || null;
  },

  getParticipantById(id) {
    return db.participants[id] || null;
  },

  // Per-Participant Random Question Generator (14 unique questions: 7 in S1, 7 in S2)
  generateRandomQuestionsForParticipant(participantId) {
    // Only skip generation if assignments are complete (14 total: 7 per session).
    // A partial set (e.g. after a bad sync) must be regenerated.
    const existing = db.question_assignments[participantId] || [];
    if (existing.length >= 14) {
      return existing;
    }
    if (existing.length > 0) {
      console.warn(`[DB] Participant ${participantId} had incomplete assignments (${existing.length}/14) — regenerating.`);
    }

    const enabledPool = db.questions.filter((q) => q.enabled !== false);
    if (enabledPool.length < 14) {
      console.warn(`[DB] Question pool has only ${enabledPool.length} enabled questions. Requiring 14.`);
    }

    // Calculate question usage for fairness distribution
    const usageCounts = {};
    enabledPool.forEach((q) => { usageCounts[q.id] = 0; });
    Object.values(db.question_assignments).forEach((arr) => {
      arr.forEach((assign) => {
        if (usageCounts[assign.questionId] !== undefined) {
          usageCounts[assign.questionId]++;
        }
      });
    });

    // Shuffle pool with weighted randomness for fair question exposure
    const shuffledPool = [...enabledPool].sort((a, b) => {
      const diff = (usageCounts[a.id] || 0) - (usageCounts[b.id] || 0);
      if (diff !== 0) return diff + (Math.random() - 0.5) * 2;
      return Math.random() - 0.5;
    });

    const randomized14 = shuffledPool.slice(0, 14);
    const assignments = [];

    // Session 1: 7 Questions (order 1..7)
    for (let i = 0; i < 7; i++) {
      if (randomized14[i]) {
        assignments.push({
          assignmentId: `A_${participantId}_S1_${i + 1}`,
          questionId: randomized14[i].id,
          sessionNumber: 1,
          questionOrder: i + 1,
          assignedAt: Date.now()
        });
      }
    }

    // Session 2: 7 Questions (order 1..7, levelNumber 8..14)
    for (let i = 7; i < 14; i++) {
      if (randomized14[i]) {
        assignments.push({
          assignmentId: `A_${participantId}_S2_${i + 1 - 7}`,
          questionId: randomized14[i].id,
          sessionNumber: 2,
          questionOrder: i + 1 - 7,
          assignedAt: Date.now()
        });
      }
    }

    db.question_assignments[participantId] = assignments;
    saveDb();
    // Sync new question assignments to MongoDB
    for (const a of assignments) {
      syncToMongo('QuestionAssignment', 'upsert', { assignmentId: a.assignmentId }, { ...a, participantId });
    }
    return assignments;
  },

  generateRandom10QuestionsForParticipant(participantId) {
    return this.generateRandomQuestionsForParticipant(participantId);
  },

  getParticipantQuestionsForSession(participantId, sessionNumber) {
    // Auto-generate question assignments if participant has none (e.g. registered before
    // assignments existed, or assignments lost during DB sync from MongoDB).
    if (!db.question_assignments[participantId] || db.question_assignments[participantId].length === 0) {
      console.log(`[DB] No question assignments found for ${participantId} — auto-generating now.`);
      this.generateRandomQuestionsForParticipant(participantId);
    }
    const allAssignments = db.question_assignments[participantId] || [];
    const sessionAssignments = allAssignments.filter((a) => a.sessionNumber === sessionNumber);

    return sessionAssignments.map((assign) => {
      const fullQ = db.questions.find((q) => q.id === assign.questionId || q.originalId === assign.questionId);
      if (!fullQ) return null;

      // Check if participant already answered this question correctly
      const isSolved = (db.answers || []).some(
        (ans) => ans.participantId === participantId && ans.questionId === assign.questionId && ans.isCorrect
      );

      const levelNumber = sessionNumber === 1 ? assign.questionOrder : (assign.questionOrder + 7);
      const formattedLevelStr = String(levelNumber).padStart(2, '0');
      // Strip any static "ROOM XX:", "ROOM X:", "CHAMBER XX:", "STAGE XX:", "LEVEL XX:" prefix from fullQ.title
      const rawTitle = fullQ.title || fullQ.name || '';
      const cleanTitle = rawTitle.replace(/^(ROOM|CHAMBER|STAGE|LEVEL|SECTOR)\s*\d+[:\-—\s]*/i, '').trim();
      const dynamicTitle = `ROOM ${formattedLevelStr}: ${cleanTitle}`;

      // Return sanitized payload WITHOUT answers/keywords
      return {
        assignmentId: assign.assignmentId,
        order: assign.questionOrder,
        levelNumber: levelNumber,
        id: fullQ.id,
        key: `q_${fullQ.id.toLowerCase()}`,
        title: dynamicTitle,
        name: dynamicTitle,
        cleanTitle: cleanTitle,
        subtitle: fullQ.subtitle,
        category: fullQ.category,
        difficulty: fullQ.difficulty,
        investigationType: fullQ.investigationType,
        story: fullQ.story,
        codeLines: fullQ.codeLines,
        question: fullQ.question,
        hints: fullQ.hints,
        fragment: fullQ.fragment,
        evidenceTitle: fullQ.evidenceTitle,
        consequence: fullQ.consequence,
        isSolved: Boolean(isSolved)
      };
    }).filter(Boolean);
  },

  // --- ANSWER SUBMISSION & SCORING ---
  submitAnswer(participantId, questionId, sessionNumber, rawAnswer) {
    const participant = db.participants[participantId];
    if (!participant) {
      throw new Error('Participant not found.');
    }

    const question = db.questions.find((q) => q.id === questionId || q.originalId === questionId);
    if (!question) {
      throw new Error('Question not found.');
    }

    // Check if session status is active
    const expectedStatus = sessionNumber === 1 ? 'SESSION_1_ACTIVE' : 'SESSION_2_ACTIVE';
    if (db.event_state.status !== expectedStatus) {
      throw new Error(`CHAMBER LOCKED: Session ${sessionNumber} is currently not accepting submissions.`);
    }

    // Check if session countdown timer has expired (taking into account hint penalties)
    const startedAt = db.event_state[`session${sessionNumber}_started_at`];
    const durationMin = db.event_state.session_duration_minutes || 30;
    const timeAdjSec = db.event_state.time_adjustment_seconds || 0;
    const baseAllowedSec = durationMin * 60 + timeAdjSec;

    const participantHints = (db.hints_used && db.hints_used[participantId]) || [];
    const allAssignments = db.question_assignments[participantId] || [];
    const sessionQIds = new Set(allAssignments.filter(a => a.sessionNumber === sessionNumber).map(a => a.questionId));
    const sessionHintPenaltySec = participantHints
      .filter(h => sessionQIds.has(h.questionId))
      .reduce((sum, h) => sum + (Number(h.penalty) || 20), 0);

    const effectiveAllowedMs = Math.max(0, (baseAllowedSec - sessionHintPenaltySec)) * 1000;
    if (startedAt && (Date.now() - startedAt) > effectiveAllowedMs) {
      throw new Error('COUNTDOWN EXPIRED: The session timer has ended. Chamber inputs are locked.');
    }

    // Sequential lock removed — participants can attempt any assigned room in any order.
    // The room list is shown in order in the UI so natural progression is encouraged.

    // Clean answer input
    const clean = (val) => String(val || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cleanInput = clean(rawAnswer);

    // Validate against question keywords, answer, or subtitle
    const candidateKeywords = [
      ...(Array.isArray(question.keywords) ? question.keywords : []),
      question.answer,
      question.subtitle
    ].filter(Boolean);

    const isCorrect = candidateKeywords.some((kw) => {
      const cleanKw = clean(kw);
      return cleanKw.length > 0 && (cleanInput === cleanKw || cleanInput.includes(cleanKw) || cleanKw.includes(cleanInput));
    });

    // Check for existing correct submission to avoid double-scoring
    const existingCorrect = db.answers.find(
      (ans) => ans.participantId === participantId && ans.questionId === questionId && ans.isCorrect
    );

    const answerRecord = {
      answerId: `ANS_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      participantId,
      questionId,
      sessionNumber,
      submittedAnswer: rawAnswer,
      isCorrect,
      submittedAt: Date.now()
    };

    db.answers.push(answerRecord);

    // Points calculation: 0 hints = 100, 1 hint = 70, 2 hints = 40, 3 hints = 0 points!
    const qHints = participantHints.filter((h) => h.questionId === questionId);
    let pointsEarned = 100;
    let hintMessage = '';
    if (qHints.length >= 3) {
      pointsEarned = 0; // 3 hints = ZERO POINTS!
      hintMessage = 'OVERRIDE CIPHER ACCEPTED — 0 POINTS AWARDED (3 HINTS USED)';
    } else if (qHints.length === 2) {
      pointsEarned = 40;
      hintMessage = '+40 POINTS (2 HINTS USED)';
    } else if (qHints.length === 1) {
      pointsEarned = 70;
      hintMessage = '+70 POINTS (1 HINT USED)';
    } else {
      pointsEarned = 100;
      hintMessage = '+100 POINTS (CLEAN OVERRIDE)';
    }

    // Update Session Score & Stats
    const sessionKey = sessionNumber === 1 ? 'session1' : 'session2';
    const pSession = db.participant_sessions[participantId];
    if (pSession) {
      if (!pSession[sessionKey].startedAt) {
        pSession[sessionKey].startedAt = db.event_state[`session${sessionNumber}_started_at`] || Date.now();
      }

      if (isCorrect && !existingCorrect) {
        pSession[sessionKey].score = (pSession[sessionKey].score || 0) + 1;
        pSession.totalScore = (pSession.session1.score || 0) + (pSession.session2.score || 0);
      }

      pSession[sessionKey].answersCount = (pSession[sessionKey].answersCount || 0) + 1;
    }

    participant.lastActiveAt = Date.now();
    saveDb();

    syncToMongo('Answer', 'insert', {}, answerRecord);
    if (pSession) {
      syncToMongo('ParticipantSession', 'upsert', { participantId }, pSession);
    }

    return {
      success: isCorrect,
      isCorrect,
      pointsEarned: isCorrect ? pointsEarned : 0,
      hintsUsedOnQuestion: qHints.length,
      fragment: isCorrect ? question.fragment : null,
      evidenceTitle: isCorrect ? question.evidenceTitle : null,
      successNote: isCorrect
        ? `${question.consequence?.[1] || 'Answer verified!'} [${hintMessage}]`
        : 'ACCESS DENIED — response not recognized.'
    };
  },

  recordHintUsage(participantId, questionId, hintIdx, penalty = 20) {
    if (!db.hints_used[participantId]) {
      db.hints_used[participantId] = [];
    }

    const alreadyLogged = db.hints_used[participantId].some(
      (h) => h.questionId === questionId && h.hintIdx === hintIdx
    );

    const penaltyNum = Number(penalty) || 20;

    if (!alreadyLogged) {
      const hintRecord = {
        questionId,
        hintIdx,
        penalty: penaltyNum,
        usedAt: Date.now()
      };
      db.hints_used[participantId].push(hintRecord);
      saveDb();
      syncToMongo('HintUsed', 'insert', {}, { participantId, ...hintRecord });
    }

    // Authoritative event state with hint penalties applied
    const state = this.getEventState(participantId);

    return {
      hints: db.hints_used[participantId],
      penaltyDeducted: penaltyNum,
      participantHintPenaltySeconds: state.participant_hint_penalty_seconds,
      remainingSeconds: state.session_remaining_seconds,
      isExpired: state.is_expired
    };
  },

  getParticipantHints(participantId) {
    return (db.hints_used && db.hints_used[participantId]) || [];
  },

  completeSession(participantId, sessionNumber) {
    const pSession = db.participant_sessions[participantId];
    if (!pSession) return null;

    const sessionKey = sessionNumber === 1 ? 'session1' : 'session2';
    const now = Date.now();
    const startedAt = pSession[sessionKey].startedAt || db.event_state[`session${sessionNumber}_started_at`] || now;
    const duration = Math.max(0, Math.floor((now - startedAt) / 1000));

    pSession[sessionKey].completedAt = now;
    pSession[sessionKey].duration = duration;
    pSession[sessionKey].completed = true;

    pSession.totalTime = (pSession.session1.duration || 0) + (pSession.session2.duration || 0);
    pSession.totalScore = (pSession.session1.score || 0) + (pSession.session2.score || 0);

    saveDb();
    syncToMongo('ParticipantSession', 'upsert', { participantId }, pSession);
    return pSession;
  },

  // --- LEADERBOARD & SCORING SYSTEM ---
  getLeaderboard() {
    const rows = Object.values(db.participant_sessions).map((entry) => {
      const participantId = entry.participantId;
      const participantHints = (db.hints_used && db.hints_used[participantId]) || [];
      const participantAnswers = (db.answers || []).filter((a) => a.participantId === participantId && a.isCorrect);

      // Collect unique solved question IDs
      const solvedQIds = new Set(participantAnswers.map((a) => a.questionId));

      let totalPoints = 0;
      let session1Points = 0;
      let session2Points = 0;
      let totalPenalty = 0;

      // Points per solved room:
      // 0 hints = 100 pts, 1 hint = 70 pts, 2 hints = 40 pts, 3 hints = 0 pts!
      solvedQIds.forEach((qId) => {
        const qHints = participantHints.filter((h) => h.questionId === qId);
        let qEarned = 100;
        if (qHints.length >= 3) {
          qEarned = 0; // 3 hints = ZERO POINTS!
        } else if (qHints.length === 2) {
          qEarned = 40;
        } else if (qHints.length === 1) {
          qEarned = 70;
        }

        const assign = (db.question_assignments[participantId] || []).find((a) => a.questionId === qId);
        if (assign && assign.sessionNumber === 1) {
          session1Points += qEarned;
        } else if (assign && assign.sessionNumber === 2) {
          session2Points += qEarned;
        }
        totalPoints += qEarned;
      });

      participantHints.forEach((h) => {
        totalPenalty += (Number(h.penalty) || 20);
      });

      const totalTime = (entry.session1?.duration || 0) + (entry.session2?.duration || 0);

      return {
        participantId: entry.participantId,
        teamName: entry.teamName,
        solvedCount: solvedQIds.size,
        hintsUsedCount: participantHints.length,
        totalPenalty,
        totalPoints,
        session1Score: entry.session1?.score || 0,
        session1Points,
        session1Time: entry.session1?.duration || 0,
        session1Completed: Boolean(entry.session1?.completed),
        session2Score: entry.session2?.score || 0,
        session2Points,
        session2Time: entry.session2?.duration || 0,
        session2Completed: Boolean(entry.session2?.completed),
        totalScore: (entry.session1?.score || 0) + (entry.session2?.score || 0),
        totalTime,
        isComplete: Boolean(entry.session1?.completed && entry.session2?.completed)
      };
    });

    // Ranking Logic:
    // 1. Highest Total Points (100 pts / room minus hint penalties)
    // 2. Lowest Total Time (Tie-breaker!)
    rows.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return a.totalTime - b.totalTime;
    });

    return rows.map((r, idx) => ({ ...r, rank: idx + 1 }));
  },

  // --- ADMIN PROGRESS TRACKER ---
  getAdminProgress() {
    const leaderboardRows = this.getLeaderboard();
    const participantsList = Object.values(db.participants).map((p) => {
      const sess = db.participant_sessions[p.id] || {};
      const lb = leaderboardRows.find((r) => r.participantId === p.id) || {};

      let currentSession = 'Waiting';
      let progress = '0 / 7';

      if (db.event_state.status === 'SESSION_1_ACTIVE' || db.event_state.status === 'SESSION_1_LOCKED') {
        currentSession = 'Session 1';
        progress = `${sess.session1?.score || 0} / 7`;
      } else if (db.event_state.status === 'SESSION_2_ACTIVE' || db.event_state.status === 'SESSION_2_LOCKED') {
        currentSession = 'Session 2';
        progress = `${sess.session2?.score || 0} / 7`;
      } else if (db.event_state.status === 'EVENT_FINISHED') {
        currentSession = 'Completed';
        progress = `${(sess.session1?.score || 0) + (sess.session2?.score || 0)} / 14`;
      }

      return {
        id: p.id,
        teamName: p.teamName,
        teamPassword: p.teamPassword || p.passcode || '',
        registeredAt: p.registeredAt,
        lastActiveAt: p.lastActiveAt,
        currentSession,
        progress,
        rank: lb.rank || '-',
        solvedCount: lb.solvedCount || 0,
        hintsUsedCount: lb.hintsUsedCount || 0,
        totalPenalty: lb.totalPenalty || 0,
        totalPoints: lb.totalPoints || 0,
        session1Score: sess.session1?.score || 0,
        session1Points: lb.session1Points || 0,
        session1Time: sess.session1?.duration || 0,
        session1Completed: Boolean(sess.session1?.completed),
        session2Score: sess.session2?.score || 0,
        session2Points: lb.session2Points || 0,
        session2Time: sess.session2?.duration || 0,
        session2Completed: Boolean(sess.session2?.completed),
        totalScore: (sess.session1?.score || 0) + (sess.session2?.score || 0),
        totalTime: (sess.session1?.duration || 0) + (sess.session2?.duration || 0)
      };
    });

    return {
      eventState: this.getEventState(),
      totalParticipants: participantsList.length,
      participants: participantsList,
      leaderboard: leaderboardRows
    };
  }
};
