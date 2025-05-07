// src/gameData/enemies.js

// Define enemy types with their base stats
export const enemyTypes = {
  // Basic enemies for early areas
  'goblin_scout': {
    name: 'Goblin Scout',
    description: 'A small, nimble goblin that specializes in scouting and quick attacks.',
    type: 'Humanoid',
    icon: '👺',
    baseStats: {
      physicalAttack: 5,
      physicalDefense: 3,
      magicalAttack: 0,
      magicalDefense: 2,
      accuracy: 65,
      evasion: 30,
      critChance: 5,
      hp: 40
    },
    possibleSkills: ['Quick Stab']
  },
  
  'goblin_warrior': {
    name: 'Goblin Warrior',
    description: 'A stronger goblin equipped with crude weapons and basic armor.',
    type: 'Humanoid',
    icon: '👹',
    baseStats: {
      physicalAttack: 8,
      physicalDefense: 6,
      magicalAttack: 0,
      magicalDefense: 3,
      accuracy: 60,
      evasion: 15,
      critChance: 3,
      hp: 60
    },
    possibleSkills: ['Heavy Swing']
  },
  
  'forest_wolf': {
    name: 'Forest Wolf',
    description: 'A fierce predator that hunts in packs. Fast and aggressive.',
    type: 'Beast',
    icon: '🐺',
    baseStats: {
      physicalAttack: 7,
      physicalDefense: 4,
      magicalAttack: 0,
      magicalDefense: 2,
      accuracy: 70,
      evasion: 25,
      critChance: 10,
      hp: 50
    },
    possibleSkills: ['Quick Stab'] // Using Quick Stab to represent fast bite
  },
  
  // Mid-tier enemies for later areas
  'corrupted_cultist': {
    name: 'Corrupted Cultist',
    description: 'A human follower of forbidden knowledge, wielding destructive magic.',
    type: 'Humanoid',
    icon: '🧙',
    baseStats: {
      physicalAttack: 4,
      physicalDefense: 5,
      magicalAttack: 10,
      magicalDefense: 8,
      accuracy: 75,
      evasion: 20,
      critChance: 8,
      hp: 45
    },
    possibleSkills: ['Mana Bolt']
  },
  
  'twisted_sentinel': {
    name: 'Twisted Sentinel',
    description: 'A once-human guardian corrupted by dark forces. Heavily armored but slow.',
    type: 'Corrupted',
    icon: '🛡️',
    baseStats: {
      physicalAttack: 12,
      physicalDefense: 12,
      magicalAttack: 0,
      magicalDefense: 6,
      accuracy: 55,
      evasion: 10,
      critChance: 5,
      hp: 80
    },
    possibleSkills: ['Endure Pain']
  },
  
  'shadow_stalker': {
    name: 'Shadow Stalker',
    description: 'A being of pure darkness that feeds on fear. Hard to hit and unpredictable.',
    type: 'Supernatural',
    icon: '👤',
    baseStats: {
      physicalAttack: 8,
      physicalDefense: 3,
      magicalAttack: 6,
      magicalDefense: 10,
      accuracy: 80,
      evasion: 40,
      critChance: 15,
      hp: 40
    },
    possibleSkills: ['Fade']
  }
};

// Map areas to their potential enemy spawns with difficulty modifiers
export const areaEnemies = {
  'whispering-woods': {
    enemies: ['goblin_scout', 'goblin_warrior', 'forest_wolf'],
    difficultyMod: 1.0, // Base difficulty
    levelRange: [1, 3]
  },
  'ruined-outpost': {
    enemies: ['goblin_warrior', 'corrupted_cultist', 'twisted_sentinel'],
    difficultyMod: 1.1, // 10% harder than base
    levelRange: [2, 4]
  },
  'haunted-ruins': {
    enemies: ['goblin_warrior', 'corrupted_cultist', 'shadow_stalker'],
    difficultyMod: 1.2, // 20% harder than base
    levelRange: [2, 5]
  },
  'blighted-marsh': {
    enemies: ['corrupted_cultist', 'twisted_sentinel', 'shadow_stalker'],
    difficultyMod: 1.4, // 40% harder than base
    levelRange: [4, 7]
  }
};

// Function to create an enemy instance for a specific area and level
export const createEnemyInstance = (areaId, level = 1) => {
  // Get area configuration
  const areaConfig = areaEnemies[areaId];
  if (!areaConfig) {
    console.error(`Area not found: ${areaId}`);
    return null;
  }
  
  // Randomly select an enemy type from the area's possible enemies
  const enemyTypeId = areaConfig.enemies[Math.floor(Math.random() * areaConfig.enemies.length)];
  const enemyType = enemyTypes[enemyTypeId];
  
  if (!enemyType) {
    console.error(`Enemy type not found: ${enemyTypeId}`);
    return null;
  }
  
  // Calculate level-based stat multiplier
  const levelMod = 1 + (level - 1) * 0.1; // Each level adds 10% to stats
  
  // Apply area difficulty modifier and level modifier to stats
  const combatStats = {};
  Object.entries(enemyType.baseStats).forEach(([stat, value]) => {
    combatStats[stat] = Math.round(value * areaConfig.difficultyMod * levelMod);
  });
  
  // Randomly select a skill if the enemy type has possible skills
  let skill = null;
  if (enemyType.possibleSkills && enemyType.possibleSkills.length > 0) {
    skill = enemyType.possibleSkills[Math.floor(Math.random() * enemyType.possibleSkills.length)];
  }
  
  // Create the enemy instance
  return {
    id: `${enemyTypeId}_${Date.now()}`,
    name: enemyType.name,
    type: enemyType.type,
    icon: enemyType.icon,
    description: enemyType.description,
    level: level,
    area: areaId,
    combatStats: combatStats,
    currentHP: combatStats.hp,
    skills: skill ? [skill] : [],
    activeBuffs: []
  };
}; 