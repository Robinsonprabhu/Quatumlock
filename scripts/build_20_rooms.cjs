const fs = require('fs');
const path = require('path');

const RAW_QUESTIONS = [
  {
    "id": "Q21",
    "title": "ROOM 21: THE LAST LIGHT OF BATTLEWORLD",
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
    "fragment": 21,
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
    ]
  },
  {
    "id": "Q22",
    "title": "ROOM 22: THE ARMY THAT COULD NOT WAIT",
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
    "fragment": 22,
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
    ]
  },
  {
    "id": "Q23",
    "title": "ROOM 23: THE CHAIN OF VANISHED HEROES",
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
    "fragment": 23,
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
    ]
  },
  {
    "id": "Q24",
    "title": "ROOM 24: THE FAMILY DOOM ERASED",
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
    "fragment": 24,
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
    ]
  },
  {
    "id": "Q25",
    "title": "ROOM 25: THE CITY WITH NO RETURN",
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
    "fragment": 25,
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
    ]
  },
  {
    "id": "Q26",
    "title": "ROOM 26: THE ROAD DOOM COULD NOT FORGET",
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
    "fragment": 26,
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
    ]
  },
  {
    "id": "Q27",
    "title": "ROOM 27: THE CLOCK THAT GAVE DOOM TOO MANY TOMORROWS",
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
    "fragment": 27,
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
    ]
  },
  {
    "id": "Q28",
    "title": "ROOM 28: THE FEAST OF A THOUSAND WORLDS",
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
    "fragment": 28,
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
    ]
  },
  {
    "id": "Q29",
    "title": "ROOM 29: THE TWO AVENGERS WHO SHARED ONE MEMORY",
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
    "fragment": 29,
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
    ]
  },
  {
    "id": "Q30",
    "title": "ROOM 30: THE KINGDOM THAT FORGOT ITS CITIZENS",
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
    "fragment": 30,
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
    ]
  },
  {
    "id": "Q31",
    "title": "ROOM 31: THE FOUR GUARDS WHO WOULD NOT MOVE",
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
    "fragment": 31,
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
    ]
  },
  {
    "id": "Q32",
    "title": "ROOM 32: THE DAY THE CLONES ANSWERED DIFFERENTLY",
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
    "fragment": 32,
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
    ]
  },
  {
    "id": "Q33",
    "title": "ROOM 33: THE HOUSE THAT INHERITED A WAR",
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
    "fragment": 33,
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
    ]
  },
  {
    "id": "Q34",
    "title": "ROOM 34: THE DOOR THAT CHANGED ITS MIND",
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
    "fragment": 34,
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
    ]
  },
  {
    "id": "Q35",
    "title": "ROOM 35: THE MEMORY VAULT WITH EMPTY SHELVES",
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
    "fragment": 35,
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
    ]
  },
  {
    "id": "Q36",
    "title": "ROOM 36: THE FIVE MISSIONS AND ONE IMPOSSIBLE HOUR",
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
    "fragment": 36,
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
    ]
  },
  {
    "id": "Q37",
    "title": "ROOM 37: THE MAP OF SHATTERED KINGDOMS",
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
    "fragment": 37,
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
    ]
  },
  {
    "id": "Q38",
    "title": "ROOM 38: THE MIRROR THAT KEPT EVERY VERSION",
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
    "fragment": 38,
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
    ]
  },
  {
    "id": "Q39",
    "title": "ROOM 39: THE FEAST THAT COULD NOT REPEAT ITSELF",
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
    "fragment": 39,
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
    ]
  },
  {
    "id": "Q40",
    "title": "ROOM 40: THE LIBRARY WHERE WORDS DIED",
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
    "fragment": 40,
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
    ]
  }
];

