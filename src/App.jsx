import { useState, useEffect, useRef } from 'react'
import IntroPage from './pages/IntroPage'
import GamePage from './pages/GamePage'
import { mercenaryDefinitions, createMercenaryInstance } from './gameData/mercenaries'
import { recipeDefinitions, getRecipeById } from './gameData/recipes'
import { synthesisRecipeDefinitions, getSynthesisRecipeById } from './gameData/synthesisRecipes'
import { createItemInstance, getItemDefinition, itemDefinitions } from './gameData/items'
import { gachaPools } from './gameData/gachaPools'
import { prayerLootTable, selectWeightedLoot, generateQuantity, selectRandomQuality } from './gameData/prayerLootTable'
import { taskDefinitions, getTaskById, TASK_TYPES } from './gameData/tasks'
import { createEnemyInstance } from './gameData/enemies'
import { shouldSkillTrigger, applySkillEffect, processBuffDurations } from './gameData/skills'
import { shopItemDefinitions, getShopListingById } from './gameData/shopItems'
import { initialMarketListings, MARKET_BUYBACK_RATES } from './gameData/marketListings'
import './App.css'
import ThePaupersHand from './components/ThePaupersHand'

// Market tax rate for all transactions in the Wyrd Exchange
const MARKET_TAX_RATE = 0.05; // 5% tax

// Function to get the default game state for a new game
const getDefaultGameState = () => {
  return {
    // Current page state to persist navigation
    currentPage: 'game',
    
    // UI state for module persistence
    ui: {
      currentModuleView: 'The Bleeding Heart - Base',
      currentModule: 'The Bleeding Heart - Base',
    },
    
    // Core resources
    vitaeEssence: 300,
    behelitShard: 25,
    berserkBoiCurrency: 0,
    gold: 1000,
    echoes: 15,

    // Mercenary state - initialize with starting mercenaries
    playerMercenaries: [
      createMercenaryInstance('merc_guts_grunt'),
      createMercenaryInstance('merc_nimble_rogue')
    ].filter(merc => merc !== null),
    selectedMercId: null,

    // Iron Forge state
    knownRecipes: recipeDefinitions.filter(r => r.unlocked),
    craftingQueue: [],
    
    // Altar of Binding state
    knownSynthesisRecipes: synthesisRecipeDefinitions.filter(r => r.unlocked),
    synthesisQueue: [],

    // Stash items - initial inventory
    stashItems: [
      // Basic materials
      { id: 'wood', name: 'Wood', quantity: 50, icon: '🪵', type: 'Material', color: '#8b4513' },
      { id: 'iron_ore', name: 'Iron Ore', quantity: 50, icon: '⛏️', type: 'Material', color: '#c0c0c0' },
      { id: 'steel_ingot', name: 'Steel Ingot', quantity: 5, icon: '🧱', type: 'Material', color: '#a8a8a8' },
      { id: 'leather', name: 'Leather', quantity: 8, icon: '🧶', type: 'Material', color: '#8b6b4b' },
      { id: 'herbs', name: 'Herbs', quantity: 20, icon: '🌿', type: 'Material', color: '#3cb371' },
      { id: 'magic_crystal', name: 'Magic Crystal', quantity: 3, icon: '💎', type: 'Material', color: '#9370db' },
      { id: 'ruined_hide', name: 'Ruined Hide', quantity: 5, icon: '🥩', type: 'Material', color: '#8b6b4b' },
      
      // Weapons - 3 basic options
      createItemInstance('rusty_dagger'),
      createItemInstance('iron_sword'),
      createItemInstance('crude_axe'),
      
      // Armor - 3 basic options
      createItemInstance('leather_armor'),
      createItemInstance('iron_helmet'),
      createItemInstance('tattered_rags'),
      
      // Accessories - 3 basic options
      createItemInstance('lucky_charm'),
      createItemInstance('iron_bracers'),
      createItemInstance('bone_necklace')
    ],

    // Core stats for The Bleeding Heart
    sanctumIntegrity: 50,
    maxSanctumIntegrity: 100,
    collectiveConsciousness: 15,

    // Upgrade modifiers
    maxIntegrityBonus: 0,
    decayRateModifier: 1,

    // Threat management
    currentThreatLevel: 0,
    activeThreat: null,
    isWarded: false,
    
    // Active temporary buffs with duration
    activeTemporaryBuffs: [],
    
    // Bleeding Heart UI state
    bleedingHeartState: {
      upgradeLevels: {
        reinforce: 0,
        soothe: 0,
        ward: 0
      },
      showUpgrades: false,
      threatAssessmentEndTime: Date.now() + 272000 // 272 seconds from now
    },

    // Exploration state - BleakExpanse
    bleakExpanse: {
      selectedArea: null,
      isExploring: false,
      secondsRemaining: 0,
      lastRewards: null,
      selectedSquad: [],
      showSquadModal: false,
      lastCombatResult: null,
      expeditionEvents: [],
      activeEvent: null,
      expeditionPaused: false
    },

    // Global exploration task state
    activeExplorationTask: null,
    explorationEventActive: false,
    currentExplorationEvent: null,

    // Whispers of Fate (Gacha) state
    whispersOfFate: {
      pityCounterTenPull: 0,
      lastPulls: []
    },
    
    // Task System - player's progress on tasks
    playerTasks: {},
    
    // Wyrd Exchange state - initialize with market listings
    marketListings: initialMarketListings.map(listing => ({
      ...listing,
      currentStock: listing.initialStock,
      currentPriceBerserkBoi: listing.priceBerserkBoi,
      currentPriceGold: listing.priceGold
    }))
  };
};

// Create a single shared initial state to avoid multiple localStorage loads
let initialGameState = null;

// Function to get the initial state (used by all useState hooks)
const getInitialState = () => {
  // If we already loaded it, return the cached version
  if (initialGameState !== null) {
    return initialGameState;
  }
  
  // Otherwise, load it from localStorage or defaults
  initialGameState = loadInitialState();
  return initialGameState;
};

// Function to load initial state from localStorage or get default state
const loadInitialState = () => {
  console.log('Attempting to load state from localStorage...');
  const savedStateJSON = localStorage.getItem('brandOfIronSave');
  console.log('Raw savedStateJSON from localStorage:', savedStateJSON);
  if (savedStateJSON) {
    try {
      const loadedState = JSON.parse(savedStateJSON);
      console.log('Successfully parsed loadedState:', loadedState);
      const defaultState = getDefaultGameState();
      // Deep merge loadedState into defaultState
      const initialState = mergeWithDefaults(defaultState, loadedState);
      console.log('Final initialState after merge:', initialState);
      return initialState;
    } catch (error) {
      console.error('ERROR parsing saved state:', error, 'Saved JSON was:', savedStateJSON);
      localStorage.removeItem('brandOfIronSave');
      return getDefaultGameState();
    }
  }
  console.log('No saved state found, returning default state.');
  return getDefaultGameState();
};

// Replace mergeWithDefaults with a robust version
const mergeWithDefaults = (defaults, loaded) => {
  // If loaded is null or not an object, return defaults
  if (!loaded || typeof loaded !== 'object' || Array.isArray(loaded)) return defaults;
  if (!defaults || typeof defaults !== 'object' || Array.isArray(defaults)) return loaded;

  const result = { ...defaults };

  Object.keys(defaults).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(loaded, key)) {
      if (
        typeof defaults[key] === 'object' &&
        defaults[key] !== null &&
        !Array.isArray(defaults[key]) &&
        typeof loaded[key] === 'object' &&
        loaded[key] !== null &&
        !Array.isArray(loaded[key])
      ) {
        // Recursively merge nested objects
        result[key] = mergeWithDefaults(defaults[key], loaded[key]);
      } else {
        // Use loaded value if defined, else default
        result[key] = loaded[key] !== undefined ? loaded[key] : defaults[key];
      }
    } else {
      // Use default if not present in loaded
      result[key] = defaults[key];
    }
  });

  // Add any extra keys from loaded that aren't in defaults
  Object.keys(loaded).forEach(key => {
    if (!(key in defaults)) {
      result[key] = loaded[key];
    }
  });

  return result;
};

