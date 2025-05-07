// src/gameData/explorationEvents.js

// Exploration event definitions for Bleak Expanse
export const explorationEvents = [
  {
    id: 'abandoned_campsite',
    description: "You stumble upon a hastily abandoned campsite. The fire is still warm, and supplies are scattered around as if the occupants left in a hurry.",
    choices: [
      {
        text: "Rummage through the supplies",
        outcome: { 
          type: 'gain_resources', 
          resources: [
            { id: 'gold', amount: 15, chance: 0.8 },
            { id: 'herbs', amount: 5, chance: 0.6 },
            { id: 'minor_healing_salve', amount: 1, chance: 0.3 }
          ],
          resultText: "You found some valuable supplies in the abandoned camp!"
        }
      },
      {
        text: "Leave it undisturbed",
        outcome: { 
          type: 'gain_san', 
          amount: 3,
          resultText: "Your mercenaries appreciate the cautious approach, feeling more at ease."
        }
      }
    ],
    areaTypes: ['whispering-woods', 'ruined-outpost'] // Which areas this event can appear in
  },
  {
    id: 'strange_shrine',
    description: "Your party discovers a small, ancient shrine hidden among the vegetation. Strange symbols and dried bloodstains cover its surface.",
    choices: [
      {
        text: "Offer a small sacrifice (5 Vitae)",
        outcome: { 
          type: 'sacrifice_and_reward', 
          cost: { id: 'vitae_essence', amount: 5 },
          reward: [
            { id: 'behelit_shard', amount: 1, chance: 0.2 },
            { id: 'echoes', amount: 2, chance: 0.7 }
          ],
          resultText: "The shrine glows briefly after your offering. You sense a power within it responding."
        }
      },
      {
        text: "Study the symbols",
        outcome: { 
          type: 'gain_item', 
          itemId: 'recipe_scroll_basic',
          chance: 0.4,
          failText: "The symbols resist understanding, fading from your memory as soon as you look away.",
          successText: "You decipher part of the ancient text, recording the knowledge for later study."
        }
      },
      {
        text: "Destroy the shrine",
        outcome: { 
          type: 'lose_san', 
          amount: 5,
          resultText: "As your mercenaries destroy the shrine, they experience disturbing visions that linger uncomfortably."
        }
      }
    ],
    areaTypes: ['whispering-woods', 'ruined-outpost']
  },
  {
    id: 'wounded_mercenary',
    description: "You find a wounded mercenary from another expedition. They are badly injured and unlikely to survive without help.",
    choices: [
      {
        text: "Help them recover",
        outcome: { 
          type: 'random_outcome',
          outcomes: [
            { 
              chance: 0.7, 
              result: { 
                type: 'gain_resources', 
                resources: [
                  { id: 'gold', amount: 25, chance: 1.0 }
                ],
                resultText: "The mercenary recovers and gratefully offers you gold as thanks before departing."
              }
            },
            { 
              chance: 0.3, 
              result: { 
                type: 'join_expedition', 
                resultText: "The mercenary recovers and, having nowhere else to go, offers to join your expedition!"
              }
            }
          ]
        }
      },
      {
        text: "Take their supplies and leave",
        outcome: { 
          type: 'gain_resources', 
          resources: [
            { id: 'gold', amount: 15, chance: 1.0 },
            { id: 'blood_vial', amount: 1, chance: 0.5 }
          ],
          sanCost: 8,
          resultText: "You loot the wounded mercenary's supplies, but your squad is disturbed by this dishonorable act."
        }
      },
      {
        text: "Leave them to their fate",
        outcome: { 
          type: 'lose_san', 
          amount: 2,
          resultText: "Your mercenaries silently move on, but the memory of abandoning a fellow warrior weighs on them."
        }
      }
    ],
    areaTypes: ['ruined-outpost']
  }
];

// Function to get relevant events for a specific area
export const getEventsForArea = (areaId) => {
  return explorationEvents.filter(event => event.areaTypes.includes(areaId));
};

// Function to pick a random event from available events
export const getRandomEvent = (areaId) => {
  const availableEvents = getEventsForArea(areaId);
  if (availableEvents.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableEvents.length);
  return availableEvents[randomIndex];
};

// Constant for event chance (can be adjusted based on balance needs)
export const EVENT_CHANCE = 0.3; // 30% chance per expedition 