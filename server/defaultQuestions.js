export const DEFAULT_20_QUESTIONS = [
  {
    "id": "Q01",
    "title": "ROOM 01: THE DOOM GATE",
    "subtitle": "If-Else Decisions",
    "category": "Programming",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 01</strong>",
      "The resistance strike team breaches a damaged subterranean security outpost situated at the outer perimeter of Doctor Doom's royal citadel. Heavy titanium blast gates seal off the main passage, their locking pins held in place by an active automated power conduit connected to an illuminated diagnostic terminal.",
      "An encrypted maintenance log recovered from a fallen technician's datapad explains that the gate's operating firmware continuously evaluates incoming authorization credentials before deciding on an action. Rather than relying on unpredictable cosmic power, the entire locking mechanism is governed by an automated, deterministic logical evaluation rule.",
      "When the team inserts a valid biometric token into the optical scanner, the hydraulic pins instantly retract with a loud hiss, allowing clearance. However, when an unrecognized token is tested, the terminal flashes crimson, emits a deafening alarm horn, and charges perimeter defense turrets.",
      "The terminal screen begins a countdown sequence, threatening an unrecoverable system lockdown. To override the gate and unlock the corridor, what foundational programming decision structure must the team submit to the terminal?"
    ],
    "codeLines": [],
    "question": "What basic programming concept makes the gate choose different actions based on a condition?",
    "hints": [
      {
        "text": "Focus on the two-branch conditional choice.",
        "penalty": 10
      },
      {
        "text": "Connect the true/false decision behavior to a basic college CS topic.",
        "penalty": 20
      },
      {
        "text": "The answer is IF-ELSE.",
        "penalty": 30
      }
    ],
    "fragment": 1,
    "evidenceTitle": "The Doom Gate Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "IF-ELSE identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "IF-ELSE",
      "IF ELSE",
      "IFELSE",
      "IF",
      "CONDITIONAL"
    ],
    "answer": "IF-ELSE",
    "order": 1,
    "cleanTitle": "THE DOOM GATE"
  },
  {
    "id": "Q02",
    "title": "ROOM 02: THE ENDLESS SIGNAL",
    "subtitle": "Loops",
    "category": "Programming",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 02</strong>",
      "Deep inside an abandoned communications bunker, an automated broadcast tower is pulsing high-voltage energy waves across the ruined sector. Multiple CRT monitors mounted across the central console display a relentless waterfall of telemetry packets cycling without pause.",
      "The team reviews the subsystem telemetry to understand why the transmitter refuses to power down despite the citadel's primary grid failure. A recovered maintenance manual confirms that the broadcast routine was specifically configured to repeat an identical series of instructions autonomously until interrupted.",
      "Oscilloscope readings reveal the exact same sequence executing continuously: preparing transmission buffers, emitting the microwave pulse, decrementing the counter, and immediately checking whether the active signal flag remains set before restarting.",
      "Energy spikes in the broadcast dish are surging toward an explosive overload that will obliterate the bunker. What fundamental programming control structure used for repeating instructions must the squad enter to shut down the broadcast cycle?"
    ],
    "codeLines": [],
    "question": "What programming concept repeats instructions until a condition tells it to stop?",
    "hints": [
      {
        "text": "Focus on the repeated execution cycle.",
        "penalty": 10
      },
      {
        "text": "Think of while, for, or repeat control structures.",
        "penalty": 20
      },
      {
        "text": "The answer is LOOP.",
        "penalty": 30
      }
    ],
    "fragment": 2,
    "evidenceTitle": "The Endless Signal Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "LOOP identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "LOOP",
      "LOOPS",
      "WHILE LOOP",
      "FOR LOOP",
      "ITERATION"
    ],
    "answer": "LOOP",
    "order": 2,
    "cleanTitle": "THE ENDLESS SIGNAL"
  },
  {
    "id": "Q03",
    "title": "ROOM 03: THE NUMBERED VAULT",
    "subtitle": "Arrays",
    "category": "Programming",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 03</strong>",
      "The team enters a heavily reinforced subterranean vault housing rows of glowing plasma canisters. Each storage compartment along the metallic wall is etched with a consecutive numeric identifier starting strictly from position zero across the entire partition.",
      "An automated robotic arm responds to commands typed into the console. The control program does not need to traverse every canister sequentially; entering a specific numeric index allows the arm to calculate the exact physical memory offset and extract the container instantly in constant time.",
      "Technical schematics describe the storage area as a contiguous block in hardware memory where items of uniform size and data type reside side by side in fixed, addressable slots without any gaps.",
      "A containment alarm begins flashing as the magnetic stabilizing fields decay. What foundational programming structure storing indexed collections at consecutive positions must the resistance submit to release the lock?"
    ],
    "codeLines": [],
    "question": "What programming structure stores multiple values in numbered positions?",
    "hints": [
      {
        "text": "Focus on contiguous index-based storage.",
        "penalty": 10
      },
      {
        "text": "Think of indexed list collections accessed with brackets [0].",
        "penalty": 20
      },
      {
        "text": "The answer is ARRAY.",
        "penalty": 30
      }
    ],
    "fragment": 3,
    "evidenceTitle": "The Numbered Vault Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "ARRAY identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "ARRAY",
      "ARRAYS",
      "LIST",
      "INDEXED ARRAY"
    ],
    "answer": "ARRAY",
    "order": 3,
    "cleanTitle": "THE NUMBERED VAULT"
  },
  {
    "id": "Q04",
    "title": "ROOM 04: THE LAST WEAPON",
    "subtitle": "Stack",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 04</strong>",
      "Inside Doom's heavy artillery silo, the resistance discovers a vertical pneumatic launch tube loaded with experimental plasma warheads. The narrow vertical shaft possesses only a single top hatch used for both ammunition loading and launch deployment.",
      "Maintenance schematics explain that whenever a fresh warhead arrives from the factory, it is lowered directly on top of all previously loaded units. When firing commands trigger, the mechanical loader can only eject the uppermost weapon that was loaded most recently.",
      "Technicians cannot retrieve older ordnance resting at the bottom of the tube without first extracting every single warhead placed above them one by one in reverse order of arrival.",
      "The silo's automated targeting computer is arming for an unauthorized launch. What fundamental data structure governing this order of operations where the newest item leaves first must the team identify to safely disarm the warheads?"
    ],
    "codeLines": [],
    "question": "What data structure removes the most recently added item first?",
    "hints": [
      {
        "text": "Think about Last-In, First-Out (LIFO) behavior.",
        "penalty": 10
      },
      {
        "text": "Commonly manipulated with push and pop operations.",
        "penalty": 20
      },
      {
        "text": "The answer is STACK.",
        "penalty": 30
      }
    ],
    "fragment": 4,
    "evidenceTitle": "The Last Weapon Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "STACK identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "STACK",
      "STACKS",
      "LIFO"
    ],
    "answer": "STACK",
    "order": 4,
    "cleanTitle": "THE LAST WEAPON"
  },
  {
    "id": "Q05",
    "title": "ROOM 05: THE FIRST SURVIVOR",
    "subtitle": "Queue",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 05</strong>",
      "The squad discovers an automated decontamination airlock where evacuated civilians gather during citadel alert conditions. An automated robotic gatekeeper strictly regulates passage through the narrow processing corridor.",
      "Surveillance records reveal that incoming individuals must join at the rear of the hallway. The exit gate opens solely for the person who has been waiting the longest, processing each occupant in the exact chronological sequence of their arrival.",
      "No line-jumping or backward retrieval is permitted by the system; entry occurs strictly at the rear, while exit occurs strictly from the front without exception, maintaining absolute order.",
      "Toxic gas is venting into the vestibule as containment fails around the refugees. To override the airlock gatekeeper and evacuate everyone safely, what core data structure managing this first-arrival-first-served sequence must the team enter?"
    ],
    "codeLines": [],
    "question": "What data structure serves the item that entered first?",
    "hints": [
      {
        "text": "Think about First-In, First-Out (FIFO) processing.",
        "penalty": 10
      },
      {
        "text": "Works exactly like a queue or checkout line in everyday life.",
        "penalty": 20
      },
      {
        "text": "The answer is QUEUE.",
        "penalty": 30
      }
    ],
    "fragment": 5,
    "evidenceTitle": "The First Survivor Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "QUEUE identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "QUEUE",
      "QUEUES",
      "FIFO"
    ],
    "answer": "QUEUE",
    "order": 5,
    "cleanTitle": "THE FIRST SURVIVOR"
  },
  {
    "id": "Q06",
    "title": "ROOM 06: THE MIXED ARCHIVE",
    "subtitle": "Sorting",
    "category": "Algorithms",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 06</strong>",
      "An explosion inside the central records facility scattered thousands of numbered data cartridges across the archive floor in complete disarray. The index catalog is paralyzed until order is restored.",
      "A restoration script initiates on the main console. It methodically examines adjacent pairs of records, swaps their positions when out of sequence, and steadily transforms the chaotic pile into an organized lineup.",
      "After several systematic passes across the dataset, every cartridge sits in ascending numerical sequence from lowest security clearance to highest, making lookups possible again across the citadel network.",
      "The main archive index requires terminal confirmation before it re-engages the defense mainframe. What fundamental algorithmic operation that rearranges unsorted elements into a designated sequential order must the team submit?"
    ],
    "codeLines": [],
    "question": "What operation rearranges values into a chosen order?",
    "hints": [
      {
        "text": "Think of Quick, Merge, or Bubble algorithms.",
        "penalty": 10
      },
      {
        "text": "The process of arranging unsorted items into order.",
        "penalty": 20
      },
      {
        "text": "The answer is SORTING.",
        "penalty": 30
      }
    ],
    "fragment": 6,
    "evidenceTitle": "The Mixed Archive Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "SORTING identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "SORTING",
      "SORT",
      "SORT ALGORITHM"
    ],
    "answer": "SORTING",
    "order": 6,
    "cleanTitle": "THE MIXED ARCHIVE"
  },
  {
    "id": "Q07",
    "title": "ROOM 07: THE HIDDEN RECORD",
    "subtitle": "Linear Search",
    "category": "Algorithms",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 07</strong>",
      "The resistance needs an emergency override code hidden within an unsorted list of millions of security event logs. The archive completely lacks index trees or pre-sorted keys.",
      "The scanning tool begins at the very first log entry in memory. It compares the target code against record 0, moves to record 1, and continues checking each consecutive record one by one across the entire file.",
      "If the target item is located near the very end, the scanner must inspect every single element before finding a match, producing an O(n) execution time profile across the unsorted entries.",
      "The system demands the exact technical method being used before it displays the override key. What fundamental search technique inspecting items one by one sequentially is the scanner executing?"
    ],
    "codeLines": [],
    "question": "What search checks items one by one until the target is found?",
    "hints": [
      {
        "text": "Sequential examination from start to finish.",
        "penalty": 10
      },
      {
        "text": "Has O(n) worst-case time complexity on unsorted lists.",
        "penalty": 20
      },
      {
        "text": "The answer is LINEAR SEARCH.",
        "penalty": 30
      }
    ],
    "fragment": 7,
    "evidenceTitle": "The Hidden Record Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "LINEAR SEARCH identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "LINEAR SEARCH",
      "SEQUENTIAL SEARCH",
      "LINEAR"
    ],
    "answer": "LINEAR SEARCH",
    "order": 7,
    "cleanTitle": "THE HIDDEN RECORD"
  },
  {
    "id": "Q08",
    "title": "ROOM 08: THE HALF MAP",
    "subtitle": "Binary Search",
    "category": "Algorithms",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 08</strong>",
      "A navigational terminal contains a massive sorted database of planetary warp coordinates. Because the dataset is enormous, standard sequential checking is too slow to escape incoming patrol drones.",
      "The scanner jumps directly to the midpoint of the sorted list. If the target frequency is smaller than the middle value, it completely eliminates the upper half; if larger, it discards the lower half.",
      "By repeatedly dividing the remaining search interval in half, the terminal locates any key across a million entries in around twenty steps, demonstrating logarithmic efficiency.",
      "Patrol drones are closing in on the terminal room with heavy blasters armed. What logarithmic divide-and-conquer search algorithm must the resistance invoke to rapidly lock in the warp coordinates?"
    ],
    "codeLines": [],
    "question": "What search method repeatedly divides a sorted list into halves?",
    "hints": [
      {
        "text": "Requires a sorted collection and divide-and-conquer logic.",
        "penalty": 10
      },
      {
        "text": "Halves the candidate range at each step (O(log n)).",
        "penalty": 20
      },
      {
        "text": "The answer is BINARY SEARCH.",
        "penalty": 30
      }
    ],
    "fragment": 8,
    "evidenceTitle": "The Half Map Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "BINARY SEARCH identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "BINARY SEARCH",
      "BINARY"
    ],
    "answer": "BINARY SEARCH",
    "order": 8,
    "cleanTitle": "THE HALF MAP"
  },
  {
    "id": "Q09",
    "title": "ROOM 09: THE SMALLER COPY",
    "subtitle": "Recursion",
    "category": "Programming",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 09</strong>",
      "The resistance encounters a nested security cipher consisting of concentric dimensional locks. The outer lock mechanism contains an identical smaller lock inside it, repeating into miniature layers.",
      "The decryption program uses an elegant routine: to solve the puzzle of size N, it calls an instance of itself to solve size N-1, pushing each pending call onto the call stack.",
      "When the inner problem reaches the smallest base case (size 0), the chain stops and returns calculated values back up through the hierarchy to solve the overall problem.",
      "The lock interface requires identifying the computational design pattern in use. What programming technique solves complex problems by having a function invoke smaller versions of itself until reaching a base condition?"
    ],
    "codeLines": [],
    "question": "What programming technique solves a problem using smaller versions of itself?",
    "hints": [
      {
        "text": "A self-referencing function that requires a base case to terminate.",
        "penalty": 10
      },
      {
        "text": "Commonly used in tree traversals, factorials, and divide-and-conquer.",
        "penalty": 20
      },
      {
        "text": "The answer is RECURSION.",
        "penalty": 30
      }
    ],
    "fragment": 9,
    "evidenceTitle": "The Smaller Copy Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "RECURSION identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "RECURSION",
      "RECURSIVE",
      "RECURSIVE FUNCTION"
    ],
    "answer": "RECURSION",
    "order": 9,
    "cleanTitle": "THE SMALLER COPY"
  },
  {
    "id": "Q10",
    "title": "ROOM 10: THE UNIQUE ID",
    "subtitle": "Primary Key",
    "category": "DBMS",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 10</strong>",
      "The central garrison relational database catalogues millions of cyborg soldiers and resistance operatives across Battleworld. Many soldiers share identical names, ranks, and unit designations.",
      "To prevent ambiguity and catastrophic data corruption, the database architect established a mandatory column constraint. Every single record is assigned an immutable, non-null value that cannot be duplicated anywhere in the table.",
      "Querying this specific attribute guarantees retrieving exactly one unique row with absolute certainty across the entire relational database system.",
      "The database console locks until the administrator identifies the integrity constraint. What database concept guarantees unique record identification and disallows null values across a relational table?"
    ],
    "codeLines": [],
    "question": "What database concept gives each record a unique identifier?",
    "hints": [
      {
        "text": "Unique and NOT NULL constraint on a database table column.",
        "penalty": 10
      },
      {
        "text": "The primary identifier used to index rows and create foreign keys.",
        "penalty": 20
      },
      {
        "text": "The answer is PRIMARY KEY.",
        "penalty": 30
      }
    ],
    "fragment": 10,
    "evidenceTitle": "The Unique Id Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "PRIMARY KEY identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "PRIMARY KEY",
      "PRIMARYKEY",
      "PK"
    ],
    "answer": "PRIMARY KEY",
    "order": 10,
    "cleanTitle": "THE UNIQUE ID"
  },
  {
    "id": "Q11",
    "title": "ROOM 11: THE CLASS OF GUARDS",
    "subtitle": "Inheritance",
    "category": "OOP",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 11</strong>",
      "Inside Doom's robotics laboratory, engineers inspect the software blueprints for the citadel's defense automatons. The base architecture defines a parent Sentinel class containing core attributes like armor rating and navigation routines.",
      "When engineers designed specialized units like the FlightSentinel and PlasmaSentinel, they did not rewrite common code from scratch. Instead, the new classes derived directly from the base Sentinel class.",
      "The derived subclasses automatically received all baseline properties while adding their own specialized weapons and behavior overrides.",
      "To reprogram the robotic guards before they activate, what core object-oriented principle enabling child classes to receive attributes and methods from an existing parent class must be entered?"
    ],
    "codeLines": [],
    "question": "What OOP concept lets one class receive features from another class?",
    "hints": [
      {
        "text": "Parent-child relationship in object-oriented programming.",
        "penalty": 10
      },
      {
        "text": "Uses keywords like 'extends' in Java or ':' in C++.",
        "penalty": 20
      },
      {
        "text": "The answer is INHERITANCE.",
        "penalty": 30
      }
    ],
    "fragment": 11,
    "evidenceTitle": "The Class Of Guards Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "INHERITANCE identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "INHERITANCE",
      "INHERIT"
    ],
    "answer": "INHERITANCE",
    "order": 11,
    "cleanTitle": "THE CLASS OF GUARDS"
  },
  {
    "id": "Q12",
    "title": "ROOM 12: THE MANY GUARDS",
    "subtitle": "Polymorphism",
    "category": "OOP",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 12</strong>",
      "The central defense console dispatches a single broadcast signal: `executeMission()` to an array of different military units including Drone, Turret, and Mech.",
      "Rather than requiring individual commands for every unit type, each distinct object responds appropriately to the exact same method call: the Drone takes flight, the Turret rotates its cannons, and the Mech engages kinetic shields.",
      "The underlying controller interacts with all objects through a uniform interface without needing to know their specific concrete implementations at compile time.",
      "The mainframe terminal requests verification of this architectural behavior. What OOP principle allows a single interface or method call to take many different functional forms depending on the object?"
    ],
    "codeLines": [],
    "question": "What OOP concept lets the same operation behave differently for different objects?",
    "hints": [
      {
        "text": "Greek term meaning 'many forms'.",
        "penalty": 10
      },
      {
        "text": "Achieved via method overriding, interfaces, and dynamic dispatch.",
        "penalty": 20
      },
      {
        "text": "The answer is POLYMORPHISM.",
        "penalty": 30
      }
    ],
    "fragment": 12,
    "evidenceTitle": "The Many Guards Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "POLYMORPHISM identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "POLYMORPHISM",
      "POLYMORPHIC"
    ],
    "answer": "POLYMORPHISM",
    "order": 12,
    "cleanTitle": "THE MANY GUARDS"
  },
  {
    "id": "Q13",
    "title": "ROOM 13: THE LOCKED DATA",
    "subtitle": "Encapsulation",
    "category": "OOP",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 13</strong>",
      "The citadel's primary antimatter reactor is governed by a secure software module. Diagnostic tests show that external scripts cannot directly modify sensitive internal variables like core temperature or fuel pressure.",
      "All critical data fields are marked private and sealed inside the module. Any external subsystem wishing to read or adjust reactor parameters must communicate strictly through designated public getter and setter methods.",
      "This architecture prevents unauthorized tampering and guarantees data validation rules before state changes occur across the subsystem.",
      "Overheating warnings are sounding across the reactor floor. What core object-oriented principle of bundling data and hiding internal state behind controlled accessors must the team use to access the controls?"
    ],
    "codeLines": [],
    "question": "What OOP concept keeps an object’s data controlled inside the object?",
    "hints": [
      {
        "text": "Data hiding and bundling using private variables and public getters/setters.",
        "penalty": 10
      },
      {
        "text": "Protects internal state from external tampering.",
        "penalty": 20
      },
      {
        "text": "The answer is ENCAPSULATION.",
        "penalty": 30
      }
    ],
    "fragment": 13,
    "evidenceTitle": "The Locked Data Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "ENCAPSULATION identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "ENCAPSULATION",
      "DATA HIDING"
    ],
    "answer": "ENCAPSULATION",
    "order": 13,
    "cleanTitle": "THE LOCKED DATA"
  },
  {
    "id": "Q14",
    "title": "ROOM 14: THE TWO WAITING GUARDS",
    "subtitle": "Deadlock",
    "category": "Operating Systems",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 14</strong>",
      "The citadel's automated transport corridor is completely paralyzed. Two heavy construction droids are stationary at a narrow junction, locking up the entire logistics pipeline.",
      "Telemetry logs indicate that Droid 1 has acquired Lock A on the battery station and is waiting for Lock B on the rail system. Simultaneously, Droid 2 has acquired Lock B and is waiting for Lock A.",
      "Neither droid will release its held resource until it acquires the other, creating a permanent circular wait condition where no progress can occur.",
      "Power levels are draining as the transport network freezes indefinitely. What classic operating system concurrency failure where processes wait forever for resources held by each other must the resistance diagnose?"
    ],
    "codeLines": [],
    "question": "What OS problem occurs when processes wait forever for resources held by one another?",
    "hints": [
      {
        "text": "A permanent freeze caused by circular wait and mutual exclusion.",
        "penalty": 10
      },
      {
        "text": "Classic operating system concurrency condition.",
        "penalty": 20
      },
      {
        "text": "The answer is DEADLOCK.",
        "penalty": 30
      }
    ],
    "fragment": 14,
    "evidenceTitle": "The Two Waiting Guards Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "DEADLOCK identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "DEADLOCK",
      "DEADLOCKS"
    ],
    "answer": "DEADLOCK",
    "order": 14,
    "cleanTitle": "THE TWO WAITING GUARDS"
  },
  {
    "id": "Q15",
    "title": "ROOM 15: THE MEMORY BLOCKS",
    "subtitle": "Paging",
    "category": "Operating Systems",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 15</strong>",
      "The mainframe memory controller manages physical RAM by partitioning hardware space into uniform, fixed-size slots called frames. Simultaneously, virtual memory addresses are divided into equal-sized chunks.",
      "A translation table maps each logical block to any available physical frame in hardware, even if the allocated frames are scattered non-contiguously across physical chips.",
      "This architecture allows large programs to execute without requiring huge contiguous blocks of physical memory, completely avoiding external fragmentation.",
      "Memory allocation is stalling across the mainframe. What operating system memory management technique dividing memory into fixed blocks mapped to frames must the engineers configure?"
    ],
    "codeLines": [],
    "question": "What memory-management technique divides memory into fixed-size pages?",
    "hints": [
      {
        "text": "Fixed-size virtual memory blocks mapped to physical frames via a page table.",
        "penalty": 10
      },
      {
        "text": "Solves external fragmentation in OS memory management.",
        "penalty": 20
      },
      {
        "text": "The answer is PAGING.",
        "penalty": 30
      }
    ],
    "fragment": 15,
    "evidenceTitle": "The Memory Blocks Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "PAGING identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "PAGING",
      "PAGE",
      "PAGES"
    ],
    "answer": "PAGING",
    "order": 15,
    "cleanTitle": "THE MEMORY BLOCKS"
  },
  {
    "id": "Q16",
    "title": "ROOM 16: THE SHORTEST NEARBY PATH",
    "subtitle": "BFS",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 16</strong>",
      "An automated search drone scans the subterranean tunnel network beneath the fortress to discover the quickest escape route for the resistance team.",
      "The drone's navigation algorithm begins at the root chamber and enqueues all immediate adjacent corridors at distance 1. Only after every neighbor at distance 1 has been inspected does it advance to distance 2.",
      "Using a FIFO queue to track discovered chambers, the drone guarantees uncovering the path with the fewest corridor hops.",
      "The tunnel exit will collapse in moments. What graph traversal algorithm exploring nearby nodes layer by layer must the team activate to map the quickest exit?"
    ],
    "codeLines": [],
    "question": "What graph traversal explores nearby nodes level by level?",
    "hints": [
      {
        "text": "Explores layer by layer using a FIFO queue.",
        "penalty": 10
      },
      {
        "text": "Guarantees finding the shortest path in unweighted graphs.",
        "penalty": 20
      },
      {
        "text": "The answer is BFS.",
        "penalty": 30
      }
    ],
    "fragment": 16,
    "evidenceTitle": "The Shortest Nearby Path Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "BFS identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "BFS",
      "BREADTH FIRST SEARCH",
      "BREADTH-FIRST SEARCH"
    ],
    "answer": "BFS",
    "order": 16,
    "cleanTitle": "THE SHORTEST NEARBY PATH"
  },
  {
    "id": "Q17",
    "title": "ROOM 17: THE DEEPEST ROAD",
    "subtitle": "DFS",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 17</strong>",
      "A reconnaissance droid navigates an intricate maze of ventilation shafts beneath the royal throne room. The droid's goal is to discover hidden sub-level chambers as quickly as possible.",
      "Rather than scanning all nearby branch options, the droid picks a single corridor and follows it aggressively until hitting a dead end. Only when trapped does it backtrack to the most recent fork and explore the next branch.",
      "The traversal uses a recursive call stack to remember unexplored decision junctions during backtracking.",
      "The map interface requires authentication to plot the full tunnel graph. What graph exploration strategy that explores deep branches before backtracking must the team submit?"
    ],
    "codeLines": [],
    "question": "What graph traversal explores one branch deeply before returning?",
    "hints": [
      {
        "text": "Dives as deep as possible before backtracking, using recursion or a stack.",
        "penalty": 10
      },
      {
        "text": "Commonly used for cycle detection and topological sorting.",
        "penalty": 20
      },
      {
        "text": "The answer is DFS.",
        "penalty": 30
      }
    ],
    "fragment": 17,
    "evidenceTitle": "The Deepest Road Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "DFS identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "DFS",
      "DEPTH FIRST SEARCH",
      "DEPTH-FIRST SEARCH"
    ],
    "answer": "DFS",
    "order": 17,
    "cleanTitle": "THE DEEPEST ROAD"
  },
  {
    "id": "Q18",
    "title": "ROOM 18: THE SHIFTED MESSAGE",
    "subtitle": "Caesar Cipher",
    "category": "Cryptography",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 18</strong>",
      "The resistance intercepts a high-priority radio broadcast transmitted between Doom's field commanders. The message appears as scrambled text: 'KHOOR' instead of 'HELLO'.",
      "Analyzing frequency distribution and character offsets reveals an ancient substitution rule: every alphabetic letter in the plaintext message has been shifted forward by exactly three positions in the alphabet.",
      "Wrapping around from Z back to A, the encryption relies purely on a constant numerical shift key shared between sender and receiver.",
      "To decrypt the incoming tactical commands before Doom strikes, what classic substitution cipher shifting characters by a fixed offset must the squad identify?"
    ],
    "codeLines": [],
    "question": "What simple cipher shifts every letter by the same number of alphabet positions?",
    "hints": [
      {
        "text": "Named after a famous Roman emperor who used it for military dispatches.",
        "penalty": 10
      },
      {
        "text": "Basic shift cipher with a constant numerical key (e.g., ROT13 / shift 3).",
        "penalty": 20
      },
      {
        "text": "The answer is CAESAR CIPHER.",
        "penalty": 30
      }
    ],
    "fragment": 18,
    "evidenceTitle": "The Shifted Message Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "CAESAR CIPHER identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "CAESAR CIPHER",
      "CAESAR",
      "SHIFT CIPHER"
    ],
    "answer": "CAESAR CIPHER",
    "order": 18,
    "cleanTitle": "THE SHIFTED MESSAGE"
  },
  {
    "id": "Q19",
    "title": "ROOM 19: THE SECRET MASK",
    "subtitle": "XOR",
    "category": "Cryptography",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 19</strong>",
      "A hardware security module shields Doom's quantum encryption keys using a high-speed bitwise logic circuit. The circuit combines incoming plaintext data with a secret pseudo-random key stream.",
      "Testing the binary gate reveals clear output rules: when two matching bits are compared (0 and 0, or 1 and 1), the circuit outputs 0. When two differing bits are compared (0 and 1, or 1 and 0), it outputs 1.",
      "Applying the exact same operation a second time with the key perfectly recovers the original data.",
      "The cryptographic gate requires the operator to declare the binary operation. What bitwise logic operator giving 0 for equal bits and 1 for differing bits must the team specify?"
    ],
    "codeLines": [],
    "question": "What binary operation gives 0 for equal bits and 1 for different bits?",
    "hints": [
      {
        "text": "Bitwise exclusive OR operation, returning 1 only when inputs differ.",
        "penalty": 10
      },
      {
        "text": "Represented by the caret symbol (^) in most programming languages.",
        "penalty": 20
      },
      {
        "text": "The answer is XOR.",
        "penalty": 30
      }
    ],
    "fragment": 19,
    "evidenceTitle": "The Secret Mask Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "XOR identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "XOR",
      "EXCLUSIVE OR"
    ],
    "answer": "XOR",
    "order": 19,
    "cleanTitle": "THE SECRET MASK"
  },
  {
    "id": "Q20",
    "title": "ROOM 20: THE FLEXIBLE VAULT",
    "subtitle": "MongoDB Document",
    "category": "DBMS",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 20</strong>",
      "The resistance infiltrates Doctor Doom's modern NoSQL storage cluster, which stores experimental biometric profiles from across the multiverse.",
      "Unlike legacy relational databases that force data into rigid tabular rows and predefined columns, this system stores each individual record as a flexible, hierarchical JSON/BSON object containing key-value pairs.",
      "Records inside the same collection can have entirely different fields, sub-structures, and nested arrays without requiring schema alterations.",
      "To extract the master biometric record and unlock the final citadel chamber, what fundamental MongoDB data storage unit holding key-value pairs must the team identify?"
    ],
    "codeLines": [],
    "question": "What is the basic unit of data storage in MongoDB that holds key-value pairs in JSON/BSON format?",
    "hints": [
      {
        "text": "The NoSQL equivalent of a single row in relational tables.",
        "penalty": 10
      },
      {
        "text": "Stores data as flexible JSON/BSON key-value structures.",
        "penalty": 20
      },
      {
        "text": "The answer is DOCUMENT.",
        "penalty": 30
      }
    ],
    "fragment": 20,
    "evidenceTitle": "The Flexible Vault Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "DOCUMENT identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "DOCUMENT",
      "DOCUMENTS",
      "BSON DOCUMENT",
      "BSON"
    ],
    "answer": "DOCUMENT",
    "order": 20,
    "cleanTitle": "THE FLEXIBLE VAULT"
  },
  {
    "id": "Q21",
    "title": "ROOM 21: THE CHAIN OF NODES",
    "subtitle": "Linked List",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 21</strong>",
      "Inside the citadel's secondary data relay, the resistance uncovers a sequence of dynamic memory blocks scattered across non-contiguous physical addresses in hardware RAM.",
      "Unlike rigid arrays that require continuous memory partitions, each discrete node in this structure stores its own data payload alongside a memory pointer explicitly referencing the address of the next item in the chain.",
      "Inserting or deleting elements in the middle of the collection requires only updating adjacent pointer links rather than shifting thousands of trailing elements through memory.",
      "The memory chain is de-synchronizing rapidly. What fundamental linear data structure consisting of discrete nodes connected by pointer references must the squad identify to stabilize the relay?"
    ],
    "codeLines": [],
    "question": "What linear data structure consists of nodes where each node points to the next?",
    "hints": [
      {
        "text": "Nodes containing data and a next pointer reference.",
        "penalty": 10
      },
      {
        "text": "Non-contiguous dynamic linear data structure.",
        "penalty": 20
      },
      {
        "text": "The answer is LINKED LIST.",
        "penalty": 30
      }
    ],
    "fragment": 21,
    "evidenceTitle": "The Chain Of Nodes Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "LINKED LIST identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "LINKED LIST",
      "LINKEDLIST",
      "SINGLY LINKED LIST"
    ],
    "answer": "LINKED LIST",
    "order": 21,
    "cleanTitle": "THE CHAIN OF NODES"
  },
  {
    "id": "Q22",
    "title": "ROOM 22: THE BRANCHING ARCHIVE",
    "subtitle": "Binary Tree",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 22</strong>",
      "The resistance accesses Doom's hierarchical lineage archives stored in an ancient Latverian databank. At the top of the display sits a single root node that branches downward into left and right sub-structures.",
      "Each node in the architecture maintains at most two direct child pointers, organizing millions of historical records in a balanced hierarchical structure with distinct parent-child relationships.",
      "Searching, inserting, and deleting records takes logarithmic time when the structure is balanced, providing optimal hierarchical traversal across massive data sets.",
      "The archive lock demands the specific data structure name. What hierarchical non-linear data structure where each parent node has at most two children must the team enter to unlock the vault?"
    ],
    "codeLines": [],
    "question": "What hierarchical tree structure restricts each parent node to at most two children?",
    "hints": [
      {
        "text": "Root node with left and right subtrees.",
        "penalty": 10
      },
      {
        "text": "A tree data structure where each node has at most 2 child nodes.",
        "penalty": 20
      },
      {
        "text": "The answer is BINARY TREE.",
        "penalty": 30
      }
    ],
    "fragment": 22,
    "evidenceTitle": "The Branching Archive Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "BINARY TREE identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "BINARY TREE",
      "BINARY SEARCH TREE",
      "BST",
      "TREE"
    ],
    "answer": "BINARY TREE",
    "order": 22,
    "cleanTitle": "THE BRANCHING ARCHIVE"
  },
  {
    "id": "Q23",
    "title": "ROOM 23: THE FAST LOOKUP",
    "subtitle": "Hash Table",
    "category": "Data Structures",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 23</strong>",
      "The fortress teleportation matrix requires instantaneous O(1) lookups to immediately translate destination planet names into spatial warp coordinate vectors.",
      "Instead of searching through lists or trees, the system passes the key string through a mathematical hash function to compute a direct array bucket index in memory.",
      "Collision handling mechanisms like separate chaining or open addressing guarantee data integrity even when two distinct key strings produce the exact same index position.",
      "The warp gate is preparing to collapse under power strain. What associative key-value data structure offering constant-time average lookups must the engineers submit to stabilize the teleportation matrix?"
    ],
    "codeLines": [],
    "question": "What data structure uses a hash function to map keys to values for fast lookups?",
    "hints": [
      {
        "text": "Uses key-value pairs and hash functions for O(1) average lookup.",
        "penalty": 10
      },
      {
        "text": "Also known as hash map or dictionary.",
        "penalty": 20
      },
      {
        "text": "The answer is HASH TABLE.",
        "penalty": 30
      }
    ],
    "fragment": 23,
    "evidenceTitle": "The Fast Lookup Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "HASH TABLE identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "HASH TABLE",
      "HASH MAP",
      "HASHMAP",
      "HASHTABLE"
    ],
    "answer": "HASH TABLE",
    "order": 23,
    "cleanTitle": "THE FAST LOOKUP"
  },
  {
    "id": "Q24",
    "title": "ROOM 24: THE CLEAN SCHEMA",
    "subtitle": "Normalization",
    "category": "DBMS",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 24</strong>",
      "The citadel logistics database was crippled by massive duplicate records, redundant columns, and catastrophic update anomalies resulting from years of unmonitored data entry across multiple warzones.",
      "Database architects apply systematic formal rules (1NF, 2NF, 3NF) to decompose massive unorganized tables into smaller, well-structured relational entities linked by foreign keys.",
      "This process completely eliminates data redundancy and guarantees that insertion, deletion, and modification operations maintain referential integrity without creating conflicting copies.",
      "The schema migration console pauses for administrator confirmation. What systematic database design process organizes tables into normal forms to eliminate data redundancy?"
    ],
    "codeLines": [],
    "question": "What database process minimizes data redundancy by organizing fields and tables into normal forms?",
    "hints": [
      {
        "text": "Involves stages like 1NF, 2NF, and 3NF (Boyce-Codd).",
        "penalty": 10
      },
      {
        "text": "Eliminates duplicate data and update anomalies.",
        "penalty": 20
      },
      {
        "text": "The answer is NORMALIZATION.",
        "penalty": 30
      }
    ],
    "fragment": 24,
    "evidenceTitle": "The Clean Schema Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "NORMALIZATION identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "NORMALIZATION",
      "DATABASE NORMALIZATION",
      "NORMALIZE"
    ],
    "answer": "NORMALIZATION",
    "order": 24,
    "cleanTitle": "THE CLEAN SCHEMA"
  },
  {
    "id": "Q25",
    "title": "ROOM 25: THE PARALLEL WORKER",
    "subtitle": "Thread",
    "category": "Operating Systems",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 25</strong>",
      "The citadel defense mainframe manages hundreds of simultaneous real-time radar and sensor telemetry streams within a single active running process.",
      "Rather than spawning heavy independent processes with isolated address spaces, the operating system dispatches lightweight execution streams that share the exact same memory space, code section, and global data.",
      "Each individual stream maintains its own program counter, register state, and private call stack, enabling genuine concurrent execution across multi-core processor architectures.",
      "To assign CPU cores to these lightweight concurrent workers, what smallest schedulable unit of CPU execution within a process must the team specify?"
    ],
    "codeLines": [],
    "question": "What is the smallest lightweight unit of CPU execution within a process?",
    "hints": [
      {
        "text": "Lightweight execution unit sharing process memory.",
        "penalty": 10
      },
      {
        "text": "Enables multithreading in applications.",
        "penalty": 20
      },
      {
        "text": "The answer is THREAD.",
        "penalty": 30
      }
    ],
    "fragment": 25,
    "evidenceTitle": "The Parallel Worker Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "THREAD identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "THREAD",
      "THREADS",
      "MULTITHREADING"
    ],
    "answer": "THREAD",
    "order": 25,
    "cleanTitle": "THE PARALLEL WORKER"
  },
  {
    "id": "Q26",
    "title": "ROOM 26: THE TRAFFIC SIGNAL",
    "subtitle": "Semaphore",
    "category": "Operating Systems",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 26</strong>",
      "Multiple autonomous defense drones compete simultaneously for access to a limited cluster of three rapid-charging stations inside the fortress bay.",
      "A synchronization variable maintains an integer counter tracking available charging slots. Drones perform atomic wait (P) operations to decrement the counter upon entry and signal (V) operations to increment it upon leaving.",
      "When the counter drops to zero, any additional drones attempting access are placed into a sleep queue until a station is freed, preventing race conditions and hardware collisions.",
      "The charging dock interface demands the synchronization primitive name. What classic OS concurrency control tool uses atomic integer counters with wait and signal operations?"
    ],
    "codeLines": [],
    "question": "What OS synchronization variable uses atomic wait and signal operations to control access to shared resources?",
    "hints": [
      {
        "text": "Invented by Edsger Dijkstra, uses wait (P) and signal (V).",
        "penalty": 10
      },
      {
        "text": "Counting or binary synchronization primitive.",
        "penalty": 20
      },
      {
        "text": "The answer is SEMAPHORE.",
        "penalty": 30
      }
    ],
    "fragment": 26,
    "evidenceTitle": "The Traffic Signal Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "SEMAPHORE identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "SEMAPHORE",
      "SEMAPHORES",
      "COUNTING SEMAPHORE"
    ],
    "answer": "SEMAPHORE",
    "order": 26,
    "cleanTitle": "THE TRAFFIC SIGNAL"
  },
  {
    "id": "Q27",
    "title": "ROOM 27: THE OPTIMAL ROUTE",
    "subtitle": "Dijkstra",
    "category": "Algorithms",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 27</strong>",
      "The resistance needs to plot the safest escape route through Battleworld's weighted network of teleporter nodes. Each connecting corridor possesses a non-negative energy cost.",
      "The navigation computer maintains a priority queue of tentative distances. It greedily selects the unvisited node with the lowest cumulative cost, relaxes neighboring edge weights, and calculates the single-source shortest path to all destinations.",
      "Because no edge weights are negative, the algorithm guarantees discovering the mathematically optimal path in O((V + E) log V) time across the complex weighted graph.",
      "To engage the warp engine along the minimum-cost route before the sector explodes, what famous greedy shortest-path algorithm for weighted graphs must the team name?"
    ],
    "codeLines": [],
    "question": "What greedy algorithm finds the shortest path between nodes in a graph with non-negative edge weights?",
    "hints": [
      {
        "text": "Named after Dutch computer scientist Edsger Dijkstra.",
        "penalty": 10
      },
      {
        "text": "Uses priority queues and edge relaxation for weighted shortest paths.",
        "penalty": 20
      },
      {
        "text": "The answer is DIJKSTRA.",
        "penalty": 30
      }
    ],
    "fragment": 27,
    "evidenceTitle": "The Optimal Route Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "DIJKSTRA identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "DIJKSTRA",
      "DIJKSTRA ALGORITHM",
      "DIJKSTRA'S ALGORITHM"
    ],
    "answer": "DIJKSTRA",
    "order": 27,
    "cleanTitle": "THE OPTIMAL ROUTE"
  },
  {
    "id": "Q28",
    "title": "ROOM 28: THE HIDDEN COMPLEXITY",
    "subtitle": "Abstraction",
    "category": "OOP",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 28</strong>",
      "The squad discovers the master cockpit of Doom's orbital battle cruiser. The pilot controls provide intuitive buttons like 'Engage Thrusters' and 'Shield Overcharge' on an elegant heads-up display.",
      "Behind the dashboard lie millions of complex hydraulic lines, plasma valves, and microcode routines. The pilot does not need to know how internal valves operate; the interface hides internal implementation details and exposes only essential features.",
      "In software engineering, this pillar allows developers to define clean abstract interfaces without exposing the underlying low-level implementation mechanics.",
      "What core object-oriented programming principle focuses on hiding complex internal implementation details while displaying only essential functionality to the user?"
    ],
    "codeLines": [],
    "question": "What OOP pillar hides complex internal implementation details and shows only essential functionality?",
    "hints": [
      {
        "text": "One of the 4 pillars of OOP (alongside Encapsulation, Inheritance, Polymorphism).",
        "penalty": 10
      },
      {
        "text": "Achieved using abstract classes and interfaces.",
        "penalty": 20
      },
      {
        "text": "The answer is ABSTRACTION.",
        "penalty": 30
      }
    ],
    "fragment": 28,
    "evidenceTitle": "The Hidden Complexity Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "ABSTRACTION identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "ABSTRACTION",
      "DATA ABSTRACTION"
    ],
    "answer": "ABSTRACTION",
    "order": 28,
    "cleanTitle": "THE HIDDEN COMPLEXITY"
  },
  {
    "id": "Q29",
    "title": "ROOM 29: THE SPEED BUFFER",
    "subtitle": "Cache",
    "category": "Operating Systems",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 29</strong>",
      "The mainframe's central processing unit is experiencing severe performance bottlenecks waiting for critical security data from slow secondary storage drives.",
      "Engineers install a small, ultra-fast high-speed memory layer (SRAM) directly adjacent to the CPU cores. Frequently accessed instructions and recently fetched data are retained in this buffer based on temporal and spatial locality.",
      "When a lookup succeeds (a 'hit'), data arrives in nanoseconds, dramatically reducing CPU idle cycles without fetching from slower main RAM or disk storage.",
      "To accelerate system response before the citadel countdown expires, what high-speed temporary memory storage hardware must the engineers configure?"
    ],
    "codeLines": [],
    "question": "What high-speed hardware or software storage layer stores recently accessed data for fast future retrieval?",
    "hints": [
      {
        "text": "Fast temporary storage layer (L1, L2, L3).",
        "penalty": 10
      },
      {
        "text": "Stores frequently accessed data to reduce latency.",
        "penalty": 20
      },
      {
        "text": "The answer is CACHE.",
        "penalty": 30
      }
    ],
    "fragment": 29,
    "evidenceTitle": "The Speed Buffer Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "CACHE identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "CACHE",
      "CACHING",
      "CPU CACHE"
    ],
    "answer": "CACHE",
    "order": 29,
    "cleanTitle": "THE SPEED BUFFER"
  },
  {
    "id": "Q30",
    "title": "ROOM 30: THE CROSS REFERENCE",
    "subtitle": "Foreign Key",
    "category": "DBMS",
    "difficulty": "Easy",
    "enabled": true,
    "investigationType": "story",
    "story": [
      "<strong>⚠ BATTLEWORLD INVESTIGATION LOG — CHAMBER 30</strong>",
      "The team reaches the final central vault housing the relationship schemas connecting Doom's global armories with assigned commanding officers across the realm.",
      "The Armory table contains a dedicated column that references the primary key of the Commander table, linking each weapon inventory record to a verified commanding officer.",
      "The database engine enforces referential integrity: no armory can list an invalid or non-existent commander ID, preventing orphan records across the relational system.",
      "To unlock the final master vault door and conclude the Battleworld mission, what relational database field that references the primary key of another table must the team enter?"
    ],
    "codeLines": [],
    "question": "What database key creates a link between two tables by referencing the primary key of another table?",
    "hints": [
      {
        "text": "Enforces referential integrity between tables.",
        "penalty": 10
      },
      {
        "text": "A field in one table that refers to the Primary Key of another.",
        "penalty": 20
      },
      {
        "text": "The answer is FOREIGN KEY.",
        "penalty": 30
      }
    ],
    "fragment": 30,
    "evidenceTitle": "The Cross Reference Evidence Fragment",
    "consequence": [
      "CLUE VERIFIED",
      "FOREIGN KEY identified. The Battleworld fragment has been recovered."
    ],
    "keywords": [
      "FOREIGN KEY",
      "FOREIGNKEY",
      "FK"
    ],
    "answer": "FOREIGN KEY",
    "order": 30,
    "cleanTitle": "THE CROSS REFERENCE"
  }
];