// Helper to construct normalized 20 room questions
// We support both primary IDs Q01..Q20 AND aliases/originalId Q21..Q40
const processedQuestions = RAW_QUESTIONS.map((raw, idx) => {
  const roomNum = idx + 1;
  const formattedRoomStr = String(roomNum).padStart(2, '0');
  const cleanTitle = raw.title.replace(/^(ROOM|CHAMBER|STAGE|LEVEL|SECTOR)\s*\d+[:\-—\s]*/i, '').trim();
  const roomTitle = `ROOM ${formattedRoomStr}: ${cleanTitle}`;

  // Extra keyword variations to ensure robust validation
  const extraKeywords = [];
  if (raw.subtitle) {
    extraKeywords.push(raw.subtitle.toUpperCase());
    extraKeywords.push(raw.subtitle.toUpperCase().replace(/\s+/g, ''));
  }
  if (raw.keywords && raw.keywords[0]) {
    extraKeywords.push(raw.keywords[0]);
    extraKeywords.push(raw.keywords[0].replace(/\s+/g, ''));
  }

  const mergedKeywords = Array.from(new Set([...(raw.keywords || []), ...extraKeywords]));

  return {
    ...raw,
    id: `Q${formattedRoomStr}`,
    originalId: raw.id,
    order: roomNum,
    title: roomTitle,
    cleanTitle: cleanTitle,
    fragment: roomNum,
    originalFragment: raw.fragment,
    enabled: true,
    keywords: mergedKeywords
  };
});

console.log('Processed 20 questions successfully:');
processedQuestions.forEach(q => console.log(`${q.id} (${q.originalId}) -> ${q.title} [Subtitle: ${q.subtitle}]`));

// 1. Update server/data/escape_db.json
const dbPath = path.join(__dirname, '..', 'server', 'data', 'escape_db.json');
if (fs.existsSync(dbPath)) {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  dbData.questions = processedQuestions;
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log(`Updated ${dbPath} with 20 new questions!`);
}

// 2. Update src/data/newQuestionsData.js
const newQuestionsDataPath = path.join(__dirname, '..', 'src', 'data', 'newQuestionsData.js');
const newQuestionsJsContent = `const newQuestions = ${JSON.stringify(processedQuestions, null, 2)};\n\nexport { newQuestions };\n`;
fs.writeFileSync(newQuestionsDataPath, newQuestionsJsContent, 'utf8');
console.log(`Updated ${newQuestionsDataPath}`);

// 3. Update src/data/stages.js
const stagesPath = path.join(__dirname, '..', 'src', 'data', 'stages.js');
const stagesObj = {};
const all20ForStages = processedQuestions.map((q, idx) => {
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
    fragment: q.fragment,
    originalId: q.originalId,
    evidenceTitle: q.evidenceTitle,
    consequence: q.consequence,
    keywords: q.keywords
  };
  stagesObj[levelKey] = stageItem;
  return stageItem;
});

const introDialogues = {
  "level_1": "Doctor Doom's lower dungeons are under alert. Identify the prison admission structure to breach Room 01.",
  "level_2": "Approaching Crimson Gate evacuation. Analyze the queue mechanics to stabilize the threshold.",
  "level_3": "Sector Seven relic chain located. Follow the reference links to restore the path.",
  "level_4": "Royal archive genealogy tablet recovered. Determine the hierarchical branching law.",
  "level_5": "Glass District reality fracture detected. Traversal protocol requires shortest breadth discovery.",
  "level_6": "Ashen Kingdom weighted paths converging. Compute the optimal cost algorithm.",
  "level_7": "Hollow Citadel self-similar chamber reached. Stop the infinite recursive descent.",
  "level_8": "Imperial feast resource allocation underway. Identify the local-choice strategy.",
  "level_9": "Archive of Two Realities conflicting. Secure atomic transaction consistency.",
  "level_10": "Duplicate royal records identified. Apply relational normalization principles.",
  "level_11": "Inner Citadel guards in circular deadlock. Break the resource cycle.",
  "level_12": "Hall of Variants responding with multiple forms. Identify the OOP polymorphism principle.",
  "level_13": "Doom's forge machine lineage detected. Trace the class inheritance hierarchy.",
  "level_14": "Forbidden Gate conditional transitions active. Model the finite state system.",
  "level_15": "Memory Vault fragment mapping required. Configure the non-contiguous paging frame map.",
  "level_16": "Tactical console contention active. Execute the Round Robin quantum scheduling rotation.",
  "level_17": "Shattered Kingdoms deep exploration underway. Execute depth-first search branch traversal.",
  "level_18": "Mirror Vault sorted weapon fragments detected. Apply binary search logarithmic elimination.",
  "level_19": "Fractured timelines repeating subproblems. Employ dynamic programming memoization.",
  "level_20": "Ancient Doom grammar tablet loaded. Parse token syntax to complete the master protocol."
};

