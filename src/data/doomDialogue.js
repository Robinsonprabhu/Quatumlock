// Narrative dialogue script and response trees for DOOM in Simple Indian English

export const DOOM_EMOTIONS = {
  IDLE: 'idle',
  SPEAKING: 'speaking',
  AMUSED: 'amused',
  THREATENING: 'threatening',
  CALCULATING: 'calculating',
  ENRAGED: 'enraged',
  DECEPTIVE: 'deceptive',
  GLITCHING: 'glitching'
};

export const LEVEL_DIALOGUES = {
  level_1: {
    intro: {
      id: 'l1_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.AMUSED,
      text: "Oho! Look who tried to enter Doctor Doom's system! You think hacking my network is that easy? I noticed your arrival immediately!",
      choices: [
        {
          id: 'l1_c1_defiant',
          label: "[DEFIANT] We are here to shut you down, DOOM!",
          doomReply: "Shut me down? Hahaha! You haven't even cleared Level 1 yet. Very big dream you have!",
          emotion: DOOM_EMOTIONS.THREATENING,
          flag: 'attitude_defiant'
        },
        {
          id: 'l1_c2_analytical',
          label: "[ANALYTICAL] We are checking your system logs.",
          doomReply: "Check whatever you want! In the end, you will only see your own failure!",
          emotion: DOOM_EMOTIONS.CALCULATING,
          flag: 'attitude_analytical'
        }
      ]
    },
    lie: {
      id: 'l1_lie',
      statement: "DOOM claims: 'The telemetry log is completely deleted; no packet data survived.'",
      truth: "Investigation terminal reveals initial TTL 64 and final TTL 60 are preserved intact.",
      contradictionKey: 'l1_telemetry_survived'
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.AMUSED,
        text: "Wrong answer! Check your calculation properly and try again!"
      },
      {
        emotion: DOOM_EMOTIONS.CALCULATING,
        text: "Another mistake! Don't guess blindly, calculate step by step: 64 minus 60!"
      },
      {
        emotion: DOOM_EMOTIONS.THREATENING,
        text: "Three wrong attempts already! Be careful, system is getting locked!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.CALCULATING,
      text: "Level 1 cleared! Hop count 4 verified. Not bad... but don't get too happy, this was just Level 1!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.DECEPTIVE,
      text: "Taking hints already? Don't rely on hints too much, use your own mind!"
    }
  },

  level_2: {
    intro: {
      id: 'l2_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.CALCULATING,
      text: "Welcome to Level 2! Now you are inside my CPU server rack. Let's see if you can calculate the hardware thread capacity correctly!",
      choices: [
        {
          id: 'l2_c1_investigate',
          label: "[QUERY] How many cores and threads are in this rack?",
          doomReply: "Check the specification sheet carefully! 2 sockets, 4 cores per socket, 2 threads per core!",
          emotion: DOOM_EMOTIONS.DECEPTIVE,
          flag: 'queried_buffer_x'
        },
        {
          id: 'l2_c2_mock',
          label: "[DISMISS] This CPU calculation is too easy for us.",
          doomReply: "Too easy? Overconfidence will cost you this mission! Do the multiplication properly!",
          emotion: DOOM_EMOTIONS.THREATENING,
          flag: 'mocked_caesar'
        }
      ]
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.AMUSED,
        text: "Wrong thread count! Multiply sockets (2), cores (4), and threads (2) properly!"
      },
      {
        emotion: DOOM_EMOTIONS.CALCULATING,
        text: "Incorrect calculation! 2 × 4 × 2... check your math again!"
      },
      {
        emotion: DOOM_EMOTIONS.ENRAGED,
        text: "Wrong again! You are wasting time! Think properly!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.DECEPTIVE,
      text: "Thread calculation correct! 16 threads assigned! But Level 3 is much tougher!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.AMUSED,
      text: "Checking hint again? Solve it yourself, it is simple multiplication!"
    }
  },

  level_3: {
    intro: {
      id: 'l3_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.THREATENING,
      text: "Level 3: Loop Execution Watchdog! My security script is running in a C loop. Can you tell how many times it will run?",
      choices: [
        {
          id: 'l3_c1_stack',
          label: "[ANALYZE] The loop condition runs from 0 to 20 with step 2.",
          doomReply: "Then count carefully! One small counting mistake and watchdog will reset!",
          emotion: DOOM_EMOTIONS.CALCULATING,
          flag: 'understood_recursion'
        },
        {
          id: 'l3_c2_threat',
          label: "[DEFY] We will break your loop counter.",
          doomReply: "Break my loop? You cannot even count 10 iterations properly!",
          emotion: DOOM_EMOTIONS.AMUSED,
          flag: 'stack_threatened'
        }
      ]
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.AMUSED,
        text: "Wrong counter value! Count the loop steps for i = 0, 2, 4, 6... up to 18!"
      },
      {
        emotion: DOOM_EMOTIONS.CALCULATING,
        text: "Calculation mismatch! 20 divided by step size 2... think!"
      },
      {
        emotion: DOOM_EMOTIONS.THREATENING,
        text: "Repeated errors! Watchdog timer is running out!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.GLITCHING,
      text: "Correct! Exactly 10 loop iterations! Good job... move to Level 4!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.DECEPTIVE,
      text: "Need help counting loop steps? Just divide total length by step size!"
    }
  },

  level_4: {
    intro: {
      id: 'l4_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.DECEPTIVE,
      text: "Level 4: Memory Cache Controller! Out of 100 total requests, 85 were cache hits. Calculate the hit rate percentage!",
      choices: [
        {
          id: 'l4_c1_dijkstra',
          label: "[MAP] We will compute the hit rate percentage.",
          doomReply: "Calculate fast! Cache telemetry updates every second!",
          emotion: DOOM_EMOTIONS.CALCULATING,
          flag: 'plotted_graph'
        },
        {
          id: 'l4_c2_bypass',
          label: "[INFILTRATE] We bypass the rate limiter directly.",
          doomReply: "You cannot bypass without transmitting the correct hit percentage!",
          emotion: DOOM_EMOTIONS.THREATENING,
          flag: 'tried_bypass'
        }
      ]
    },
    lie: {
      id: 'l4_lie',
      statement: "DOOM claims: 'Cache hit rate is less than 50% due to bus congestion.'",
      truth: "Telemetry logger shows 85 hits out of 100 total requests (85%).",
      contradictionKey: 'l4_delta_passable'
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.AMUSED,
        text: "Wrong percentage! Total is 100, hits are 85. What percentage is that?"
      },
      {
        emotion: DOOM_EMOTIONS.CALCULATING,
        text: "Math error! Hits divided by Total times 100!"
      },
      {
        emotion: DOOM_EMOTIONS.ENRAGED,
        text: "Wrong answer again! Check the numbers in the inspector!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.CALCULATING,
      text: "Correct! 85% hit rate! Memory bus synchronized! Level 5 unlocked!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.AMUSED,
      text: "Opening hint for basic percentage? 85 out of 100 is 85!"
    }
  },

  level_5: {
    intro: {
      id: 'l5_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.THREATENING,
      text: "Level 5: Binary Tree Firewall! 15 total nodes in a full binary tree. Find the maximum depth to clear Part 1!",
      choices: [
        {
          id: 'l5_c1_mask',
          label: "[CALCULATE] Solving 2^d - 1 = 15.",
          doomReply: "Solve it fast! 2 to what power equals 16?",
          emotion: DOOM_EMOTIONS.CALCULATING,
          flag: 'cidr_confident'
        },
        {
          id: 'l5_c2_overload',
          label: "[FLOOD] Traversing all nodes simultaneously.",
          doomReply: "Do not guess! Solve the depth equation properly!",
          emotion: DOOM_EMOTIONS.THREATENING,
          flag: 'broadcast_storm_attempt'
        }
      ]
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.AMUSED,
        text: "Wrong depth! 2^d − 1 = 15. So 2^d = 16. What is d?"
      },
      {
        emotion: DOOM_EMOTIONS.CALCULATING,
        text: "Incorrect tree depth! Count the levels: root=1, next=2, next=4, leaves=8!"
      },
      {
        emotion: DOOM_EMOTIONS.ENRAGED,
        text: "Wrong again! Think carefully before submitting!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.ENRAGED,
      text: "Depth 4 correct! PART 1 CLEARED! Get ready for Part 2!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.CALCULATING,
      text: "Hint: 2 raised to power 4 is 16. Subtract 1 to get 15!"
    }
  },

  level_6: {
    intro: {
      id: 'l6_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.THREATENING,
      text: "Welcome to Part 2! Level 6: Circular Buffer Queue! Current index is 6, adding 5 items. Find the modulo index!",
      choices: [
        {
          id: 'l6_c1_knapsack',
          label: "[OPTIMIZE] Calculating (6 + 5) mod 8.",
          doomReply: "What is 11 modulo 8? Don't make a simple calculation mistake!",
          emotion: DOOM_EMOTIONS.CALCULATING,
          flag: 'dp_optimizer'
        },
        {
          id: 'l6_c2_greedy',
          label: "[GREEDY] Moving pointer forward by 5.",
          doomReply: "Remember the buffer size is 8! It wraps around!",
          emotion: DOOM_EMOTIONS.AMUSED,
          flag: 'greedy_approach'
        }
      ]
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.AMUSED,
        text: "Wrong index! 6 + 5 = 11. Divide 11 by 8, what is the remainder?"
      },
      {
        emotion: DOOM_EMOTIONS.CALCULATING,
        text: "Incorrect! Remember modulo gives the remainder after division!"
      },
      {
        emotion: DOOM_EMOTIONS.THREATENING,
        text: "Wrong again! 11 mod 8 is a single-digit number!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.CALCULATING,
      text: "Index 3 correct! Buffer updated! Moving to Level 7!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.DECEPTIVE,
      text: "Need help with modulo? 11 divided by 8 is 1 with remainder 3!"
    }
  },

  level_7: {
    intro: {
      id: 'l7_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.DECEPTIVE,
      text: "Level 7: Stack Operations! Push 10, Push 20, Push 30, Pop, Push 40, Pop. What is at the top of the stack?",
      choices: [
        {
          id: 'l7_c1_inject',
          label: "[INSPECT] Tracing stack push and pop sequence.",
          doomReply: "Trace each step! The newest item added is the first one removed!",
          emotion: DOOM_EMOTIONS.CALCULATING,
          flag: 'sql_tautology'
        },
        {
          id: 'l7_c2_audit',
          label: "[AUDIT] Checking stack array memory.",
          doomReply: "Check what was pushed and what was popped!",
          emotion: DOOM_EMOTIONS.AMUSED,
          flag: 'sanitizer_audit'
        }
      ]
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.AMUSED,
        text: "Wrong stack top! Trace: 30 popped, 40 pushed then popped. What is under them?"
      },
      {
        emotion: DOOM_EMOTIONS.CALCULATING,
        text: "Incorrect! Remember 10 was pushed first, 20 second!"
      },
      {
        emotion: DOOM_EMOTIONS.ENRAGED,
        text: "Wrong answer! Follow LIFO rules step by step!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.GLITCHING,
      text: "Correct! 20 is at the top of the stack! Level 8 unlocked!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.AMUSED,
      text: "Hint: After popping 30 and 40, the second item pushed (20) becomes the top!"
    }
  },

  level_8: {
    intro: {
      id: 'l8_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.CALCULATING,
      text: "Level 8: Logic Circuit! Input A=1, Input B=0 pass through XOR gate, then a NOT gate. What is the output?",
      choices: [
        {
          id: 'l8_c1_banker',
          label: "[ANALYZE] Evaluating XOR then NOT gate.",
          doomReply: "1 XOR 0 is 1. Now invert 1 with NOT gate!",
          emotion: DOOM_EMOTIONS.CALCULATING,
          flag: 'ran_bankers'
        },
        {
          id: 'l8_c2_force',
          label: "[PREEMPT] Checking circuit truth table.",
          doomReply: "Truth table is simple: XNOR output for 1 and 0!",
          emotion: DOOM_EMOTIONS.THREATENING,
          flag: 'tried_preempt'
        }
      ]
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.AMUSED,
        text: "Wrong output! 1 XOR 0 is 1. NOT of 1 is what?"
      },
      {
        emotion: DOOM_EMOTIONS.CALCULATING,
        text: "Incorrect! The output can only be 0 or 1!"
      },
      {
        emotion: DOOM_EMOTIONS.ENRAGED,
        text: "Wrong again! Invert 1 to get the answer!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.CALCULATING,
      text: "Correct! Output is 0! XNOR circuit cleared! Level 9 unlocked!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.DECEPTIVE,
      text: "Hint: The opposite of 1 is 0!"
    }
  },

  level_9: {
    intro: {
      id: 'l9_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.THREATENING,
      text: "Level 9: Array Memory Offset! Array starts at address 1000. Each int is 4 bytes. Find address of data[5]!",
      choices: [
        {
          id: 'l9_c1_dfa',
          label: "[TRACE] Calculating 1000 + (5 * 4).",
          doomReply: "Multiply index 5 by 4 bytes, then add to 1000!",
          emotion: DOOM_EMOTIONS.CALCULATING,
          flag: 'dfa_traced'
        },
        {
          id: 'l9_c2_pattern',
          label: "[FORMULATE] Checking memory alignment.",
          doomReply: "Contiguous allocation means each element takes exactly 4 bytes!",
          emotion: DOOM_EMOTIONS.AMUSED,
          flag: 'language_theory'
        }
      ]
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.AMUSED,
        text: "Wrong memory address! Base 1000 + (index 5 × 4 bytes) = 1000 + 20!"
      },
      {
        emotion: DOOM_EMOTIONS.CALCULATING,
        text: "Incorrect! Add 20 to 1000!"
      },
      {
        emotion: DOOM_EMOTIONS.THREATENING,
        text: "Wrong again! Simple addition: 1000 + 20!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.GLITCHING,
      text: "Correct! Memory address 1020! Final Level 10 unlocked!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.CALCULATING,
      text: "Hint: 5 times 4 is 20. 1000 plus 20 is 1020!"
    }
  },

  level_10: {
    intro: {
      id: 'l10_intro',
      speaker: 'DOOM',
      emotion: DOOM_EMOTIONS.ENRAGED,
      text: "THE DOOMSDAY CORE! Final Level! When a running process requests I/O, what OS state does it enter?",
      choices: [
        {
          id: 'l10_c1_override',
          label: "[EXECUTE] Submitting OS process state: WAITING.",
          doomReply: "Is it WAITING or READY? Think before you disarm the Core!",
          emotion: DOOM_EMOTIONS.ENRAGED,
          flag: 'master_override_attempt'
        },
        {
          id: 'l10_c2_reckoning',
          label: "[FINAL] Doctor Doom, your core is disarmed now!",
          doomReply: "Show me your OS knowledge if you dare!",
          emotion: DOOM_EMOTIONS.GLITCHING,
          flag: 'final_reckoning'
        }
      ]
    },
    wrongAnswers: [
      {
        emotion: DOOM_EMOTIONS.ENRAGED,
        text: "Wrong state! Process cannot execute on CPU during I/O... it must wait!"
      },
      {
        emotion: DOOM_EMOTIONS.GLITCHING,
        text: "Incorrect! Think of OS process states: NEW, READY, RUNNING, WAITING, TERMINATED!"
      },
      {
        emotion: DOOM_EMOTIONS.ENRAGED,
        text: "Wrong again! Type WAITING or BLOCKED!"
      }
    ],
    correctAnswer: {
      emotion: DOOM_EMOTIONS.GLITCHING,
      text: "WAITING STATE CORRECT! DOOMSDAY CORE DISARMED! YOU SAVED THE WORLD!"
    },
    hintReaction: {
      emotion: DOOM_EMOTIONS.ENRAGED,
      text: "Hint: A process waiting for disk or network I/O enters the WAITING state!"
    }
  }
};

export const CINEMATIC_EVENTS = {
  PART_2_UNLOCKED: {
    id: 'cinematic_part2_unlocked',
    title: 'CONTAINMENT BREACH // PART 2 UNLOCKED',
    speaker: 'DOOM',
    emotion: DOOM_EMOTIONS.ENRAGED,
    lines: [
      "Alert! Part 1 breached!",
      "You passed the first 5 levels... Not bad at all.",
      "But do not celebrate early! You are entering Part 2 now.",
      "Levels 6 to 10 are in Doctor Doom's inner sanctum.",
      "Let us see if your mind can handle the remaining challenges!"
    ]
  },
  VICTORY: {
    id: 'cinematic_victory',
    title: 'DOOM OVERRIDE COMPLETE // SYSTEM LIBERATED',
    speaker: 'SYSTEM OVERRIDE',
    emotion: DOOM_EMOTIONS.CALCULATING,
    lines: [
      "ALERT: Doctor Doom neutralized!",
      "All 10 security levels cleared successfully!",
      "AIDEX'26 Operatives: Mission accomplished!",
      "You have saved Latveria-Net and disarmed the Doomsday Core!",
      "VICTORY IS YOURS!"
    ]
  }
};