// Main App component that manages the current page state
function App() {
  // Load shared initial state once
  const initialState = getInitialState();
  
  // Page state - ensure it defaults to game page after load
  const [currentPage, setCurrentPage] = useState(initialState.currentPage || 'game')
  
  // UI state for module persistence
  const [currentModuleView, setCurrentModuleView] = useState(initialState.ui?.currentModuleView || 'The Bleeding Heart - Base')
  
  // Ref for BleakExpanse component
  const bleakExpanseRef = useRef(null);
  
  // Ref for threat timer
  const threatTimerRef = useRef(null);
  
  // Core resources
  const [vitaeEssence, setVitaeEssence] = useState(initialState.vitaeEssence)
  const [behelitShard, setBehelitShard] = useState(initialState.behelitShard)
  const [berserkBoiCurrency, setBerserkBoiCurrency] = useState(initialState.berserkBoiCurrency)
  const [gold, setGold] = useState(initialState.gold)
  const [echoes, setEchoes] = useState(initialState.echoes)
  
  // Market listings state for Wyrd Exchange
  const [marketListings, setMarketListings] = useState(
    initialState.marketListings || initialMarketListings.map(listing => ({
      ...listing,
      currentStock: listing.initialStock,
      currentPriceBerserkBoi: listing.priceBerserkBoi,
      currentPriceGold: listing.priceGold
    }))
  );
  
  // Mercenary state
  const [playerMercenaries, setPlayerMercenaries] = useState(initialState.playerMercenaries)
  const [selectedMercId, setSelectedMercId] = useState(initialState.selectedMercId)
  
  // Helper function to calculate squad power based on mercenary stats
  const calculateSquadPower = (squad) => {
    if (!squad || squad.length === 0) return 0;
    
    // Calculate the total power of the squad based on relevant stats
    return squad.reduce((totalPower, merc) => {
      // Basic power formula: strength + agility modified by level
      const basePower = (merc.stats.strength + merc.stats.agility) * (1 + (merc.level - 1) * 0.1);
      
      // Apply SAN status modifier - reduced effectiveness at low SAN
      const sanRatio = merc.currentSAN / merc.maxSAN;
      const sanModifier = sanRatio >= 0.7 ? 1.0 : (sanRatio >= 0.4 ? 0.8 : 0.6);
      
      return totalPower + (basePower * sanModifier);
    }, 0);
  };
  
  // Helper function to calculate total combat stats for a mercenary including equipment bonuses
  const calculateTotalCombatStats = (mercenary) => {
    if (!mercenary) return null;
    
    // Start with the mercenary's base combat stats
    const totalCombatStats = { ...mercenary.combatStats };
    
    // Process each equipped item
    Object.values(mercenary.equipment).forEach(item => {
      if (!item) return; // Skip empty equipment slots
      
      // Add the item's combat stats to the total
      if (item.combatStats) {
        Object.entries(item.combatStats).forEach(([stat, value]) => {
          // Initialize the stat if it doesn't exist yet
          if (totalCombatStats[stat] === undefined) {
            totalCombatStats[stat] = 0;
          }
          
          // Add the item's stat value
          totalCombatStats[stat] += value;
        });
      }
    });
    
    // Apply level modifier to the stats (5% increase per level)
    const levelModifier = 1 + (mercenary.level - 1) * 0.05;
    Object.keys(totalCombatStats).forEach(stat => {
      totalCombatStats[stat] = Math.round(totalCombatStats[stat] * levelModifier);
    });
    
    // Apply SAN status modifier - reduced effectiveness at low SAN
    const sanRatio = mercenary.currentSAN / mercenary.maxSAN;
    const sanModifier = sanRatio >= 0.7 ? 1.0 : (sanRatio >= 0.4 ? 0.8 : 0.6);
    
    Object.keys(totalCombatStats).forEach(stat => {
      // Don't adjust HP with SAN modifier
      if (stat !== 'hp') {
        totalCombatStats[stat] = Math.round(totalCombatStats[stat] * sanModifier);
      }
    });
    
    return totalCombatStats;
  };
  
  // Helper function to get exploration modifiers based on Bastion state
  const getExplorationModifiers = (integrity, consciousness) => {
    let resourceMod = 1.0; // Base 100%
    let sanCostMod = 1.0; // Base 100%
    let combatBonus = 0; // Base bonus
    
    // Resource modifier based on Sanctum Integrity
    if (integrity > 80) resourceMod = 1.1; 
    else if (integrity < 40) resourceMod = 0.9;
    
    // SAN cost modifier based on Collective Consciousness
    if (consciousness > 70) sanCostMod = 0.8; 
    else if (consciousness < 30) sanCostMod = 1.2;
    
    // Combat bonus based on Collective Consciousness
    if (consciousness > 75) combatBonus = 5; // Small flat bonus to squad power
    
    return { resourceMod, sanCostMod, combatBonus };
  };
  
  // Iron Forge state
  const [knownRecipes, setKnownRecipes] = useState(initialState.knownRecipes);
  const [craftingQueue, setCraftingQueue] = useState(initialState.craftingQueue);
  
  // Altar of Binding state
  const [knownSynthesisRecipes, setKnownSynthesisRecipes] = useState(initialState.knownSynthesisRecipes || []);
  const [synthesisQueue, setSynthesisQueue] = useState(initialState.synthesisQueue || []);
  
  // Stash items - array of inventory items
  const [stashItems, setStashItems] = useState(initialState.stashItems)
  
  // Core stats for The Bleeding Heart
  const [sanctumIntegrity, setSanctumIntegrity] = useState(initialState.sanctumIntegrity)
  const [maxSanctumIntegrity, setMaxSanctumIntegrity] = useState(initialState.maxSanctumIntegrity)
  const [collectiveConsciousness, setCollectiveConsciousness] = useState(initialState.collectiveConsciousness)
  
  // Upgrade modifiers
  const [maxIntegrityBonus, setMaxIntegrityBonus] = useState(initialState.maxIntegrityBonus)
  const [decayRateModifier, setDecayRateModifier] = useState(initialState.decayRateModifier)
  
  // Bleeding Heart UI state - persistently store UI state
  const [bleedingHeartState, setBleedingHeartState] = useState(() => {
    const state = initialState.bleedingHeartState || {
      upgradeLevels: { reinforce: 0, soothe: 0, ward: 0 },
      showUpgrades: false,
      threatAssessmentEndTime: Date.now() + 272000
    };
    // If threatAssessmentEndTime is missing, add it
    if (!state.threatAssessmentEndTime) {
      state.threatAssessmentEndTime = Date.now() + 272000;
    }
    return state;
  });
  
  // Threat management
  const [currentThreatLevel, setCurrentThreatLevel] = useState(initialState.currentThreatLevel)
  const [activeThreat, setActiveThreat] = useState(initialState.activeThreat)
  const [isWarded, setIsWarded] = useState(initialState.isWarded)
  
  // Temporary buffs with durations
  const [activeTemporaryBuffs, setActiveTemporaryBuffs] = useState(initialState.activeTemporaryBuffs || [])
  const buffTimerRef = useRef(null);
  
  // BleakExpanse state
  const [bleakExpanseState, setBleakExpanseState] = useState(initialState.bleakExpanse || {
    selectedArea: null,
    isExploring: false,
    secondsRemaining: 0,
    lastRewards: null,
    selectedSquad: [],
    showSquadModal: false,
    lastCombatResult: null,
    expeditionEvents: [],
    activeEvent: null,
    expeditionPaused: false
  })
  
  // Global exploration task state
  const [activeExplorationTask, setActiveExplorationTask] = useState(initialState.activeExplorationTask || null)
  const [explorationEventActive, setExplorationEventActive] = useState(initialState.explorationEventActive || false)
  const [currentExplorationEvent, setCurrentExplorationEvent] = useState(initialState.currentExplorationEvent || null)
  const explorationTimerRef = useRef(null)
  
  // Exploration areas and loot tables (needed for global exploration)
  const explorationAreas = [
    {
      id: 'whispering-woods',
      name: 'Whispering Woods',
      description: 'A dense forest with ancient trees that seem to whisper ancient secrets.',
      risk: 'Low',
      yields: 'Wood, Herbs, Vitae',
      color: '#2d4a22',
      duration: 300, // 5 minutes in seconds
    },
    {
      id: 'ruined-outpost',
      name: 'Ruined Outpost',
      description: 'Abandoned remnants of a military outpost, now home to scavengers and lost treasures.',
      risk: 'Medium',
      yields: 'Ore, Crystals, Vitae',
      color: '#555555',
      duration: 600, // 10 minutes in seconds
    }
  ];

  // Loot tables for different areas
  const lootTables = {
    'whispering-woods': { 
      duration: 300, 
      enemyPower: 15, // Combat difficulty rating
      guaranteed: [{id: 'vitae_essence', min: 5, max: 10}], 
      common: [{id: 'wood', name: 'Wood', icon: 'faLeaf', type: 'Material', color: '#8b4513', chance: 0.8, min: 20, max: 40}, 
               {id: 'herbs', name: 'Herbs', icon: 'faSeedling', type: 'Material', color: '#3cb371', chance: 0.7, min: 15, max: 30}], 
      uncommon: [{id: 'magic_crystal', name: 'Magic Crystal', icon: 'faStar', type: 'Material', color: '#9370db', chance: 0.2, min: 1, max: 3}], 
      rare: [{id: 'behelit_shard', chance: 0.01, min:1, max:1}, 
             {id: 'echoes', chance: 0.05, min: 1, max: 2}],
      itemDrops: [
        { itemId: 'minor_healing_salve', name: 'Minor Healing Salve', icon: '🧪', type: 'Consumable', chance: 0.15, color: '#3cb371' },
        { itemId: 'worn_dagger', name: 'Worn Dagger', icon: '🗡️', type: 'Weapon', subType: 'Dagger', chance: 0.05, quality: 'Tattered', color: '#8b4513',
          stats: { agility: 1 } },
        { itemId: 'recipe_scroll_basic', name: 'Basic Recipe Scroll', icon: '📜', type: 'Recipe', chance: 0.02, color: '#d4c9a8' }
      ],
      enemies: ['Feral Wolves', 'Corrupted Plants', 'Swamp Lurkers']
    },
    'ruined-outpost': { 
      duration: 600, 
      enemyPower: 30, // Combat difficulty rating
      guaranteed: [{id: 'vitae_essence', min: 10, max: 20}], 
      common: [{id: 'ore', name: 'Ore', icon: 'faGem', type: 'Material', color: '#c0c0c0', chance: 0.8, min: 15, max: 30}, 
               {id: 'gold', chance: 0.6, min: 20, max: 50}], 
      uncommon: [{id: 'magic_crystal', name: 'Magic Crystal', icon: 'faStar', type: 'Material', color: '#9370db', chance: 0.4, min: 2, max: 5}], 
      rare: [{id: 'behelit_shard', chance: 0.02, min:1, max:1}, 
             {id: 'echoes', chance: 0.1, min: 2, max: 4}],
      itemDrops: [
        { itemId: 'blood_vial', name: 'Blood Vial', icon: '🧪', type: 'Consumable', chance: 0.12, color: '#800000' },
        { itemId: 'iron_scraps', name: 'Iron Scraps', icon: '⛏️', type: 'Material', chance: 0.2, color: '#c0c0c0' },
        { itemId: 'militia_sword', name: 'Militia Sword', icon: '⚔️', type: 'Weapon', subType: 'Sword', chance: 0.08, quality: 'Common', color: '#a8a8a8',
          stats: { strength: 3 } },
        { itemId: 'tattered_armor', name: 'Tattered Armor', icon: '🥋', type: 'Armor', subType: 'Chest', chance: 0.06, quality: 'Tattered', color: '#8b6b4b',
          stats: { strength: 1, agility: 1 } },
        { itemId: 'recipe_scroll_advanced', name: 'Advanced Recipe Scroll', icon: '📜', type: 'Recipe', chance: 0.03, color: '#d4c9a8' }
      ],
      enemies: ['Mire Goblins', 'Scavengers', 'Restless Spirits']
    }
  };
  
  // Function to create an equipment item instance (simplified copy from elsewhere)
  const createItemInstance2 = (itemId) => {
    // First try to use the imported createItemInstance from items.js
    const itemFromDefinitions = createItemInstance(itemId);
    if (itemFromDefinitions) {
      return itemFromDefinitions;
    }
    
    // Fall back to lootTables lookup if the imported function fails
    console.log(`Falling back to lootTables lookup for item: ${itemId}`);
    
    // Default data for any valid item
    const defaultItem = {
      id: itemId,
      name: itemId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      instanceId: `item_${itemId}_${Date.now()}`,
      type: 'Item'
    };
    
    // Get base data for item
    let itemData = Object.values(lootTables)
      .flatMap(area => area.itemDrops || [])
      .find(item => (item.itemId || item.id) === itemId);
    
    if (!itemData) {
      console.warn(`No data found for item: ${itemId}`);
      return defaultItem;
    }
    
    // Create an instance with a unique ID
    return {
      id: itemId,
      name: itemData.name || defaultItem.name,
      type: itemData.type || 'Item',
      subType: itemData.subType,
      icon: itemData.icon || '❓',
      quality: itemData.quality || 'Common',
      stats: itemData.stats || {},
      instanceId: `eq_${itemId}_${Date.now()}`,
      color: itemData.color || '#888888'
    };
  };
  
  // Possible threats for the sanctuary
  const possibleThreats = [
    "The Abyss Gazes Back",
    "Whispering Madness",
    "Psychic Drain",
    "Looming Dread",
    "Shadow Encroachment"
  ]

  // Track player's task progress
  const [playerTasks, setPlayerTasks] = useState(() => {
    // Initialize playerTasks with entries for each unlockedByDefault task
    const initialTasks = {};
    taskDefinitions.forEach(task => {
      if (task.unlockedByDefault) {
        initialTasks[task.id] = { progress: 0, completed: false, claimed: false };
      }
    });
    
    // Log the initial tasks for debugging
    console.log('Initializing playerTasks with:', Object.keys(initialTasks).length, 'tasks:', initialTasks);
    
    return getInitialState().playerTasks || initialTasks;
  });
  
  // Function to collect the entire game state
  const collectGameState = () => {
    return {
      // Current page state
      currentPage,
      
      // UI state for module persistence
      ui: {
        currentModuleView
      },
      
      // Core resources
      vitaeEssence,
      behelitShard,
      berserkBoiCurrency,
      gold,
      echoes,
      
      // Mercenary state
      playerMercenaries,
      selectedMercId,
      
      // Iron Forge state
      knownRecipes,
      craftingQueue,
      
      // Altar of Binding state
      knownSynthesisRecipes,
      synthesisQueue,
      
      // Stash items
      stashItems,
      
      // Core stats for The Bleeding Heart
      sanctumIntegrity,
      maxSanctumIntegrity,
      collectiveConsciousness,
      
      // Upgrade modifiers
      maxIntegrityBonus,
      decayRateModifier,
      
      // Bleeding Heart UI state
      bleedingHeartState,
      
      // Threat management
      currentThreatLevel,
      activeThreat,
      isWarded,
      
      // Temporary buffs
      activeTemporaryBuffs,
      
      // BleakExpanse state
      bleakExpanse: bleakExpanseState,
      
      // Global exploration task state
      activeExplorationTask,
      explorationEventActive,
      currentExplorationEvent,
      
      // Whispers of Fate (Gacha) state
      whispersOfFate: {
        pityCounterTenPull: initialState.whispersOfFate?.pityCounterTenPull || 0,
        lastPulls: [] // We don't need to persist the last pulls
      },
      
      // Market listings for Wyrd Exchange
      marketListings,
      
      // Add player tasks state
      playerTasks,
    };
  };
  
  // Function to save the game state to localStorage
  const saveGameState = () => {
    const gameState = collectGameState();
    console.log('Attempting to save gameState:', gameState);
    if (!gameState) {
      console.error('CRITICAL: gameState is undefined/null before saving!');
      return;
    }
    try {
      const currentModuleID = gameState.ui?.currentModule || gameState.ui?.currentModuleView || 'The Bleeding Heart - Base';
      const stateToSave = { ...gameState, ui: { ...gameState.ui, currentModule: currentModuleID } };
      const stateToSaveJSON = JSON.stringify(stateToSave);
      console.log('Stringified state to save:', stateToSaveJSON.substring(0, 500) + '...');
      localStorage.setItem('brandOfIronSave', stateToSaveJSON);
      console.log('Game state saved successfully.');
    } catch (error) {
      console.error('ERROR saving game state:', error, 'State was:', gameState);
    }
  };
  
  // Helper function to update Bleeding Heart state (fixes unused setBleedingHeartState warning)
  const updateBleedingHeartState = (updates) => {
    setBleedingHeartState(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  // Function to reset the game (clear save and reload)
  const resetGame = () => {
    if (window.confirm('确定要重置游戏吗？所有进度将永久丢失！')) {
      try {
        console.log('正在重置游戏...');
        
        // Directly attempt to fully clear all localStorage entries
        for (let key in localStorage) {
          if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
            localStorage.removeItem(key);
          }
        }
        
        // Additionally ensure specific game data is removed
        localStorage.removeItem('brandOfIronSave');
        
        // Set the reset flag (stored separately)
        sessionStorage.setItem('brand_of_iron_reset', 'true');
        
        // Clear in-memory cache
        initialGameState = null;
        
        // Force a complete hard reload, bypassing cache
        setTimeout(() => {
          window.location.href = window.location.pathname + '?reset=' + Date.now();
        }, 100);
        
        alert('游戏重置中，请稍候...');
        
        console.log('游戏已重置，页面即将刷新');
        return true;
      } catch (error) {
        console.error('重置游戏时出错:', error);
        alert('重置游戏失败: ' + error.message + '\n\n请尝试手动清除浏览器存储并刷新页面。');
        return false;
      }
    }
    return false;
  };
  
  // Check for first launch or reset on component mount
  useEffect(() => {
    const wasReset = sessionStorage.getItem('brand_of_iron_reset') === 'true';
    if (wasReset) {
      // Clear the flag after use
      sessionStorage.removeItem('brand_of_iron_reset');
      setCurrentPage('intro');
    }
  }, []);
  
  // Save game state whenever any state changes
  useEffect(() => {
    // Only save when on game page
    if (currentPage === 'game') {
      saveGameState();
    }
  }, [
    currentPage,
    vitaeEssence,
    behelitShard,
    berserkBoiCurrency,
    gold,
    echoes,
    playerMercenaries,
    selectedMercId,
    knownRecipes,
    craftingQueue,
    knownSynthesisRecipes,
    synthesisQueue,
    stashItems,
    sanctumIntegrity,
    maxSanctumIntegrity,
    collectiveConsciousness,
    maxIntegrityBonus,
    decayRateModifier,
    bleedingHeartState,
    currentThreatLevel,
    activeThreat,
    isWarded,
    bleakExpanseState,
    activeExplorationTask,
    explorationEventActive,
    currentExplorationEvent,
    marketListings,
    playerTasks
  ]);
  
  // Passive HP recovery system for idle mercenaries
  useEffect(() => {
    // Skip if not on game page
    if (currentPage !== 'game') return;
    
    // Set up interval for HP recovery (every 30 seconds)
    const hpRecoveryInterval = setInterval(() => {
      // Only process if there are mercenaries
      if (playerMercenaries && playerMercenaries.length > 0) {
        // Get list of mercenaries currently on expeditions
        const mercsOnExpeditions = activeExplorationTask 
          ? activeExplorationTask.assignedMercenaries || []
          : [];
        
        // Get IDs of mercenaries on expeditions
        const mercIdsOnExpeditions = mercsOnExpeditions.map(merc => merc.instanceId);
        
        // Process HP recovery for idle mercenaries
        const updatedMercenaries = playerMercenaries.map(merc => {
          // Skip mercenaries on expeditions
          if (mercIdsOnExpeditions.includes(merc.instanceId)) {
            return merc;
          }
          
          // Calculate HP recovery (2% of max HP per recovery tick)
          const hpRecoveryAmount = Math.ceil(merc.combatStats.hp * 0.02);
          const newHP = Math.min(merc.combatStats.hp, (merc.currentHP || 0) + hpRecoveryAmount);
          
          // Only update if HP actually changed
          if (newHP !== merc.currentHP) {
            return {
              ...merc,
              currentHP: newHP
            };
          }
          
          return merc;
        });
        
        // Update mercenaries if any were updated
        if (JSON.stringify(updatedMercenaries) !== JSON.stringify(playerMercenaries)) {
          setPlayerMercenaries(updatedMercenaries);
        }
      }
    }, 30000); // 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(hpRecoveryInterval);
  }, [currentPage, playerMercenaries, activeExplorationTask]);
  
  // Example of using updateBleedingHeartState (to fix unused function warning)
  const _toggleUpgradesVisibility = () => {
    updateBleedingHeartState({
      showUpgrades: !bleedingHeartState.showUpgrades
    });
  };
  
  // Handler function to switch from intro page to game page
  const handleStartGame = () => {
    setCurrentPage('game');
    // Remove the reset flag if it exists (from sessionStorage, not localStorage)
    sessionStorage.removeItem('brand_of_iron_reset');
  };
  
  // Decay mechanic for The Bleeding Heart
  useEffect(() => {
    if (currentPage !== 'game') return
    
    const decayInterval = setInterval(() => {
      // Apply decay based on current values and modifiers
      const integrityDecayRate = (0.2 * decayRateModifier) * (isWarded ? 0.5 : 1)
      const consciousnessDecayRate = (0.3 * decayRateModifier) * (isWarded ? 0.7 : 1)
      
      // Update state with decay
      setSanctumIntegrity(prev => Math.max(0, prev - integrityDecayRate))
      setCollectiveConsciousness(prev => Math.max(0, prev - consciousnessDecayRate))
      
      // Process threat generation
      if (!isWarded && !activeThreat) {
        processThreatGeneration()
      }
      
      // Apply active threat effects
      if (activeThreat && !isWarded) {
        applyThreatEffects()
      }
      
    }, 5000) // Decay occurs every 5 seconds
    
    return () => clearInterval(decayInterval)
  }, [
    currentPage, 
    decayRateModifier, 
    isWarded, 
    activeThreat,
    sanctumIntegrity,
    collectiveConsciousness
  ])
  
  // Function to handle threat generation
  const processThreatGeneration = () => {
    // Base chance of threat is 5% per cycle, increased when integrity or consciousness is low
    const integrityFactor = (1 - (sanctumIntegrity / maxSanctumIntegrity)) * 0.1
    const consciousnessFactor = (1 - (collectiveConsciousness / 100)) * 0.1
    const baseThreatChance = 0.05 + integrityFactor + consciousnessFactor
    
    if (Math.random() < baseThreatChance) {
      // Generate a random threat
      const randomThreatIndex = Math.floor(Math.random() * possibleThreats.length)
      setActiveThreat(possibleThreats[randomThreatIndex])
      setCurrentThreatLevel(Math.floor(Math.random() * 3) + 1) // 1-3 threat level
    }
  }
  
  // Function to apply effects of active threats
  const applyThreatEffects = () => {
    // Different effects based on the threat and its level
    const threatLevel = currentThreatLevel
    
    switch (activeThreat) {
      case "The Abyss Gazes Back":
        // Rapidly drains collective consciousness
        setCollectiveConsciousness(prev => Math.max(0, prev - (0.5 * threatLevel)))
        break
      case "Whispering Madness":
        // Reduces integrity
        setSanctumIntegrity(prev => Math.max(0, prev - (0.3 * threatLevel)))
        break
      case "Psychic Drain":
        // Drains both integrity and consciousness
        setSanctumIntegrity(prev => Math.max(0, prev - (0.2 * threatLevel)))
        setCollectiveConsciousness(prev => Math.max(0, prev - (0.2 * threatLevel)))
        break
      case "Looming Dread":
        // Slows resource generation (would affect other modules)
        // Just damage consciousness for now
        setCollectiveConsciousness(prev => Math.max(0, prev - (0.3 * threatLevel)))
        break
      case "Shadow Encroachment":
        // Increases decay rate temporarily
        setSanctumIntegrity(prev => Math.max(0, prev - (0.4 * threatLevel)))
        break
      default:
        break
    }
  }
  
  // Update maxSanctumIntegrity when maxIntegrityBonus changes
  useEffect(() => {
    setMaxSanctumIntegrity(100 + maxIntegrityBonus)
  }, [maxIntegrityBonus])
  
  // Function to unlock a recipe
  const unlockRecipe = (recipeId) => {
    // Check if recipe is already known
    if (knownRecipes.some(recipe => recipe.id === recipeId)) {
      console.log(`Recipe ${recipeId} is already unlocked.`);
      return;
    }
    
    // Find the recipe in the definitions
    const recipeToUnlock = recipeDefinitions.find(r => r.id === recipeId);
    if (!recipeToUnlock) {
      console.error(`Recipe with ID ${recipeId} not found.`);
      return;
    }
    
    // Add the recipe to known recipes
    setKnownRecipes(prev => [...prev, recipeToUnlock]);
    console.log(`Recipe ${recipeId} has been unlocked!`);
  };
  
  // Start crafting a recipe
  const startCrafting = (recipeId) => {
    // Find the recipe
    const recipe = getRecipeById(recipeId);
    if (!recipe) {
      console.error(`Recipe with ID ${recipeId} not found.`);
      return false;
    }
    
    console.log(`Attempting to craft ${recipe.productItemId} using recipe ${recipeId}`);
    console.log('Required materials:', recipe.materials);
    console.log('Current stash items:', stashItems);
    
    // Check if player has required materials
    const hasMaterials = recipe.materials.every(material => {
      const playerMaterial = stashItems.find(item => item.id === material.itemId);
      const hasEnough = playerMaterial && playerMaterial.quantity >= material.quantity;
      
      console.log(`Material check in App: ${material.itemId} (need: ${material.quantity}, have: ${playerMaterial ? playerMaterial.quantity : 0}, enough: ${hasEnough})`);
      return hasEnough;
    });
    
    if (!hasMaterials) {
      console.log('Not enough materials for this recipe.');
      return false;
    }
    
    // Remove materials from player's stash
    removeItemsFromStash(
      recipe.materials.map(material => ({
        id: material.itemId,
        quantity: material.quantity
      }))
    );
    
    // Add task to crafting queue
    const taskId = crypto.randomUUID();
    const endTime = Date.now() + (recipe.craftingTime * 1000); // Convert seconds to milliseconds
    
    setCraftingQueue(prev => [
      ...prev,
      { taskId, recipeId, endTime }
    ]);
    
    console.log(`Started crafting ${recipe.productItemId} with task ID ${taskId}`);
    
    // Get recipe details
    const recipeDetails = getRecipeById(recipeId);
    if (recipeDetails && recipeDetails.result) {
      const resultItem = getItemDefinition(recipeDetails.result.itemId);
      if (resultItem) {
        // Update task progress for crafting
        updateTaskProgress(TASK_TYPES.CRAFT_ITEM_TYPE, { 
          itemType: resultItem.type,
          itemId: resultItem.id
        });
      }
    }
    
    return true;
  };
  
  // Function to update a specific mercenary's data
  const updateMercenary = (mercInstanceId, updates) => {
    setPlayerMercenaries(prevMercs => 
      prevMercs.map(merc => 
        merc.instanceId === mercInstanceId 
          ? { ...merc, ...updates } 
          : merc
      )
    );
  };
  
  // Function to add experience to the selected mercenary
  const addExperienceToSelectedMerc = (amount) => {
    if (!selectedMercId) {
      console.warn("DEV: No mercenary selected to add XP to.");
      return;
    }
    
    // Find the current mercenary
    const mercenary = playerMercenaries.find(merc => merc.instanceId === selectedMercId);
    if (!mercenary) {
      console.warn(`DEV: Mercenary with ID ${selectedMercId} not found.`);
      return;
    }
    
    // Add XP to the mercenary
    updateMercenary(selectedMercId, { 
      xp: mercenary.xp + amount 
    });
    
    console.log(`DEV: Added ${amount} XP to mercenary ${selectedMercId}`);
    
    // Save the current level before updating
    let oldLevel = 0;
    if (selectedMercId) {
      const currentMerc = playerMercenaries.find(m => m.instanceId === selectedMercId);
      if (currentMerc) {
        oldLevel = currentMerc.level || 0;
      }
    }
    
    // Update mercenary (this will happen in the existing function)
    
    // Check if the mercenary leveled up after the update
    if (selectedMercId) {
      const updatedMerc = playerMercenaries.find(m => m.instanceId === selectedMercId);
      if (updatedMerc && updatedMerc.level > oldLevel) {
        // Mercenary leveled up, update task progress
        updateTaskProgress(TASK_TYPES.LEVEL_UP_MERC, { 
          level: updatedMerc.level,
          mercId: selectedMercId
        });
      }
    }
  };
  
  // Function to update resources (for both regular game and developer tools)
  const updateResource = (resourceId, amount) => {
    // Normalize resource ID
    let normalizedId = resourceId;
    
    // Convert camelCase to snake_case for consistency
    if (resourceId === 'vitaeEssence') normalizedId = 'vitae_essence';
    else if (resourceId === 'behelitShard') normalizedId = 'behelit_shard';
    else if (resourceId === 'berserkBoiCurrency') normalizedId = 'berserkBoiCurrency'; // Keep as is
    
    console.log(`Normalized resource ID: ${resourceId} → ${normalizedId}`);
    
    switch (normalizedId) {
      case 'gold':
        setGold(prev => Math.max(0, prev + amount));
        break;
      case 'vitae_essence':
        setVitaeEssence(prev => Math.max(0, prev + amount));
        break;
      case 'behelit_shard':
        setBehelitShard(prev => Math.max(0, prev + amount));
        break;
      case 'echoes':
        setEchoes(prev => Math.max(0, prev + amount));
        break;
      case 'berserkBoiCurrency':
        setBerserkBoiCurrency(prev => Math.max(0, prev + amount));
        break;
      default:
        console.warn(`Unknown resource: ${resourceId} (normalized: ${normalizedId})`);
    }
    console.log(`Updated ${normalizedId} by ${amount}`);
    
    // Only track positive resource changes for tasks
    if (amount > 0) {
      updateTaskProgress(TASK_TYPES.GATHER_RESOURCE, { 
        resourceId, 
        amount 
      });
    }
  };
  
  // Function to remove items from the stash
  const removeItemsFromStash = (itemsToRemove) => {
    setStashItems(prevItems => {
      // Create a copy of the current inventory
      const updatedItems = [...prevItems];
      
      // Process each item to remove
      itemsToRemove.forEach(itemToRemove => {
        // If we're removing by instanceId (for equipment/unique items)
        if (itemToRemove.instanceId) {
          // Find the item in the stash by instanceId
          const existingItemIndex = updatedItems.findIndex(item => 
            item.instanceId === itemToRemove.instanceId
          );
          
          if (existingItemIndex !== -1) {
            // Remove the specific instance
            updatedItems.splice(existingItemIndex, 1);
          }
        } else {
          // Standard removal by id for stackable items
        // Find the item in the stash
        const existingItemIndex = updatedItems.findIndex(item => item.id === itemToRemove.id);
        
        if (existingItemIndex !== -1) {
          const currentItem = updatedItems[existingItemIndex];
          
          // Calculate new quantity
          const newQuantity = currentItem.quantity - itemToRemove.quantity;
          
          if (newQuantity <= 0) {
            // Remove the item entirely if quantity is zero or negative
            updatedItems.splice(existingItemIndex, 1);
          } else {
            // Update quantity if still positive
            updatedItems[existingItemIndex] = {
              ...currentItem,
              quantity: newQuantity
            };
            }
          }
        }
      });
      
      return updatedItems;
    });
  };
  
  // Function to add items to the stash
  const addItemsToStash = (itemsToAdd) => {
    console.log('Adding items to stash:', itemsToAdd);
    
    setStashItems(prevItems => {
      // Create a copy of the current inventory
      const updatedItems = [...prevItems];
      
      // Process each item to add
      itemsToAdd.forEach(newItem => {
        // For equipment with instanceId, always add as a new item
        if (newItem.instanceId) {
          // Check if this specific instance already exists (should not happen, but just in case)
          const instanceExists = updatedItems.some(item => 
            item.instanceId && item.instanceId === newItem.instanceId
          );
          
          if (!instanceExists) {
            // Add as a new item
            updatedItems.push(newItem);
            console.log(`Added equipment item: ${newItem.name} (${newItem.instanceId})`);
          }
        } else {
          // For stackable items, add to existing quantity
        const existingItemIndex = updatedItems.findIndex(item => item.id === newItem.id);
        
        if (existingItemIndex !== -1) {
          // If it exists, update the quantity
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
          };
          console.log(`Updated item ${newItem.id}, new quantity: ${updatedItems[existingItemIndex].quantity}`);
        } else {
          // If it doesn't exist, add it as a new item
          updatedItems.push(newItem);
          console.log(`Added new item ${newItem.id} with quantity ${newItem.quantity}`);
          }
        }
      });
      
      console.log('Updated stash:', updatedItems);
      
      // Track stash items for tasks
      itemsToAdd.forEach(item => {
        if (item.quantity && item.quantity > 0) {
          updateTaskProgress(TASK_TYPES.GATHER_RESOURCE, { 
            itemId: item.id, 
            amount: item.quantity 
          });
        }
      });
      
      return updatedItems;
    });
  };
  
  // Function to add resources (for developer tools)
  const addResource = (resourceId, amount) => {
    switch (resourceId) {
      case 'gold':
        setGold(prev => prev + amount);
        break;
      case 'vitae_essence':
        setVitaeEssence(prev => prev + amount);
        break;
      case 'behelit_shard':
        setBehelitShard(prev => prev + amount);
        break;
      case 'echoes':
        setEchoes(prev => prev + amount);
        break;
      case 'berserkBoiCurrency':
        setBerserkBoiCurrency(prev => prev + amount);
        break;
      default:
        console.warn(`Unknown resource: ${resourceId}`);
    }
    console.log(`DEV: Added ${amount} ${resourceId}`);
  };
  
  // Helper functions for adding crafting materials (for developer tools)
  const addIronOre = (amount) => {
    addItemsToStash([{ 
      id: 'iron_ore', 
      name: 'Iron Ore', 
      icon: '⛏️', 
      type: 'Material', 
      quantity: amount 
    }]);
    console.log(`DEV: Added ${amount} Iron Ore`);
  };
  
  const addSteelIngot = (amount) => {
    addItemsToStash([{ 
      id: 'steel_ingot', 
      name: 'Steel Ingot', 
      icon: '🧱', 
      type: 'Material', 
      quantity: amount 
    }]);
    console.log(`DEV: Added ${amount} Steel Ingot`);
  };
  
  const addLeather = (amount) => {
    addItemsToStash([{ 
      id: 'leather', 
      name: 'Leather', 
      icon: '🧶', 
      type: 'Material', 
      quantity: amount 
    }]);
    console.log(`DEV: Added ${amount} Leather`);
  };
  
  const addWood = (amount) => {
    addItemsToStash([{ 
      id: 'wood', 
      name: 'Wood', 
      icon: '🪵', 
      type: 'Material', 
      quantity: amount 
    }]);
    console.log(`DEV: Added ${amount} Wood`);
  };
  
  // Function to finish exploration immediately (for developer tools)
  const finishExplorationNow = () => {
    if (bleakExpanseRef.current) {
      bleakExpanseRef.current.forceComplete();
    } else {
      console.log('DEV: BleakExpanse component not accessible');
    }
  };
  
  // Function to hire a new mercenary
  const hireMercenary = (definitionId) => {
    const newMerc = createMercenaryInstance(definitionId);
    if (newMerc) {
      setPlayerMercenaries(prevMercs => [...prevMercs, newMerc]);
      return true;
    }
    return false;
  };
  
  // Function to dismiss a mercenary
  const dismissMercenary = (instanceId) => {
    setPlayerMercenaries(prevMercs => 
      prevMercs.filter(merc => merc.instanceId !== instanceId)
    );
  };
  
  // Function to start a new exploration
  const startNewExploration = (areaId, squadMercIds) => {
    if (!areaId || !squadMercIds || squadMercIds.length === 0) {
      console.error('Cannot start exploration: missing area or squad');
      return false;
    }
    
    // Only one exploration can be active at a time
    if (activeExplorationTask) {
      console.warn('An expedition is already in progress');
      return false;
    }
    
    // Get area data
    const area = (explorationAreas || []).find(a => a.id === areaId);
    if (!area) {
      console.error(`Area ${areaId} not found`);
      return false;
    }
    
    // Calculate duration in milliseconds
    const durationMs = (lootTables[areaId]?.duration || 300) * 1000;
    
    // Create the exploration task
    const newTask = {
      id: crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`,
      areaId,
      areaName: area.name,
      squadMercIds,
      startTime: Date.now(),
      endTime: Date.now() + durationMs,
      encounteredEventsLog: [],
    };
    
    // Set the active exploration task
    setActiveExplorationTask(newTask);
    
    // Optional: Add a log entry
    const squadMembers = playerMercenaries.filter(m => squadMercIds.includes(m.instanceId));
    addLogEntry(`Expedition with ${squadMembers.length} mercenaries dispatched to ${area.name}.`);
    
    // Update bleakExpanseState to reflect the ongoing exploration
    setBleakExpanseState(prev => ({
      ...prev,
      selectedArea: areaId,
      isExploring: true,
      selectedSquad: squadMembers,
      expeditionEvents: []
    }));
    
    console.log(`Started new exploration to ${area.name}, ending at ${new Date(newTask.endTime).toLocaleTimeString()}`);
    return true;
  };
  
  // Function to handle exploration completion
  const completeExploration = () => {
    if (!activeExplorationTask) {
      console.warn('No active exploration to complete');
      return;
    }
    
    // Clear any active timers
    if (explorationTimerRef.current) {
      clearInterval(explorationTimerRef.current);
      explorationTimerRef.current = null;
    }
    
    const { areaId, areaName, squadMercIds } = activeExplorationTask;
    
    // Get the squad members
    const squadMembers = playerMercenaries.filter(m => squadMercIds.includes(m.instanceId));
    
    // Get Bastion modifiers
    const explorationModifiers = getExplorationModifiers(sanctumIntegrity, collectiveConsciousness);
    
    // Generate a random enemy for the area with appropriate level
    const enemyLevel = Math.max(1, Math.floor(squadMembers.reduce((avg, merc) => avg + merc.level, 0) / squadMembers.length));
    const enemy = createEnemyInstance(areaId, enemyLevel);
    
    if (!enemy) {
      console.error(`Failed to create enemy for area: ${areaId}`);
      return;
    }
    
    // ----- COMBAT SIMULATION -----
    // Initialize combat state
    const MAX_COMBAT_ROUNDS = 10;
    const BASE_HIT_CHANCE = 0.7;
    let combatLog = [];
    let currentRound = 1;
    let squadHP = {};
    let victorious = false;
    
    // Calculate total combat stats for each mercenary
    const mercenariesWithTotalStats = squadMembers.map(merc => {
      const totalCombatStats = calculateTotalCombatStats(merc);
      
      // Track initial HP for each mercenary
      squadHP[merc.instanceId] = totalCombatStats.hp;
      
      return {
        ...merc,
        totalCombatStats,
        currentHP: totalCombatStats.hp,
        activeBuffs: []
      };
    });
    
    // Apply on_combat_start skill effects
    let currentSquad = mercenariesWithTotalStats.map(merc => {
      let updatedMerc = { ...merc };
      
      // Check each skill for on_combat_start trigger
      merc.skills.forEach(skill => {
        if (shouldSkillTrigger(skill, 'on_combat_start')) {
          updatedMerc = applySkillEffect(updatedMerc, skill);
          combatLog.push(`${merc.name} activates ${skill}!`);
        }
      });
      
      return updatedMerc;
    });
    
    // Also apply on_combat_start skills for the enemy
    let currentEnemy = { ...enemy };
    enemy.skills.forEach(skill => {
      if (shouldSkillTrigger(skill, 'on_combat_start')) {
        currentEnemy = applySkillEffect(currentEnemy, skill);
        combatLog.push(`${enemy.name} activates ${skill}!`);
      }
    });
    
    // Combat round loop
    while (currentRound <= MAX_COMBAT_ROUNDS && currentEnemy.currentHP > 0 && Object.values(squadHP).some(hp => hp > 0)) {
      combatLog.push(`Round ${currentRound} begins!`);
      
      // Squad turn - each mercenary attacks
      for (const merc of currentSquad) {
        // Skip incapacitated mercenaries
        if (squadHP[merc.instanceId] <= 0) continue;
        
        // Check for on_low_hp skill triggers
        merc.skills.forEach(skill => {
          if (shouldSkillTrigger(skill, 'on_low_hp', { 
            currentHP: squadHP[merc.instanceId], 
            maxHP: merc.totalCombatStats.hp 
          })) {
            const updatedMerc = applySkillEffect(merc, skill);
            currentSquad = currentSquad.map(m => m.instanceId === merc.instanceId ? updatedMerc : m);
            combatLog.push(`${merc.name} activates ${skill} due to low health!`);
          }
        });
        
        // Calculate hit chance
        const hitChance = (merc.totalCombatStats.accuracy / currentEnemy.combatStats.evasion) * BASE_HIT_CHANCE;
        const roll = Math.random();
        
        if (roll <= hitChance) {
          // Hit! Calculate damage
          let damage = Math.max(1, merc.totalCombatStats.physicalAttack - currentEnemy.combatStats.physicalDefense);
          
          // Check for critical hit
          const critRoll = Math.random() * 100;
          let isCrit = false;
          if (critRoll <= merc.totalCombatStats.critChance) {
            damage = Math.floor(damage * 1.5);
            isCrit = true;
          }
          
          // Apply damage reduction if enemy has it
          if (currentEnemy.damageReduction) {
            damage = Math.floor(damage * (1 - currentEnemy.damageReduction));
          }
          
          // Apply damage to enemy
          currentEnemy.currentHP = Math.max(0, currentEnemy.currentHP - damage);
          
          // Log the attack
          combatLog.push(`${merc.name} ${isCrit ? 'critically ' : ''}hits ${currentEnemy.name} for ${damage} damage! (${currentEnemy.currentHP}/${currentEnemy.combatStats.hp} HP)`);
          
          // Check for on_attack skill triggers
          merc.skills.forEach(skill => {
            if (shouldSkillTrigger(skill, 'on_attack')) {
              const updatedMerc = applySkillEffect(merc, skill);
              currentSquad = currentSquad.map(m => m.instanceId === merc.instanceId ? updatedMerc : m);
              combatLog.push(`${merc.name} activates ${skill} after attacking!`);
            }
          });
          
          // Check if enemy defeated
          if (currentEnemy.currentHP <= 0) {
            combatLog.push(`${currentEnemy.name} is defeated!`);
            victorious = true;
            break;
          }
        } else {
          // Miss
          combatLog.push(`${merc.name} misses ${currentEnemy.name}!`);
        }
      }
      
      // Check if enemy defeated after squad turn
      if (currentEnemy.currentHP <= 0) {
        break;
      }
      
      // Enemy turn
      // Choose a random target from the surviving squad members
      const aliveSquadIds = Object.entries(squadHP)
        .filter(([, hp]) => hp > 0)
        .map(([id]) => id);
      
      if (aliveSquadIds.length === 0) {
        // Squad wiped out
        combatLog.push(`The entire squad is incapacitated!`);
        break;
      }
      
      const targetMercId = aliveSquadIds[Math.floor(Math.random() * aliveSquadIds.length)];
      const targetMerc = currentSquad.find(m => m.instanceId === targetMercId);
      
      // Calculate hit chance
      const hitChance = (currentEnemy.combatStats.accuracy / targetMerc.totalCombatStats.evasion) * BASE_HIT_CHANCE;
      const roll = Math.random();
      
      if (roll <= hitChance) {
        // Hit! Calculate damage
        let damage = Math.max(1, currentEnemy.combatStats.physicalAttack - targetMerc.totalCombatStats.physicalDefense);
        
        // Check for critical hit
        const critRoll = Math.random() * 100;
        let isCrit = false;
        if (critRoll <= currentEnemy.combatStats.critChance) {
          damage = Math.floor(damage * 1.5);
          isCrit = true;
        }
        
        // Apply damage to target mercenary
        squadHP[targetMercId] = Math.max(0, squadHP[targetMercId] - damage);
        
        // Log the attack
        combatLog.push(`${currentEnemy.name} ${isCrit ? 'critically ' : ''}hits ${targetMerc.name} for ${damage} damage! (${squadHP[targetMercId]}/${targetMerc.totalCombatStats.hp} HP)`);
        
        // Check for on_hit skill triggers for the target
        targetMerc.skills.forEach(skill => {
          if (shouldSkillTrigger(skill, 'on_hit')) {
            const updatedMerc = applySkillEffect(targetMerc, skill);
            currentSquad = currentSquad.map(m => m.instanceId === targetMerc.instanceId ? updatedMerc : m);
            combatLog.push(`${targetMerc.name} activates ${skill} after being hit!`);
          }
        });
        
        // Check if target is incapacitated
        if (squadHP[targetMercId] <= 0) {
          combatLog.push(`${targetMerc.name} is incapacitated!`);
        }
      } else {
        // Miss
        combatLog.push(`${currentEnemy.name} misses ${targetMerc.name}!`);
      }
      
      // Process buff durations at the end of the round
      currentSquad = currentSquad.map(merc => processBuffDurations(merc));
      currentEnemy = processBuffDurations(currentEnemy);
      
      // End of round
      currentRound++;
    }
    
    // Determine combat outcome
    let combatOutcome, xpMultiplier, sanCostMultiplier;
    
    if (victorious) {
      // Clear victory
      combatOutcome = "Victory";
      xpMultiplier = 1.2;
      sanCostMultiplier = 0.8;
    } else if (currentRound > MAX_COMBAT_ROUNDS) {
      // Stalemate - ran out of rounds
      combatOutcome = "Struggle";
      xpMultiplier = 0.75;
      sanCostMultiplier = 1.2;
    } else {
      // Defeat - squad wiped out
      combatOutcome = "Defeat";
      xpMultiplier = 0.3;
      sanCostMultiplier = 1.5;
    }
    
    // Create combat result for display
    const lastCombatResult = {
      outcome: combatOutcome,
      enemy: currentEnemy,
      combatLog,
      squadCurrentHP: squadHP,
      roundsCompleted: currentRound - 1,
      victorious
    };
    
    // Create expedition events
    const expeditionEvents = [
      ...activeExplorationTask.encounteredEventsLog,
      `Encountered ${enemy.name}. (${combatOutcome})`,
      ...combatLog,
      "Exploration completed."
    ];
    
    // Apply SAN costs to each mercenary
    const baseSanCost = areaId === 'whispering-woods' ? 5 : 10;
    const finalSanCost = Math.round(baseSanCost * sanCostMultiplier * explorationModifiers.sanCostMod);
    
    // Apply SAN cost to each mercenary in the squad
    squadMembers.forEach(merc => {
      updateMercenary(
        merc.instanceId, 
        { currentSAN: Math.max(0, merc.currentSAN - finalSanCost) }
      );
    });
    
    // Persist HP changes from combat
    Object.entries(squadHP).forEach(([mercId, currentHP]) => {
      updateMercenary(
        mercId,
        { currentHP }
      );
    });
    
    // Award XP to each mercenary
    const baseXpPerMerc = areaId === 'whispering-woods' ? 15 : 30;
    const finalXpPerMerc = Math.round(baseXpPerMerc * xpMultiplier * (1 + (enemyLevel - 1) * 0.1));
    
    // Apply XP to each mercenary in the squad
    squadMembers.forEach(merc => {
      updateMercenary(
        merc.instanceId,
        { xp: merc.xp + finalXpPerMerc }
      );
    });
    
    // Generate rewards based on the selected area's loot table and combat outcome
    // Modify rewards based on combat outcome
    const resourceMultiplier = explorationModifiers.resourceMod * 
      (combatOutcome === "Victory" ? 1.2 : combatOutcome === "Struggle" ? 0.8 : 0.4);
    
    // Generate rewards using the existing function
    const rewards = generateExpeditionRewards(areaId, resourceMultiplier);
    
    // Distribute rewards
    distributeExpeditionRewards(rewards);
    
    // Update BleakExpanse state with the results
    setBleakExpanseState(prev => ({
      ...prev,
      isExploring: false,
      lastRewards: rewards,
      lastCombatResult,
      expeditionEvents,
      secondsRemaining: 0
    }));
    
    // Log the expedition results
    addLogEntry(`Expedition to ${areaName} returned with combat outcome: ${combatOutcome} against ${enemy.name}. Mercenaries lost ${finalSanCost} SAN and gained ${finalXpPerMerc} XP each.`);
    
    // Clear the active exploration task
    setActiveExplorationTask(null);
    
    console.log(`Completed exploration to ${areaName} with outcome: ${combatOutcome}`);
    
    // Update task progress for exploration
    if (bleakExpanseState.selectedArea) {
      updateTaskProgress(TASK_TYPES.EXPLORE_AREA, { areaId: bleakExpanseState.selectedArea });
    }
  };
  
  // Function to generate expedition rewards (copied from BleakExpanse)
  const generateExpeditionRewards = (areaId, resourceMultiplier = 1) => {
    const areaLootTable = lootTables[areaId];
    if (!areaLootTable) return [];
    
    const generatedRewards = [];
    
    // Process guaranteed rewards
    areaLootTable.guaranteed.forEach(item => {
      const quantity = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
      generatedRewards.push({
        id: item.id,
        quantity: quantity
      });
    });
    
    // Process common rewards
    areaLootTable.common.forEach(item => {
      const roll = Math.random();
      if (roll <= item.chance) {
        const quantity = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
        generatedRewards.push({
          id: item.id,
          name: item.name,
          icon: item.icon,
          type: item.type,
          color: item.color,
          quantity: quantity
        });
      }
    });
    
    // Process uncommon rewards
    areaLootTable.uncommon.forEach(item => {
      const roll = Math.random();
      if (roll <= item.chance) {
        const quantity = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
        generatedRewards.push({
          id: item.id,
          name: item.name,
          icon: item.icon,
          type: item.type,
          color: item.color,
          quantity: quantity
        });
      }
    });
    
    // Process rare rewards
    areaLootTable.rare.forEach(item => {
      const roll = Math.random();
      if (roll <= item.chance) {
        const quantity = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
        generatedRewards.push({
          id: item.id,
          quantity: quantity
        });
      }
    });
    
    // Process item drops
    if (areaLootTable.itemDrops) {
      areaLootTable.itemDrops.forEach(item => {
        const roll = Math.random();
        if (roll <= item.chance) {
          // For equipment items (weapons, armor, accessories)
          if (item.type === 'Weapon' || item.type === 'Armor' || item.type === 'Accessory') {
            // Create a properly structured equipment item
            const equipmentItem = createItemInstance2(item.itemId || item.id);
            generatedRewards.push(equipmentItem);
          } else {
            // For consumables, materials, etc.
            generatedRewards.push({
              id: item.itemId || item.id,
              name: item.name || 'Unknown Item',
              icon: item.icon || '❓',
              type: item.type || 'Unknown',
              color: item.color || '#888888',
              quantity: 1 // Usually just 1 for found items
            });
          }
        }
      });
    }
    
    // Apply resource multiplier to rewards
    generatedRewards.forEach(reward => {
      if (reward.quantity) {
        reward.quantity = Math.round(reward.quantity * resourceMultiplier);
      }
    });
    
    return generatedRewards;
  };
  
  // Function to distribute expedition rewards (copied from BleakExpanse)
  const distributeExpeditionRewards = (rewards) => {
    // Separate core resources from stash items
    const coreResourceUpdates = [];
    const stashUpdates = [];
    
    rewards.forEach(reward => {
      // Core resources (gold, vitae_essence, behelit_shard, echoes)
      if (['gold', 'vitae_essence', 'behelit_shard', 'echoes'].includes(reward.id)) {
        coreResourceUpdates.push(reward);
      } else {
        // Stash items (everything else)
        stashUpdates.push(reward);
      }
    });
    
    // Update core resources
    coreResourceUpdates.forEach(resource => {
      updateResource(resource.id, resource.quantity);
    });
    
    // Update stash if there are items to add
    if (stashUpdates.length > 0) {
      addItemsToStash(stashUpdates);
    }
  };
  
  // Function to add a log entry
  const addLogEntry = (text) => {
    const entryPrefix = `[${new Date().toLocaleTimeString()}] `;
    console.log(`${entryPrefix}${text}`);
    // In a full implementation, this would add to a game log UI component
  };
  
  // Global exploration timer effect
  useEffect(() => {
    // If there's an active exploration and no timer running, start one
    if (activeExplorationTask && !explorationTimerRef.current && !explorationEventActive) {
      console.log('Starting global exploration timer');
      
      // Update seconds remaining in BleakExpanse state
      const updateRemainingTime = () => {
        if (!activeExplorationTask) return;
        
        const now = Date.now();
        const remaining = Math.max(0, activeExplorationTask.endTime - now);
        const secondsRemaining = Math.ceil(remaining / 1000);
        
        // Update BleakExpanse state with new remaining time
        setBleakExpanseState(prev => ({
          ...prev,
          secondsRemaining
        }));
        
        // If exploration is complete, call the complete function
        if (remaining <= 0) {
          if (explorationTimerRef.current) {
            clearInterval(explorationTimerRef.current);
            explorationTimerRef.current = null;
          }
          completeExploration();
        }
        
        // TODO: Add logic to randomly trigger events here
      };
      
      // Update immediately, then set interval
      updateRemainingTime();
      
      // Set up interval to update remaining time
      explorationTimerRef.current = setInterval(updateRemainingTime, 1000);
      
      // Set up potential event checks
      if (activeExplorationTask) {
        const durationMs = activeExplorationTask.endTime - activeExplorationTask.startTime;
        
        // First event opportunity at 10-15% of the way through
        const firstEventTime = Math.floor(durationMs * (0.1 + Math.random() * 0.05));
        setTimeout(() => {
          if (activeExplorationTask && !explorationEventActive) {
            // 20% chance for first event
            if (Math.random() < 0.20) {
              console.log("First event opportunity triggered");
              // TODO: Implement event triggering
              // triggerExplorationEvent();
            }
          }
        }, firstEventTime);
        
        // Add a second event opportunity around 40-50% through
        if (durationMs > 60000) { // Only for expeditions longer than 1 minute
          const secondEventTime = Math.floor(durationMs * (0.4 + Math.random() * 0.1));
          setTimeout(() => {
            if (activeExplorationTask && !explorationEventActive) {
              // 25% chance for second event
              if (Math.random() < 0.25) {
                console.log("Second event opportunity triggered");
                // TODO: Implement event triggering
                // triggerExplorationEvent();
              }
            }
          }, secondEventTime);
        }
      }
    }
    
    // Clear timer on cleanup
    return () => {
      if (explorationTimerRef.current) {
        clearInterval(explorationTimerRef.current);
        explorationTimerRef.current = null;
      }
    };
  }, [activeExplorationTask, explorationEventActive]);
  
  // Check for ongoing exploration on load
  useEffect(() => {
    // If there's a saved exploration task, check if it should be completed
    if (activeExplorationTask) {
      const now = Date.now();
      
      // If the end time has passed, complete it immediately
      if (activeExplorationTask.endTime <= now) {
        console.log('Completing saved exploration task that ended while offline');
        completeExploration();
      }
      // Otherwise, the timer effect will handle the rest
    }
  }, []);
  
  // Global threat assessment timer effect
  useEffect(() => {
    if (currentPage !== 'game') {
      if (threatTimerRef.current) {
        clearInterval(threatTimerRef.current);
        threatTimerRef.current = null;
      }
      return;
    }
    if (threatTimerRef.current) {
      clearInterval(threatTimerRef.current);
      threatTimerRef.current = null;
    }
    // Always use endTime for countdown
    threatTimerRef.current = setInterval(() => {
      const now = Date.now();
      let secondsRemaining = Math.max(0, Math.floor((bleedingHeartState.threatAssessmentEndTime - now) / 1000));
      // If expired, reset endTime
      if (secondsRemaining <= 0) {
        setBleedingHeartState(prev => ({
          ...prev,
          threatAssessmentEndTime: Date.now() + 272000
        }));
        secondsRemaining = 272;
      }
      // Update state for UI
      setBleedingHeartState(prev => ({
        ...prev,
        threatAssessmentSecondsRemaining: secondsRemaining
      }));
    }, 200);
    return () => {
      if (threatTimerRef.current) {
        clearInterval(threatTimerRef.current);
        threatTimerRef.current = null;
      }
    };
  }, [currentPage, bleedingHeartState.threatAssessmentEndTime]);
  
  // Function to add a temporary buff with duration
  const addTemporaryBuff = (buffData) => {
    const newBuff = {
      ...buffData,
      id: buffData.id || `buff_${Date.now()}`,
      startTime: Date.now(),
      endTime: Date.now() + (buffData.duration * 1000) // Convert duration in seconds to milliseconds
    };
    
    // Log the buff being added for debugging
    console.log(`Adding temporary buff: ${JSON.stringify(newBuff)}`);
    
    setActiveTemporaryBuffs(prev => {
      console.log(`Current buffs before adding: ${prev.length}`);
      return [...prev, newBuff];
    });
    console.log(`Added temporary buff: ${newBuff.name}, expires in ${buffData.duration} seconds`);
    
    // Start the buff timer if it's not already running
    if (!buffTimerRef.current) {
      startBuffTimer();
    }
    
    return newBuff.id; // Return the buff ID for reference
  };
  
  // Function to remove a temporary buff by ID
  const removeTemporaryBuff = (buffId) => {
    setActiveTemporaryBuffs(prev => {
      const updatedBuffs = prev.filter(buff => buff.id !== buffId);
      console.log(`Removed temporary buff: ${buffId}`);
      
      // If no more buffs, clear the timer
      if (updatedBuffs.length === 0 && buffTimerRef.current) {
        clearInterval(buffTimerRef.current);
        buffTimerRef.current = null;
      }
      
      return updatedBuffs;
    });
  };
  
  // Start the buff timer to check for expired buffs
  const startBuffTimer = () => {
    if (buffTimerRef.current) {
      clearInterval(buffTimerRef.current);
      buffTimerRef.current = null;
    }
    
    console.log('Starting buff timer to check for expired buffs');
    
    buffTimerRef.current = setInterval(() => {
      const now = Date.now();
      
      // Always update the buffs to ensure proper time display
      setActiveTemporaryBuffs(prev => {
        // First check if we need to force an update for existing buffs
        // This ensures that even if no buffs expire, we still update their timers
        const forceUpdated = prev.length > 0;
        if (forceUpdated) {
          console.log(`Forcing timer update for ${prev.length} active buffs`);
        }
        
        // Check if any buffs have expired
        const updatedBuffs = prev.filter(buff => {
          const isActive = buff.endTime > now;
          
          if (!isActive) {
            console.log(`Buff expired: ${buff.name} (${buff.id})`);
            
            // If this is the warding buff, update isWarded state
            if (buff.id === 'warding_buff') {
              setIsWarded(false);
              addLogEntry("The protective barrier has faded away...");
            }
          }
          
          return isActive;
        });
        
        // If all buffs are gone, clear the interval
        if (updatedBuffs.length === 0 && buffTimerRef.current) {
          clearInterval(buffTimerRef.current);
          buffTimerRef.current = null;
          console.log('Cleared buff timer as no active buffs remain');
        }
        
        // Always return updated buffs to ensure UI updates with current times
        // Create new array to force React to trigger re-renders
        return [...updatedBuffs];
      });
    }, 200); // Check more frequently for smoother countdown
  };
  
  // Start buff timer whenever activeTemporaryBuffs changes or on mount
  useEffect(() => {
    // Only start timer if there are active buffs
    if (activeTemporaryBuffs.length > 0) {
      // Start buff timer if not already running
      if (!buffTimerRef.current) {
        console.log(`Starting buff timer for ${activeTemporaryBuffs.length} active buffs`);
        startBuffTimer();
      }
    }
  }, [activeTemporaryBuffs]);
  
  // Update crafting and synthesis timers 
  useEffect(() => {
    // Process crafting and synthesis queues every second
    const intervalId = setInterval(() => {
      // Process crafting queue from Iron Forge
      setCraftingQueue(prevQueue => {
        const now = Date.now();
        const completedTasks = [];
        const updatedQueue = prevQueue.filter(task => {
          if (task.endTime <= now) {
            // Task is complete, remove from queue
            completedTasks.push(task);
            return false;
          }
          // Task still in progress, keep in queue
          return true;
        });
        
        // Process completed crafting tasks
        completedTasks.forEach(task => {
          const recipe = getRecipeById(task.recipeId);
          if (recipe) {
            console.log(`Crafting completed: ${recipe.productItemId}`);
            
            // Determine quality
            let quality = 'Common';
            if (recipe.qualityProbabilities) {
              const random = Math.random();
              let cumulativeProbability = 0;
              
              for (const [qualityLevel, probability] of Object.entries(recipe.qualityProbabilities)) {
                cumulativeProbability += probability;
                if (random <= cumulativeProbability) {
                  quality = qualityLevel.charAt(0).toUpperCase() + qualityLevel.slice(1);
                  break;
                }
              }
            }
            
            // Create and add the new item
            const newItem = createItemInstance2(recipe.productItemId, quality);
            addItemsToStash([newItem]);
            
            // Add a log entry
            addLogEntry(`Forging complete: ${newItem.name} (${quality})`);
          }
        });
        
        return updatedQueue;
      });
      
      // Process synthesis queue from Altar of Binding
      setSynthesisQueue(prevQueue => {
        const now = Date.now();
        const completedTasks = [];
        const updatedQueue = prevQueue.filter(task => {
          if (task.endTime <= now) {
            // Task is complete, remove from queue
            completedTasks.push(task);
            return false;
          }
          // Task still in progress, keep in queue
          return true;
        });
        
        // Process completed synthesis tasks
        completedTasks.forEach(task => {
          const recipe = getSynthesisRecipeById(task.recipeId);
          if (recipe) {
            console.log(`Synthesis completed: ${recipe.id}`);
            
            // Handle different product types
            if (recipe.product.itemId) {
              // Product is an item
              const newItem = {
                id: recipe.product.itemId,
                quantity: recipe.product.quantity
              };
              addItemsToStash([newItem]);
              addLogEntry(`Transmutation complete: ${recipe.product.quantity}x ${recipe.product.itemId}`);
            } else if (recipe.product.resourceId) {
              // Product is a resource
              updateResource(recipe.product.resourceId, recipe.product.quantity);
              addLogEntry(`Transmutation complete: ${recipe.product.quantity} ${recipe.product.resourceId}`);
            }
          }
        });
        
        return updatedQueue;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Start a synthesis recipe in the Altar of Binding
  const startSynthesis = (recipeId) => {
    // Find the recipe
    const recipe = getSynthesisRecipeById(recipeId);
    if (!recipe) {
      console.error(`Synthesis recipe with ID ${recipeId} not found.`);
      return false;
    }
    
    console.log(`Attempting to synthesize using recipe ${recipeId}`);
    
    // Check for materials and resources
    const hasMaterials = recipe.materials.every(material => {
      if (material.resourceId) {
        // Check resources
        let resourceAmount = 0;
        switch (material.resourceId) {
          case 'gold':
            resourceAmount = gold;
            break;
          case 'vitae_essence':
            resourceAmount = vitaeEssence;
            break;
          case 'behelit_shard':
            resourceAmount = behelitShard;
            break;
          case 'echoes':
            resourceAmount = echoes;
            break;
          case 'berserkBoiCurrency':
            resourceAmount = berserkBoiCurrency;
            break;
          default:
            resourceAmount = 0;
        }
        return resourceAmount >= material.quantity;
      } else {
        // Check stash items
        const playerMaterial = stashItems.find(item => item.id === material.itemId);
        const hasEnough = playerMaterial && playerMaterial.quantity >= material.quantity;
        return hasEnough;
      }
    });
    
    if (!hasMaterials) {
      console.log('Not enough materials/resources for this synthesis.');
      return false;
    }
    
    // Consume the materials
    recipe.materials.forEach(material => {
      if (material.resourceId) {
        // Deduct resources
        updateResource(material.resourceId, -material.quantity);
      } else {
        // Remove items from stash
        removeItemsFromStash([
          { id: material.itemId, quantity: material.quantity }
        ]);
      }
    });
    
    // Add task to synthesis queue
    const taskId = crypto.randomUUID();
    const endTime = Date.now() + (recipe.processingTime * 1000); // Convert seconds to milliseconds
    
    setSynthesisQueue(prev => [
      ...prev,
      { taskId, recipeId, endTime }
    ]);
    
    console.log(`Started synthesis with ID ${taskId}`);
    return true;
  };
  
  // Unlock a synthesis recipe
  const unlockSynthesisRecipe = (recipeId) => {
    // Check if recipe already unlocked
    if (knownSynthesisRecipes.some(r => r.id === recipeId)) {
      console.log(`Synthesis recipe ${recipeId} is already unlocked.`);
      return;
    }
    
    // Find recipe in the definitions
    const recipeToUnlock = synthesisRecipeDefinitions.find(r => r.id === recipeId);
    if (!recipeToUnlock) {
      console.error(`Synthesis recipe ${recipeId} not found in definitions.`);
      return;
    }
    
    // Add it to known recipes
    setKnownSynthesisRecipes(prev => [...prev, recipeToUnlock]);
    console.log(`Synthesis recipe ${recipeId} has been unlocked!`);
  };
  
  // Function to perform a prayer (gacha) pull
  const performPrayer = async (poolId, numPulls) => {
    console.log(`Performing prayer: ${poolId}, pulls: ${numPulls}`);

    // Get the pool data (for cost calculations)
    const pool = gachaPools[poolId];
    if (!pool) {
      console.error(`Pool not found: ${poolId}`);
      return [];
    }
    
    // Calculate cost
    const cost = numPulls === 10 ? pool.tenPullCost : pool.singlePullCost * numPulls;
    
    // Check if echoes are sufficient
    if (echoes < cost) {
      console.error('Not enough echoes to perform prayer');
      return [];
    }
    
    // Deduct the cost
    updateResource('echoes', -cost);
    
    // Generate rewards using the prayer loot table
    const rewards = [];
    
    // Track if we have at least one uncommon+ for 10-pulls
    let hasUncommonOrBetter = false;

    // Perform the pulls
    for (let i = 0; i < numPulls; i++) {
      // For the last pull in a 10-pull, enforce uncommon+ if none so far
      let minRarity = null;
      if (numPulls === 10 && i === numPulls - 1 && !hasUncommonOrBetter) {
        minRarity = 'uncommon';
      }
      
      // Select a reward from the loot table
      const selectedLoot = selectWeightedLoot(prayerLootTable, minRarity);
      console.log('Selected loot:', selectedLoot);
      
      // Process based on type
      let processedReward = null;
      
      if (selectedLoot.type === 'material') {
        // Get the item definition
        const itemDef = getItemDefinition(selectedLoot.itemId);
        console.log(`Looking up item definition for ${selectedLoot.itemId}:`, itemDef);
        
        if (!itemDef) {
          console.error(`Item definition not found for material: ${selectedLoot.itemId}`);
          // Create a fallback definition for display
          processedReward = {
            id: selectedLoot.itemId,
            name: selectedLoot.itemId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            icon: '❓',
            type: 'Material',
            quantity: generateQuantity(selectedLoot.quantity),
            rarity: selectedLoot.rarity
          };
        } else {
          // Generate quantity
          const quantity = generateQuantity(selectedLoot.quantity);
          
          // Add to stash
          addItemsToStash([{
            id: selectedLoot.itemId,
            quantity: quantity
          }]);
          
          // Create reward info for display
          processedReward = {
            id: selectedLoot.itemId,
            name: itemDef.name,
            icon: itemDef.icon,
            type: itemDef.type,
            quantity: quantity,
            rarity: selectedLoot.rarity
          };
        }
      }
      else if (selectedLoot.type === 'resource') {
        // Generate quantity
        const quantity = generateQuantity(selectedLoot.quantity);
        
        // Standardize resource ID to snake_case if it's in camelCase
        let resourceId = selectedLoot.resourceId;
        if (resourceId === 'vitaeEssence') {
          resourceId = 'vitae_essence';
        } else if (resourceId === 'behelitShard') {
          resourceId = 'behelit_shard';
        }
        
        // Update resource
        updateResource(resourceId, quantity);
        
        // Create reward info for display
        processedReward = {
          id: resourceId,
          name: selectedLoot.name || resourceId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          icon: selectedLoot.icon || '✧',
          type: 'Resource',
          quantity: quantity,
          rarity: selectedLoot.rarity
        };
      }
      else if (selectedLoot.type === 'equipment') {
        // Select quality
        const quality = selectRandomQuality(selectedLoot.possibleQualities);
        
        console.log(`Creating equipment instance for ${selectedLoot.itemId} with quality ${quality}`);
        
        // Create item instance with error handling
        try {
          // Create item instance
          const itemInstance = createItemInstance2(selectedLoot.itemId, quality);
          
          if (!itemInstance) {
            throw new Error(`Failed to create item instance: ${selectedLoot.itemId}`);
          }
          
          // Get item definition
          const itemDef = getItemDefinition(selectedLoot.itemId);
          if (!itemDef) {
            throw new Error(`Item definition not found for equipment: ${selectedLoot.itemId}`);
          }
          
          // Add to stash
          addItemsToStash([itemInstance]);
          
          // Create reward info for display
          processedReward = {
            id: itemInstance.id,
            name: itemInstance.name,
            icon: itemDef.icon,
            type: itemDef.type,
            subType: itemDef.subType,
            quality: quality,
            rarity: selectedLoot.rarity
          };
        } catch (error) {
          console.error(error.message);
          // Create a fallback display object
          processedReward = {
            id: selectedLoot.itemId,
            name: selectedLoot.itemId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            icon: '⚔️',
            type: 'Equipment',
            quality: quality,
            rarity: selectedLoot.rarity
          };
        }
      }
      else if (selectedLoot.type === 'mercenary') {
        // Create mercenary instance
        const newMerc = createMercenaryInstance(selectedLoot.definitionId);
        if (!newMerc) {
          console.error(`Failed to create mercenary: ${selectedLoot.definitionId}`);
          // Create a fallback display object
          processedReward = {
            id: selectedLoot.definitionId,
            name: selectedLoot.definitionId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            icon: '👤',
            type: 'Mercenary',
            job: 'Unknown',
            rarity: selectedLoot.rarity
          };
        } else {
          // Add to roster
          const updatedMercList = [...playerMercenaries, newMerc];
          setPlayerMercenaries(updatedMercList);
          
          // Get mercenary definition
          const mercDef = mercenaryDefinitions[selectedLoot.definitionId];
          
          // Create reward info for display
          processedReward = {
            id: newMerc.instanceId,
            name: newMerc.name,
            icon: mercDef ? mercDef.icon : '👤',
            type: 'Mercenary',
            job: newMerc.job,
            rarity: selectedLoot.rarity
          };
        }
      }
      
      if (processedReward) {
        rewards.push(processedReward);
        
        // Check if this is uncommon or better
        if (selectedLoot.rarity !== 'common') {
          hasUncommonOrBetter = true;
        }
      }
    }
    
    // Debug log to trace the issue
    console.log('Generated Rewards by performPrayer:', JSON.stringify(rewards, null, 2));
    
    // Return the processed rewards
    return rewards;
  };
  
  // Function to update task progress based on player actions
  const updateTaskProgress = (actionType, actionDetails) => {
    setPlayerTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      
      // Get relevant tasks that match the action type and aren't completed/claimed
      taskDefinitions.forEach(task => {
        // Skip if task is not tracked or already claimed
        if (!updatedTasks[task.id] || updatedTasks[task.id].claimed) {
          return;
        }
        
        // Skip if task doesn't match the action type
        if (task.type !== actionType) {
          return;
        }
        
        // Check if the action details match the task target
        let shouldIncrementProgress = false;
        let incrementAmount = 0;
        
        switch (actionType) {
          case TASK_TYPES.EXPLORE_AREA:
            if (task.target.areaId === actionDetails.areaId) {
              shouldIncrementProgress = true;
              incrementAmount = 1;
            }
            break;
            
          case TASK_TYPES.CRAFT_ITEM_TYPE:
            if (task.target.itemType === actionDetails.itemType) {
              shouldIncrementProgress = true;
              incrementAmount = 1;
            }
            break;
            
          case TASK_TYPES.GATHER_RESOURCE:
            if ((task.target.resourceId && task.target.resourceId === actionDetails.resourceId) || 
                (task.target.itemId && task.target.itemId === actionDetails.itemId)) {
              shouldIncrementProgress = true;
              incrementAmount = actionDetails.amount || 1;
            }
            break;
            
          case TASK_TYPES.LEVEL_UP_MERC:
            if (task.target.level === actionDetails.level) {
              shouldIncrementProgress = true;
              incrementAmount = 1;
            }
            break;
            
          case TASK_TYPES.PERFORM_RITUAL:
            if (task.target.ritualLocation === actionDetails.ritualLocation) {
              shouldIncrementProgress = true;
              incrementAmount = 1;
            }
            break;
        }
        
        // Update progress if conditions match
        if (shouldIncrementProgress) {
          // Get current progress
          const currentProgress = updatedTasks[task.id].progress || 0;
          // Calculate new progress
          const newProgress = currentProgress + incrementAmount;
          // Update task progress
          updatedTasks[task.id].progress = newProgress;
          
          // Check if task is completed
          const targetValue = task.target.count || task.target.amount || 1;
          if (newProgress >= targetValue && !updatedTasks[task.id].completed) {
            updatedTasks[task.id].completed = true;
            // Add a log entry for task completion
            addLogEntry(`Task Completed: ${task.title}`);
          }
        }
      });
      
      return updatedTasks;
    });
  };

  // Function to claim task rewards
  const claimTaskReward = (taskId) => {
    // Find task definition
    const task = getTaskById(taskId);
    if (!task) {
      console.error(`Task with ID ${taskId} not found.`);
      return;
    }
    
    // Check if task is completed and not claimed
    if (!playerTasks[taskId]?.completed || playerTasks[taskId]?.claimed) {
      console.error(`Task ${taskId} is not completed or already claimed.`);
      return;
    }
    
    // Grant rewards
    const rewards = task.rewards;
    
    // Update core resources
    if (rewards.gold) updateResource('gold', rewards.gold);
    if (rewards.vitaeEssence) updateResource('vitaeEssence', rewards.vitaeEssence);
    if (rewards.behelitShard) updateResource('behelitShard', rewards.behelitShard);
    if (rewards.echoes) updateResource('echoes', rewards.echoes);
    if (rewards.berserkBoiCurrency) updateResource('berserkBoiCurrency', rewards.berserkBoiCurrency);
    
    // Add items to stash
    if (rewards.items && rewards.items.length > 0) {
      const itemsToAdd = rewards.items.map(item => {
        const itemDef = getItemDefinition(item.itemId);
        if (itemDef) {
          if (itemDef.stackable) {
            return {
              id: item.itemId,
              name: itemDef.name,
              quantity: item.quantity,
              icon: itemDef.icon,
              type: itemDef.type,
              color: itemDef.color || '#ffffff'
            };
          } else {
            // Create actual item instances for non-stackable items
            return Array(item.quantity).fill().map(() => createItemInstance(item.itemId));
          }
        }
        return null;
      }).flat().filter(Boolean);
      
      if (itemsToAdd.length > 0) {
        addItemsToStash(itemsToAdd);
      }
    }
    
    // Mark task as claimed
    setPlayerTasks(prevTasks => ({
      ...prevTasks,
      [taskId]: { ...prevTasks[taskId], claimed: true }
    }));
    
    // Add log entry for claiming rewards
    addLogEntry(`Rewards claimed for task: ${task.title}`);
  };
  
  // Include the shop listings in the state
  const [shopListings, setShopListings] = useState(shopItemDefinitions);
  
  // Function to purchase an item from the shop
  const purchaseShopItem = (shopListingId, quantityToBuy = 1) => {
    console.log(`Attempting to purchase ${shopListingId}, quantity: ${quantityToBuy}`);
    
    // Find the shop listing
    const shopListing = getShopListingById(shopListingId);
    if (!shopListing) {
      console.error(`Shop listing not found: ${shopListingId}`);
      return false;
    }
    
    // Get the actual item definition
    const itemDefinition = itemDefinitions.find(item => item.id === shopListing.itemId);
    if (!itemDefinition) {
      console.error(`Item definition not found for: ${shopListing.itemId}`);
      return false;
    }
    
    // Check if the player has enough gold
    const totalCost = shopListing.priceGold * quantityToBuy;
    if (gold < totalCost) {
      console.log('Not enough gold for purchase');
      return false;
    }
    
    // Check if the item is in stock
    const isInStock = shopListing.stock.current === Infinity || 
                      shopListing.stock.current >= quantityToBuy;
    if (!isInStock) {
      console.log('Item out of stock');
      return false;
    }
    
    // Process the purchase
    // 1. Deduct gold
    updateResource('gold', -totalCost);
    
    // 2. Add items to stash
    const totalQuantity = shopListing.quantitySold * quantityToBuy;
    addItemsToStash([{ 
      itemId: shopListing.itemId, 
      quantity: totalQuantity 
    }]);
    
    // 3. Update shop stock if not infinite
    if (shopListing.stock.current !== Infinity) {
      // Create a new array with updated stock
      const updatedShopListings = shopListings.map(listing => {
        if (listing.shopListingId === shopListingId) {
          return {
            ...listing,
            stock: {
              ...listing.stock,
              current: listing.stock.current - quantityToBuy
            }
          };
        }
        return listing;
      });
      
      setShopListings(updatedShopListings);
    }
    
    // 4. Add log entry
    const itemName = shopListing.overrideName || itemDefinition.name;
    addLogEntry(`You purchased ${itemName}${totalQuantity > 1 ? ` (x${totalQuantity})` : ''} for ${totalCost} gold.`);
    
    console.log('Purchase successful');
    return true;
  };
  
  // Function to purchase an item from the market
  const purchaseMarketItem = (listingId) => {
    // Find the listing
    const listing = marketListings.find(item => item.listingId === listingId);
    if (!listing) {
      console.error(`Market listing not found: ${listingId}`);
      return false;
    }
    
    // Find the actual item definition
    const itemDef = itemDefinitions.find(item => item.id === listing.itemId);
    if (!itemDef) {
      console.error(`Item definition not found for: ${listing.itemId}`);
      return false;
    }
    
    // Check if item is in stock
    if (listing.currentStock <= 0) {
      console.log('Item out of stock');
      return false;
    }
    
    // Determine which currency is being used
    const usingBerserkBoi = listing.priceBerserkBoi !== null;
    const basePrice = usingBerserkBoi ? listing.currentPriceBerserkBoi : listing.currentPriceGold;
    const taxAmount = Math.ceil(basePrice * MARKET_TAX_RATE);
    const totalPrice = basePrice + taxAmount;
    
    // Check if player has enough currency
    const hasEnoughCurrency = usingBerserkBoi 
      ? berserkBoiCurrency >= totalPrice 
      : gold >= totalPrice;
    
    if (!hasEnoughCurrency) {
      console.log(`Not enough ${usingBerserkBoi ? '$BerserkBoi' : 'Gold'} for purchase`);
      return false;
    }
    
    // Process purchase:
    // 1. Deduct currency
    if (usingBerserkBoi) {
      setBerserkBoiCurrency(prev => prev - totalPrice);
    } else {
      setGold(prev => prev - totalPrice);
    }
    
    // 2. Add item(s) to stash
    const itemToAdd = listing.quality && listing.quality !== 'Common'
      ? createItemInstance(listing.itemId, listing.quality) // Create with specific quality
      : createItemInstance(listing.itemId); // Use default quality
    
    // For stackable items, adjust quantity
    if (itemDef.stackable) {
      itemToAdd.quantity = listing.quantity;
    }
    
    addItemsToStash([itemToAdd]);
    
    // 3. Update listing stock
    setMarketListings(prevListings => 
      prevListings.map(item => 
        item.listingId === listingId 
          ? { ...item, currentStock: item.currentStock - 1 } 
          : item
      )
    );
    
    // 4. Add log entry
    const currencyType = usingBerserkBoi ? '$BerserkBoi' : 'Gold';
    const qualityPrefix = listing.quality && listing.quality !== 'Common' ? `${listing.quality} ` : '';
    const itemName = `${qualityPrefix}${itemDef.name}`;
    
    addLogEntry(`Purchased ${itemName}${listing.quantity > 1 ? ` (x${listing.quantity})` : ''} for ${basePrice} ${currencyType} + ${taxAmount} tax.`);
    
    console.log('Market purchase successful');
    return true;
  };
  
  // Function to sell an item to the market
  const sellItemToMarket = (itemId, quantity = 1, itemInstanceId = null) => {
    // Find the item in the stash
    let stashItem;
    if (itemInstanceId) {
      // Find by instance ID for non-stackable items
      stashItem = stashItems.find(item => item.instanceId === itemInstanceId);
    } else {
      // Find by item ID for stackable items
      stashItem = stashItems.find(item => item.id === itemId);
      
      // Check if we have enough quantity
      if (!stashItem || stashItem.quantity < quantity) {
        console.error(`Not enough ${itemId} in stash to sell.`);
        return false;
      }
    }
    
    if (!stashItem) {
      console.error(`Item not found in stash: ${itemId}`);
      return false;
    }
    
    // Find the item definition
    const itemDef = itemDefinitions.find(item => item.id === itemId);
    if (!itemDef) {
      console.error(`Item definition not found: ${itemId}`);
      return false;
    }
    
    // Determine base value from item definition
    const baseValue = itemDef.value || 0;
    
    // Apply quality modifier for non-stackable items
    let adjustedValue = baseValue;
    if (stashItem.quality && stashItem.quality !== 'Common') {
      const qualityModifiers = {
        'Crude': 0.8,
        'Common': 1.0,
        'Sturdy': 1.2,
        'Quality': 1.5,
        'Masterwork': 2.0
      };
      
      adjustedValue = Math.round(baseValue * (qualityModifiers[stashItem.quality] || 1.0));
    }
    
    // Apply type-based buyback rate
    const buybackRate = MARKET_BUYBACK_RATES[itemDef.type] || MARKET_BUYBACK_RATES.default;
    
    // Calculate the sell price (including quantity)
    const sellPrice = Math.round(adjustedValue * buybackRate * quantity);
    
    // Calculate tax
    const taxAmount = Math.ceil(sellPrice * MARKET_TAX_RATE);
    
    // Calculate final price player receives
    const finalPrice = sellPrice - taxAmount;
    
    // Process the sale:
    // 1. Remove item(s) from stash
    if (itemInstanceId) {
      // For non-stackable items, remove the entire item
      removeItemsFromStash([{ instanceId: itemInstanceId }]);
    } else {
      // For stackable items, reduce the quantity
      removeItemsFromStash([{ id: itemId, quantity }]);
    }
    
    // 2. Add gold to player
    updateResource('gold', finalPrice);
    
    // 3. Add log entry
    const qualityPrefix = stashItem.quality && stashItem.quality !== 'Common' ? `${stashItem.quality} ` : '';
    const itemName = `${qualityPrefix}${stashItem.name || itemDef.name}`;
    
    addLogEntry(`Sold ${itemName}${quantity > 1 ? ` (x${quantity})` : ''} for ${finalPrice} Gold (after ${taxAmount} tax).`);
    
    console.log('Market sell successful');
    return true;
  };
  
  // Add price fluctuation & listing refresh to an existing global timer
  useEffect(() => {
    if (currentPage !== 'game') return;
    
    // Set up a timer to update market listings every 5 minutes
    const marketUpdateInterval = setInterval(() => {
      setMarketListings(prevListings => {
        const updatedListings = [...prevListings];
        
        // Update listings with random price fluctuations and potential stock refreshes
        updatedListings.forEach((listing, index) => {
          // Chance for price fluctuation (20% chance)
          if (Math.random() < 0.2) {
            // Apply a random fluctuation between -15% and +15%
            const fluctuationFactor = 0.85 + (Math.random() * 0.3); // Between 0.85 and 1.15
            
            // Update BerserkBoi price if it exists
            if (listing.priceBerserkBoi !== null) {
              const basePrice = listing.basePriceBerserkBoi;
              const newPrice = Math.round(basePrice * fluctuationFactor);
              // Apply min/max bounds (between 70% and 130% of base price)
              const minPrice = Math.floor(basePrice * 0.7);
              const maxPrice = Math.ceil(basePrice * 1.3);
              updatedListings[index].currentPriceBerserkBoi = 
                Math.min(Math.max(newPrice, minPrice), maxPrice);
            }
            
            // Update Gold price if it exists
            if (listing.priceGold !== null) {
              const basePrice = listing.basePriceGold;
              const newPrice = Math.round(basePrice * fluctuationFactor);
              // Apply min/max bounds (between 70% and 130% of base price)
              const minPrice = Math.floor(basePrice * 0.7);
              const maxPrice = Math.ceil(basePrice * 1.3);
              updatedListings[index].currentPriceGold = 
                Math.min(Math.max(newPrice, minPrice), maxPrice);
            }
          }
          
          // Refresh stock for sold out items (30% chance)
          if (listing.currentStock === 0 && Math.random() < 0.3) {
            updatedListings[index].currentStock = listing.initialStock;
          }
        });
        
        return updatedListings;
      });
    }, 300000); // 5 minutes (300,000 milliseconds)
    
    return () => clearInterval(marketUpdateInterval);
  }, [currentPage]);
  
  // Render the appropriate page based on the current state
  return (
    <div className="app-container">
      {/* Conditional rendering based on current page state */}
      {currentPage === 'intro' ? (
        <IntroPage onStartGameClick={handleStartGame} />
      ) : (
        <GamePage
          // Resources
          vitaeEssence={vitaeEssence}
          setVitaeEssence={setVitaeEssence}
          behelitShard={behelitShard}
          setBehelitShard={setBehelitShard}
          berserkBoiCurrency={berserkBoiCurrency}
          setBerserkBoiCurrency={setBerserkBoiCurrency}
          gold={gold}
          setGold={setGold}
          echoes={echoes}
          setEchoes={setEchoes}
          
          // Stash data
          stashItems={stashItems}
          setStashItems={setStashItems}
          addItemsToStash={addItemsToStash}
          removeItemsFromStash={removeItemsFromStash}
          
          // Dev tools functions
          addResource={addResource}
          updateResource={updateResource}
          finishExplorationNow={finishExplorationNow}
          bleakExpanseRef={bleakExpanseRef}
          addExperienceToSelectedMerc={addExperienceToSelectedMerc}
          addIronOre={addIronOre}
          addSteelIngot={addSteelIngot}
          addLeather={addLeather}
          addWood={addWood}
          resetGame={resetGame}
          
          // Bleeding Heart stats
          sanctumIntegrity={sanctumIntegrity}
          setSanctumIntegrity={setSanctumIntegrity}
          maxSanctumIntegrity={maxSanctumIntegrity}
          collectiveConsciousness={collectiveConsciousness}
          setCollectiveConsciousness={setCollectiveConsciousness}
          
          // Upgrade modifiers
          maxIntegrityBonus={maxIntegrityBonus}
          setMaxIntegrityBonus={setMaxIntegrityBonus}
          decayRateModifier={decayRateModifier}
          setDecayRateModifier={setDecayRateModifier}
          
          // Threat management
          currentThreatLevel={currentThreatLevel}
          setCurrentThreatLevel={setCurrentThreatLevel}
          activeThreat={activeThreat}
          setActiveThreat={setActiveThreat}
          isWarded={isWarded}
          setIsWarded={setIsWarded}
          
          // Temporary buff management
          activeTemporaryBuffs={activeTemporaryBuffs}
          addTemporaryBuff={addTemporaryBuff}
          removeTemporaryBuff={removeTemporaryBuff}
          
          // Module navigation state
          currentModuleView={currentModuleView}
          setCurrentModuleView={setCurrentModuleView}
          
          // Page navigation
          setCurrentPage={setCurrentPage}
          
          // Mercenary data and functions
          playerMercenaries={playerMercenaries}
          updateMercenary={updateMercenary}
          hireMercenary={hireMercenary}
          dismissMercenary={dismissMercenary}
          selectedMercId={selectedMercId}
          setSelectedMercId={setSelectedMercId}
          
          // Iron Forge data and functions
          knownRecipes={knownRecipes}
          craftingQueue={craftingQueue}
          startCrafting={startCrafting}
          unlockRecipe={unlockRecipe}
          
          // Altar of Binding state
          knownSynthesisRecipes={knownSynthesisRecipes}
          synthesisQueue={synthesisQueue}
          startSynthesis={startSynthesis}
          unlockSynthesisRecipe={unlockSynthesisRecipe}
          
          // Helper functions
          calculateSquadPower={calculateSquadPower}
          getExplorationModifiers={getExplorationModifiers}
          
          // BleakExpanse state
          bleakExpanseState={bleakExpanseState}
          setBleakExpanseState={setBleakExpanseState}
          
          // Bleeding Heart state
          bleedingHeartState={bleedingHeartState}
          updateBleedingHeartState={updateBleedingHeartState}
          
          // Global exploration state and functions
          activeExplorationTask={activeExplorationTask}
          setActiveExplorationTask={setActiveExplorationTask}
          explorationEventActive={explorationEventActive}
          setExplorationEventActive={setExplorationEventActive}
          currentExplorationEvent={currentExplorationEvent}
          setCurrentExplorationEvent={setCurrentExplorationEvent}
          startNewExploration={startNewExploration}
          completeExploration={completeExploration}
          
          // Add new props for WhispersOfFate
          performPrayer={performPrayer}
          
          // Task system props
          playerTasks={playerTasks}
          claimTaskReward={claimTaskReward}
          taskDefinitions={taskDefinitions}
          
          // The Pauper's Hand
          shopListings={shopListings}
          purchaseShopItem={purchaseShopItem}
          allItemDefinitions={itemDefinitions}
          
          // Wyrd Exchange
          marketListings={marketListings}
          purchaseMarketItem={purchaseMarketItem}
          sellItemToMarket={sellItemToMarket}
          MARKET_TAX_RATE={MARKET_TAX_RATE}
          
          addLogEntry={addLogEntry}
        />
      )}
      <div id="dev-tools-container"></div>
    </div>
  );
}

export default App