const stagesFileContent = `export const TOTAL_TIME_SECONDS = 30 * 60;

export const ALL_20_QUESTIONS = ${JSON.stringify(all20ForStages, null, 2)};

export const STAGES = ${JSON.stringify(stagesObj, null, 2)};

export const PARTS = [
  {
    "id": 1,
    "title": "SESSION 1: THE LOWER DUNGEONS & INNER SECTORS",
    "description": "Chambers 1 through 7 of the Battleworld Protocol",
    "levelKeys": [
      "level_1",
      "level_2",
      "level_3",
      "level_4",
      "level_5",
      "level_6",
      "level_7"
    ]
  },
  {
    "id": 2,
    "title": "SESSION 2: THE ROYAL CITADEL & MASTER ARCHIVES",
    "description": "Chambers 8 through 14 of the Battleworld Protocol",
    "levelKeys": [
      "level_8",
      "level_9",
      "level_10",
      "level_11",
      "level_12",
      "level_13",
      "level_14"
    ]
  }
];

export const STAGE_INTRO_DIALOGUES = ${JSON.stringify(introDialogues, null, 2)};
`;

fs.writeFileSync(stagesPath, stagesFileContent, 'utf8');
console.log(`Updated ${stagesPath}`);

// 4. Update server/db.js DEFAULT_20_QUESTIONS
const serverDbPath = path.join(__dirname, '..', 'server', 'db.js');
let serverDbCode = fs.readFileSync(serverDbPath, 'utf8');

const regexQuestions = /const DEFAULT_20_QUESTIONS = \[[\s\S]*?\n\];/;
if (regexQuestions.test(serverDbCode)) {
  const replacement = `const DEFAULT_20_QUESTIONS = ${JSON.stringify(processedQuestions, null, 2)};`;
  serverDbCode = serverDbCode.replace(regexQuestions, replacement);
  console.log('Replaced DEFAULT_20_QUESTIONS in server/db.js');
} else {
  console.warn('Could not match DEFAULT_20_QUESTIONS in server/db.js');
}

fs.writeFileSync(serverDbPath, serverDbCode, 'utf8');
console.log(`Updated ${serverDbPath}`);

// 5. Update src/engine/contentStore.js DEFAULT_SOLUTIONS
const contentStorePath = path.join(__dirname, '..', 'src', 'engine', 'contentStore.js');
if (fs.existsSync(contentStorePath)) {
  let csCode = fs.readFileSync(contentStorePath, 'utf8');
  const defaultSolutions = {};
  processedQuestions.forEach((q, idx) => {
    const lk = `level_${idx + 1}`;
    defaultSolutions[lk] = {
      keywords: q.keywords,
      fragment: q.fragment,
      evidenceTitle: q.evidenceTitle,
      successNote: `Room ${idx + 1} cleared! ${q.subtitle || q.title} verified.`
    };
  });
  
  const regexSol = /const DEFAULT_SOLUTIONS = \{[\s\S]*?\n\};/;
  if (regexSol.test(csCode)) {
    const solReplacement = `const DEFAULT_SOLUTIONS = ${JSON.stringify(defaultSolutions, null, 2)};`;
    csCode = csCode.replace(regexSol, solReplacement);
    fs.writeFileSync(contentStorePath, csCode, 'utf8');
    console.log(`Updated DEFAULT_SOLUTIONS in ${contentStorePath}`);
  }
}

console.log('ALL 20 ROOMS REPLACED SUCCESSFULLY WITH USER EXACT SPECIFICATION!');
