// src/gameData/mercenaries.js

// Definitions for different mercenary archetypes
export const mercenaryDefinitions = {
  'merc_guts_grunt': { // Unique Definition ID
    id: 'merc_guts_grunt',
    archetypeName: "Grunt", // Renamed from 'name'
    job: "Warrior",
    icon: "faUserShield", // Font Awesome icon name
    description: "A battle-hardened survivor, relies on brute force and endurance.",
    possibleEpithets: ["Iron", "Stone", "Grim", "Bold", "The Scarred", "The Fearless", "Rockjaw", "Bloodfist", "Hardy", "Stalwart"],
    baseStats: {
      strength: { min: 8, max: 12 },
      agility: { min: 5, max: 8 },
      willpower: { min: 6, max: 10 },
      initialSAN: { min: 80, max: 100 }
    },
    combatStats: {
      physicalAttack: { min: 6, max: 10 },
      physicalDefense: { min: 5, max: 8 },
      accuracy: { min: 60, max: 75 },
      evasion: { min: 20, max: 30 },
      critChance: { min: 5, max: 10 },
      hp: { min: 60, max: 80 }
    },
    possibleSkills: ["Heavy Swing", "Endure Pain"] // Potential skills
  },
  'merc_nimble_rogue': {
    id: 'merc_nimble_rogue',
    archetypeName: "Shadow", // Renamed from 'name'
    job: "Rogue",
    icon: "faUserSecret",
    description: "Quick and deadly, prefers striking from the shadows when possible.",
    possibleEpithets: ["Nimble", "Swift", "Dusk", "Silent", "The Cunning", "The Elusive", "Quickblade", "Nightwhisper", "Agile", "Stealthy"],
    baseStats: {
      strength: { min: 5, max: 8 },
      agility: { min: 8, max: 12 },
      willpower: { min: 5, max: 8 },
      initialSAN: { min: 70, max: 90 }
    },
    combatStats: {
      physicalAttack: { min: 5, max: 8 },
      physicalDefense: { min: 3, max: 5 },
      accuracy: { min: 70, max: 85 },
      evasion: { min: 40, max: 60 },
      critChance: { min: 10, max: 20 },
      hp: { min: 40, max: 60 }
    },
    possibleSkills: ["Quick Stab", "Fade"]
  },
  'merc_hedge_mage': {
      id: 'merc_hedge_mage',
      archetypeName: "Scholar", // Renamed from 'name'
      job: "Mage",
      icon: "faHatWizard",
      description: "Wields rudimentary magic, learned from forbidden texts found in ruins.",
      possibleEpithets: ["Hedge", "Arcane", "Mystic", "Curious", "The Learned", "The Wise", "Spellseeker", "Grimoire", "Ancient", "Studious"],
      baseStats: {
          strength: { min: 3, max: 6 },
          agility: { min: 4, max: 7 },
          willpower: { min: 8, max: 12 },
          initialSAN: { min: 60, max: 85 }
      },
      combatStats: {
        physicalAttack: { min: 2, max: 4 },
        physicalDefense: { min: 2, max: 4 },
        magicalAttack: { min: 7, max: 12 },
        magicalDefense: { min: 6, max: 9 },
        accuracy: { min: 65, max: 80 },
        evasion: { min: 30, max: 45 },
        critChance: { min: 8, max: 15 },
        hp: { min: 30, max: 50 }
      },
      possibleSkills: ["Mana Bolt", "Minor Ward"]
  }
  // Add more definitions here later
};

// Function to generate a new, unique mercenary instance based on a definition ID
export const createMercenaryInstance = (definitionId) => {
    const definition = mercenaryDefinitions[definitionId];
    if (!definition) {
        console.error(`Mercenary definition not found for ID: ${definitionId}`);
        return null;
    }

    // Helper to get a random int between min and max (inclusive)
    const getRandomStat = (statRange) => {
       return Math.floor(Math.random() * (statRange.max - statRange.min + 1)) + statRange.min;
    }

    // Calculate stats for this specific instance
    const stats = {
        strength: getRandomStat(definition.baseStats.strength),
        agility: getRandomStat(definition.baseStats.agility),
        willpower: getRandomStat(definition.baseStats.willpower),
    };
    
    // Calculate combat stats for this instance
    const combatStats = {
        physicalAttack: getRandomStat(definition.combatStats.physicalAttack),
        physicalDefense: getRandomStat(definition.combatStats.physicalDefense),
        accuracy: getRandomStat(definition.combatStats.accuracy),
        evasion: getRandomStat(definition.combatStats.evasion),
        critChance: getRandomStat(definition.combatStats.critChance),
        hp: getRandomStat(definition.combatStats.hp),
    };
    
    // Add magical stats if present in definition
    if (definition.combatStats.magicalAttack) {
        combatStats.magicalAttack = getRandomStat(definition.combatStats.magicalAttack);
    }
    if (definition.combatStats.magicalDefense) {
        combatStats.magicalDefense = getRandomStat(definition.combatStats.magicalDefense);
    }
    
    const initialSAN = getRandomStat(definition.baseStats.initialSAN);

    // Select one starting skill randomly from possibilities
    const startingSkill = definition.possibleSkills.length > 0
        ? definition.possibleSkills[Math.floor(Math.random() * definition.possibleSkills.length)]
        : null;
        
    // Generate a unique name using an epithet and the archetype name
    let finalName;
    if (definition.possibleEpithets && definition.possibleEpithets.length > 0) {
        // Select a random epithet
        const selectedEpithet = definition.possibleEpithets[Math.floor(Math.random() * definition.possibleEpithets.length)];
        
        // Determine name format based on epithet
        if (selectedEpithet.startsWith("The ")) {
            finalName = `${definition.archetypeName} ${selectedEpithet}`; // e.g., "Grunt The Fearless"
        } else {
            finalName = `${selectedEpithet} ${definition.archetypeName}`; // e.g., "Iron Grunt"
        }
    } else {
        // Fallback to just the archetype name if no epithets are defined
        finalName = definition.archetypeName;
    }

    return {
        instanceId: crypto.randomUUID(), // Unique ID for this specific mercenary
        definitionId: definitionId,
        name: finalName, // The unique generated name
        archetypeName: definition.archetypeName, // Store the original archetype name
        job: definition.job,
        icon: definition.icon,
        level: 1,
        xp: 0,
        currentSAN: initialSAN, // Starting SAN value
        maxSAN: initialSAN,    // Max SAN for reference
        stats: stats,          // Calculated base stats
        combatStats: combatStats, // Combat-specific stats
        currentHP: combatStats.hp, // Current HP equals max HP at creation
        skills: startingSkill ? [startingSkill] : [], // V1 gets one starting skill
        equipment: {           // Placeholder for equipment slots
            weapon: null,
            armor: null,
            accessory1: null,
            accessory2: null,
        },
        statusEffects: [],     // For future debuffs etc.
        // Add other instance-specific properties here later
    };
}; 