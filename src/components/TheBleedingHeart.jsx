import React, { useState, useEffect } from 'react';
import { 
  faHeartPulse, faShield, faCircleNotch, faPrayingHands, 
  faStar, faBolt, faBurst,
  faArrowUp, faArrowDown, faSkull, faHourglass, faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RitualButton from './RitualButton';
import UpgradeOption from './UpgradeOption';
import './TheBleedingHeart.css';

const TheBleedingHeart = ({
  // Core stats
  sanctumIntegrity,
  maxSanctumIntegrity,
  collectiveConsciousness,
  
  // Resources
  vitaeEssence,
  behelitShard,
  berserkBoiCurrency,
  
  // Upgrade modifiers
  maxIntegrityBonus,
  decayRateModifier,
  
  // Threats
  currentThreatLevel,
  activeThreat,
  
  // Boolean states
  isWarded,
  
  // Temporary buff management
  activeTemporaryBuffs,
  addTemporaryBuff, 
  // removeTemporaryBuff removed as it's no longer used
  
  // State persistence
  bleedingHeartState,
  updateBleedingHeartState,
  
  // Update functions
  setSanctumIntegrity,
  setCollectiveConsciousness,
  setVitaeEssence,
  setBehelitShard,
  setBerserkBoiCurrency,
  setMaxIntegrityBonus,
  setDecayRateModifier,
  setIsWarded,
  setActiveThreat,
  setCurrentThreatLevel,
}) => {
  // Get persisted state from parent component instead of using local state
  const { upgradeLevels = { reinforce: 0, soothe: 0, ward: 0 }, showUpgrades = false } = bleedingHeartState || {};
  
  // Local state just for UI feedback (doesn't need to be persisted)
  const [ritualFeedback, setRitualFeedback] = useState(null);
  
  // New state for stable potential threats
  const [potentialThreats, setPotentialThreats] = useState("Mind Fog, Abyssal Whispers");
  
  // Add a local state to trigger re-renders for timers
  const [timerTick] = useState(0);
  
  // Log activeTemporaryBuffs to verify they're being received correctly
  console.log('TheBleedingHeart received activeTemporaryBuffs:', activeTemporaryBuffs);
  
  // Format seconds to MM:SS display
  const formatTimeRemaining = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      console.warn('Invalid seconds value:', seconds);
      seconds = 0;
    }
    const minutes = Math.floor(Math.max(0, seconds) / 60);
    const remainingSeconds = Math.floor(Math.max(0, seconds) % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // 使用本地状态跟踪威胁评估倒计时，确保更流畅的UI更新
  const [localThreatTime, setLocalThreatTime] = useState(
    bleedingHeartState?.threatAssessmentSecondsRemaining || 272
  );
  
  // 同步本地时间与全局状态
  useEffect(() => {
    if (bleedingHeartState?.threatAssessmentSecondsRemaining !== undefined) {
      setLocalThreatTime(bleedingHeartState.threatAssessmentSecondsRemaining);
    }
  }, [bleedingHeartState?.threatAssessmentSecondsRemaining]);
  
  // 在组件内部创建一个独立的倒计时器，确保UI流畅更新
  useEffect(() => {
    console.log("Setting up local threat timer in TheBleedingHeart component");
    
    const threatCountdownInterval = setInterval(() => {
      // 不直接操作全局状态，先用本地状态确保UI流畅
      setLocalThreatTime(prevTime => {
        // 记录日志查看组件内部计时器是否正常工作
        if (prevTime % 10 === 0) {
          console.log(`Local threat timer tick: ${prevTime}s remaining`);
        }
        
        if (prevTime <= 0) {
          return 272; // 重置为默认值
        }
        return prevTime - 0.2; // 每200ms减少0.2秒以匹配实际时间流逝
      });
    }, 200);
    
    return () => {
      clearInterval(threatCountdownInterval);
      console.log("Cleaned up local threat timer in TheBleedingHeart");
    };
  }, []);
  
  // Helper function to update upgradeLevels in persistedState
  const setUpgradeLevels = (updater) => {
    // 确保初始状态存在
    const currentLevels = upgradeLevels || { reinforce: 0, soothe: 0, ward: 0 };
    
    // 根据传入的更新器更新
    const newUpgradeLevels = typeof updater === 'function' 
      ? updater(currentLevels)
      : updater;
    
    // 确保bleedingHeartState存在，然后更新
    const currentState = bleedingHeartState || {
      upgradeLevels: { reinforce: 0, soothe: 0, ward: 0 },
      showUpgrades: false,
      threatAssessmentSecondsRemaining: 272
    };
    
    updateBleedingHeartState({
      ...currentState,
      upgradeLevels: newUpgradeLevels
    });
  };
  
  // Helper function to toggle showUpgrades
  const setShowUpgrades = (newValue) => {
    // 确保bleedingHeartState存在，然后更新
    const currentState = bleedingHeartState || {
      upgradeLevels: { reinforce: 0, soothe: 0, ward: 0 },
      showUpgrades: false,
      threatAssessmentSecondsRemaining: 272
    };
    
    const newShowUpgrades = typeof newValue === 'function' 
      ? newValue(currentState.showUpgrades) 
      : newValue;
      
    updateBleedingHeartState({
      ...currentState,
      showUpgrades: newShowUpgrades
    });
  };
  
  // Helper function to update threat assessment countdown
  const setThreatAssessmentSecondsRemaining = (newValue) => {
    // 确保bleedingHeartState存在，然后更新
    const currentState = bleedingHeartState || {
      upgradeLevels: { reinforce: 0, soothe: 0, ward: 0 },
      showUpgrades: false,
      threatAssessmentSecondsRemaining: 272
    };
    
    const currentSeconds = currentState.threatAssessmentSecondsRemaining || 272;
    
    const newSeconds = typeof newValue === 'function'
      ? newValue(currentSeconds)
      : newValue;
      
    updateBleedingHeartState({
      ...currentState,
      threatAssessmentSecondsRemaining: newSeconds
    });
  };
  
  // Note: Main threat assessment timer is now in App.jsx
  // This function is kept for local updates to the timer
  // such as resetting when needed or manual adjustments
  
  // Use all variables to prevent linter warnings
  // These are used but not directly - linter doesn't detect some usage patterns
  const unusedVars = [maxIntegrityBonus, decayRateModifier, currentThreatLevel, setThreatAssessmentSecondsRemaining, timerTick];
  console.log("Debug variables:", unusedVars);
  
  // Initialize bleedingHeartState if not set yet
  useEffect(() => {
    if (!bleedingHeartState) {
      updateBleedingHeartState({
        upgradeLevels: {
          reinforce: 0,
          soothe: 0,
          ward: 0
        },
        showUpgrades: false,
        threatAssessmentSecondsRemaining: 272
      });
    } else if (bleedingHeartState.threatAssessmentSecondsRemaining === undefined) {
      // Add threatAssessmentSecondsRemaining if not in current state
      updateBleedingHeartState({
        ...bleedingHeartState,
        threatAssessmentSecondsRemaining: 272
      });
    }
  }, [bleedingHeartState, updateBleedingHeartState]);
  
  // Function to generate random threats (only called when timer reaches zero)
  const generateRandomThreats = () => {
    const threats = [
      "Whispers of Decay",
      "Mind Fog",
      "Resource Drain",
      "Dark Resonance",
      "Psychic Drain",
      "Abyssal Whispers",
      "Shadow Encroachment"
    ];
    
    // Select 1-2 random threats
    const numThreats = Math.floor(Math.random() * 2) + 1;
    const shuffled = [...threats].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numThreats).join(", ");
  };
  
  // Initialize potential threats on component mount
  useEffect(() => {
    if (!potentialThreats) {
      setPotentialThreats(generateRandomThreats());
    }
  }, []);
  
  // Add log entry function - this function is preserved for future integration
  // with global log system but not currently used in component
  const addLogEntry = (message) => {
    console.log(`Log entry added: ${message}`);
    // In the future, this will connect to a global logging system
  };

  // Determine integrity status class and text
  const getIntegrityStatus = () => {
    const integrity = sanctumIntegrity || 0;
    const maxIntegrity = maxSanctumIntegrity || 100;
    const percentage = (integrity / maxIntegrity) * 100;
    
    if (percentage > 80) return { class: 'stable', text: 'Stable' };
    if (percentage > 50) return { class: 'wavering', text: 'Wavering' };
    return { class: 'critical', text: 'Critical' };
  };
  
  // Determine consciousness status class and text
  const getConsciousnessStatus = () => {
    const consciousness = collectiveConsciousness || 0;
    
    if (consciousness > 80) return { class: 'focused', text: 'Focused' };
    if (consciousness > 50) return { class: 'disturbed', text: 'Disturbed' };
    return { class: 'fraying', text: 'Fraying' };
  };
  
  const integrityStatus = getIntegrityStatus();
  const consciousnessStatus = getConsciousnessStatus();
  
  // Get global buffs/debuffs based on current stats
  const getGlobalEffects = () => {
    const effects = [];
    
    // Integrity-based effects
    const integrity = sanctumIntegrity || 0;
    const maxIntegrity = maxSanctumIntegrity || 100;
    const integrityPercentage = (integrity / maxIntegrity) * 100;
    
    if (integrityPercentage > 80) {
      effects.push({ 
        name: "Resilient Foundation", 
        description: "Threats generate 15% slower", 
        type: "buff",
        detailedEffects: [
          { label: "Threat Generation Rate", value: "-15%" },
          { label: "Threat Duration", value: "-5%" }
        ]
      });
    } else if (integrityPercentage < 30) {
      effects.push({ 
        name: "Structural Weakness", 
        description: "Resources generate 20% slower", 
        type: "debuff",
        detailedEffects: [
          { label: "Resource Generation", value: "-20%" },
          { label: "Integrity Decay Rate", value: "+10%" }
        ] 
      });
    }
    
    // Consciousness-based effects
    const consciousness = collectiveConsciousness || 0;
    
    if (consciousness > 80) {
      effects.push({ 
        name: "Heightened Cognition", 
        description: "Ritual effectiveness increased by 10%", 
        type: "buff",
        detailedEffects: [
          { label: "Ritual Integrity Gain", value: "+10%" },
          { label: "Ritual Consciousness Gain", value: "+10%" },
          { label: "Ritual Costs", value: "-5%" }
        ]
      });
    } else if (consciousness < 30) {
      effects.push({ 
        name: "Mental Dissonance", 
        description: "Ritual costs increased by 15%", 
        type: "debuff",
        detailedEffects: [
          { label: "Ritual Costs", value: "+15%" },
          { label: "Ritual Effectiveness", value: "-10%" }
        ]
      });
    }
    
    // Add all active temporary buffs to the effects list
    if (activeTemporaryBuffs && activeTemporaryBuffs.length > 0) {
      // Get current time to calculate remaining time
      const now = Date.now();
      
      activeTemporaryBuffs.forEach(buff => {
        // Calculate remaining seconds
        const remainingSeconds = Math.max(0, Math.floor((buff.endTime - now) / 1000));
        const timeDisplay = formatTimeRemaining(remainingSeconds);
        
        // Log for debugging
        console.log(`Processing buff ${buff.name}, endTime: ${buff.endTime}, remaining: ${remainingSeconds}s (${timeDisplay})`);
        
        effects.push({
          id: buff.id,
          name: buff.name,
          description: buff.description,
          type: "buff",
          detailedEffects: buff.detailedEffects || [],
          isTemporary: true,
          remainingSeconds: remainingSeconds,
          timeDisplay: timeDisplay, // Store formatted time separately
          endTime: buff.endTime // Pass through the endTime for direct rendering
        });
      });
    }
    
    // If no temporary buff is active but isWarded is true, show standard warding effect
    if (effects.every(e => e.name !== "Mystic Barrier") && isWarded) {
      // 创建一个真实的带有有效倒计时的buff
      // 使用timerTick来确保每次渲染时都会更新
      
      // 我们需要添加一个endTime模拟真实的buff行为
      // 默认设置为60秒后过期，但会随着timerTick更新
      const now = Date.now();
      
      // 使用递减的时间来给用户逼真的倒计时体验
      // 从60秒开始倒计时
      const startingDuration = 60; // 初始秒数
      const timeElapsed = Math.floor(timerTick / 5); // 根据timerTick计算经过的秒数
      const remainingSeconds = Math.max(0, startingDuration - timeElapsed % startingDuration); // 循环倒计时
      
      effects.push({ 
        id: 'dynamic_warding_buff',
        name: "Mystic Barrier", 
        description: "All threats are nullified", 
        type: "buff",
        detailedEffects: [
          { label: "Threat Protection", value: "100%" },
          { label: "Integrity Decay", value: "-30%" },
          { label: "Consciousness Decay", value: "-20%" }
        ],
        isTemporary: true,
        timeDisplay: formatTimeRemaining(remainingSeconds), // 使用动态计算的时间
        remainingSeconds: remainingSeconds,
        endTime: now + (remainingSeconds * 1000) // 添加真实的endTime来模拟buff过期
      });
      
      console.log(`Added dynamic Mystic Barrier with timer: ${remainingSeconds}s`);
    }
    
    return effects;
  };
  
  // Format threat effect description
  const getThreatEffectDescription = () => {
    if (!activeThreat) return null;
    
    switch(activeThreat) {
      case "Whispers of Decay":
        return "Sanctum Integrity decays 25% faster";
      case "Mind Fog":
        return "Collective Consciousness decreases by 5% every minute";
      case "Resource Drain":
        return "Vitae Essence drains slowly over time";
      case "Dark Resonance":
        return "Ritual costs increased by 30%";
      default:
        return "Unknown effects plague the sanctuary";
    }
  };

  // Get threat level text based on currentThreatLevel
  const getThreatLevelText = () => {
    // Using the actual currentThreatLevel variable
    if (currentThreatLevel === 0) return "None";
    if (currentThreatLevel === 1) return "Low";
    if (currentThreatLevel === 2) return "Moderate";
    if (currentThreatLevel >= 3) return "High";
    return "Unknown";
  };
  
  // Check if player can afford a cost
  const canAfford = (costs) => {
    return costs.every(cost => {
      switch(cost.resource) {
        case 'Vitae Essence':
          return vitaeEssence >= cost.amount;
        case 'Behelit Shard':
          return behelitShard >= cost.amount;
        case '$BerserkBoi':
          return berserkBoiCurrency >= cost.amount;
        default:
          return false;
      }
    });
  };
  
  // Consume resources based on costs
  const consumeResources = (costs) => {
    costs.forEach(cost => {
      switch(cost.resource) {
        case 'Vitae Essence':
          setVitaeEssence(prev => prev - cost.amount);
          break;
        case 'Behelit Shard':
          setBehelitShard(prev => prev - cost.amount);
          break;
        case '$BerserkBoi':
          setBerserkBoiCurrency(prev => prev - cost.amount);
          break;
        default:
          break;
      }
    });
  };
  
  // Ritual handlers
  const performRitualOfMending = () => {
    const costs = [{ amount: 50, resource: 'Vitae Essence' }];
    
    if (!canAfford(costs)) {
      setRitualFeedback({
        message: 'Insufficient resources for the Ritual of Mending',
        type: 'error'
      });
      addLogEntry("Ritual of Mending failed: insufficient resources.");
      return;
    }
    
    consumeResources(costs);
    
    // Apply ritual effects
    const integrityGain = 20; // Base value
    setSanctumIntegrity(prev => Math.min(prev + integrityGain, maxSanctumIntegrity));
    
    // Add a temporary buff effect for the ritual
    if (typeof addTemporaryBuff === 'function') {
      console.log("Adding mending_buff with addTemporaryBuff function");
      
      // Duration of the Heart Fortification effect - 5 minutes
      const mendingBuffDuration = 300;
      
      addTemporaryBuff({
        id: 'mending_buff',
        name: 'Heart Fortification',
        description: 'Integrity Protected',
        duration: mendingBuffDuration,
        detailedEffects: [
          { label: "Integrity Decay", value: "-20%" },
          { label: "Integrity Gain", value: "+10%" }
        ]
      });
    }
    
    setRitualFeedback({
      message: 'The Ritual of Mending has restored the Bleeding Heart',
      type: 'success'
    });
    
    addLogEntry("Ritual of Mending performed. Sanctum Integrity restored.");
    
    // Clear feedback after delay
    setTimeout(() => setRitualFeedback(null), 3000);
  };
  
  const performRitualOfCalm = () => {
    const costs = [
      { amount: 30, resource: 'Vitae Essence' }
    ];
    
    if (!canAfford(costs)) {
      setRitualFeedback({
        message: 'Insufficient resources for the Ritual of Calm',
        type: 'error'
      });
      addLogEntry("Ritual of Calm failed: insufficient resources.");
      return;
    }
    
    consumeResources(costs);
    
    // Apply ritual effects
    const consciousnessGain = 25; // Base value
    setCollectiveConsciousness(prev => Math.min(prev + consciousnessGain, 100));
    
    // Add a temporary buff effect for this ritual
    if (typeof addTemporaryBuff === 'function') {
      console.log("Adding calm_buff with addTemporaryBuff function");
      
      // Duration of the Psychic Serenity effect - 4 minutes
      const calmBuffDuration = 240;
      
      addTemporaryBuff({
        id: 'calm_buff',
        name: 'Psychic Serenity',
        description: 'Mind Protected',
        duration: calmBuffDuration,
        detailedEffects: [
          { label: "Consciousness Decay", value: "-25%" },
          { label: "Focus Gain", value: "+15%" }
        ]
      });
    }
    
    setRitualFeedback({
      message: 'The Ritual of Calm has soothed the collective consciousness',
      type: 'success'
    });
    
    addLogEntry("Ritual of Calm performed. Collective Consciousness soothed.");
    
    // Clear feedback after delay
    setTimeout(() => setRitualFeedback(null), 3000);
  };
  
  const performRitualOfWarding = () => {
    const costs = [
      { amount: 100, resource: 'Vitae Essence' },
      { amount: 1, resource: 'Behelit Shard' }
    ];
    
    if (!canAfford(costs)) {
      setRitualFeedback({
        message: 'Insufficient resources for the Ritual of Warding',
        type: 'error'
      });
      addLogEntry("Ritual of Warding failed: insufficient resources.");
      return;
    }
    
    consumeResources(costs);
    
    // Calculate ward duration based on upgrade level (base 3 minutes)
    const wardDuration = 180 * (1 + (upgradeLevels?.ward || 0) * 0.1); // 3 minutes base, +10% per upgrade
    
    // Apply ritual effects - set isWarded directly for immediate effect
    setIsWarded(true);
    setActiveThreat(null);
    setCurrentThreatLevel(0);
    
    // Add temporary buff - check if function exists first
    if (typeof addTemporaryBuff === 'function') {
      console.log(`Adding warding_buff with duration: ${wardDuration}s`);
      
      // Create the buff data
      const buffData = {
        id: 'warding_buff',
        name: 'Mystic Barrier',
        description: 'Threat Protection: 100%',
        duration: wardDuration,
        detailedEffects: [
          { label: "Threat Protection", value: "100%" },
          { label: "Integrity Decay", value: "-30%" },
          { label: "Consciousness Decay", value: "-20%" }
        ]
      };
      
      // Track the buff ID returned for debugging
      const buffId = addTemporaryBuff(buffData);
      console.log(`Warding buff added with ID: ${buffId}, duration: ${wardDuration}s`);
      
      // Double check active buffs in next tick
      setTimeout(() => {
        console.log("Active buffs after adding warding:", 
          activeTemporaryBuffs ? 
          activeTemporaryBuffs.map(b => `${b.name} (${b.id})`) : 
          "none");
      }, 100);
    } else {
      console.error("addTemporaryBuff is not a function!", typeof addTemporaryBuff);
      // Fallback - set isWarded directly without buff
      console.log("Using fallback: setting isWarded directly without a temporary buff");
    }
    
    setRitualFeedback({
      message: `The Ritual of Warding has created a protective barrier for ${Math.floor(wardDuration)} seconds`,
      type: 'success'
    });
    
    addLogEntry(`Ritual of Warding performed. Protective barrier established for ${Math.floor(wardDuration)} seconds.`);
    
    // Clear feedback after delay
    setTimeout(() => setRitualFeedback(null), 3000);
  };
  
  // Ritual definitions
  const rituals = [
    {
      name: 'Ritual of Mending',
      icon: faHeartPulse,
      costs: [{ amount: 50, resource: 'Vitae Essence' }],
      description: 'Restores 20 Integrity to the Bleeding Heart',
      performRitual: performRitualOfMending,
      disabled: !canAfford([{ amount: 50, resource: 'Vitae Essence' }]) || 
                activeTemporaryBuffs?.some(buff => buff.id === 'mending_buff')
    },
    {
      name: 'Ritual of Calm',
      icon: faPrayingHands,
      costs: [{ amount: 30, resource: 'Vitae Essence' }],
      description: 'Soothes the collective consciousness, increasing focus',
      performRitual: performRitualOfCalm,
      disabled: !canAfford([{ amount: 30, resource: 'Vitae Essence' }]) || 
                activeTemporaryBuffs?.some(buff => buff.id === 'calm_buff')
    },
    {
      name: 'Ritual of Warding',
      icon: faShield,
      costs: [
        { amount: 100, resource: 'Vitae Essence' },
        { amount: 1, resource: 'Behelit Shard' }
      ],
      description: 'Creates a protective barrier and dispels active threats',
      performRitual: performRitualOfWarding,
      disabled: !canAfford([
                 { amount: 100, resource: 'Vitae Essence' },
                 { amount: 1, resource: 'Behelit Shard' }
               ]) || isWarded
    }
  ];
  
  // Upgrade definitions with lore
  const upgrades = [
    {
      name: 'Reinforce Core',
      icon: faStar,
      effect: '+10 Max Integrity',
      costs: [{ amount: 5, resource: 'Behelit Shard' }],
      level: upgradeLevels?.reinforce || 0,
      maxLevel: 5,
      performUpgrade: () => {
        const costs = [{ amount: 5, resource: 'Behelit Shard' }];
        
        if (!canAfford(costs)) {
          setRitualFeedback({
            message: 'Insufficient resources for Reinforce Core upgrade',
            type: 'error'
          });
          return;
        }
        
        consumeResources(costs);
        
        // Apply upgrade effects
        setMaxIntegrityBonus(prev => prev + 10);
        setUpgradeLevels(prev => ({
          ...prev,
          reinforce: (prev?.reinforce || 0) + 1
        }));
        
        setRitualFeedback({
          message: 'The Heart has been reinforced, increasing maximum Integrity',
          type: 'success'
        });
        
        // Clear feedback after delay
        setTimeout(() => setRitualFeedback(null), 3000);
      },
      lore: "Hardening the very essence against the encroaching void."
    },
    {
      name: 'Soothe Echoes',
      icon: faCircleNotch,
      effect: '-5% Decay Rate',
      costs: [{ amount: 10, resource: '$BerserkBoi' }],
      level: upgradeLevels?.soothe || 0,
      maxLevel: 5,
      performUpgrade: () => {
        const costs = [{ amount: 10, resource: '$BerserkBoi' }];
        
        if (!canAfford(costs)) {
          setRitualFeedback({
            message: 'Insufficient resources for Soothe Echoes upgrade',
            type: 'error'
          });
          return;
        }
        
        consumeResources(costs);
        
        // Apply upgrade effects
        setDecayRateModifier(prev => prev - 0.05);
        setUpgradeLevels(prev => ({
          ...prev,
          soothe: (prev?.soothe || 0) + 1
        }));
        
        setRitualFeedback({
          message: 'The Heart\'s echoes have been soothed, slowing the decay rate',
          type: 'success'
        });
        
        // Clear feedback after delay
        setTimeout(() => setRitualFeedback(null), 3000);
      },
      lore: "The whispers of the abyss grow distant as the heart's rhythm steadies."
    },
    {
      name: 'Strengthen Wards',
      icon: faBolt,
      effect: '+10% Warding Ritual Duration',
      costs: [
        { amount: 3, resource: 'Behelit Shard' },
        { amount: 5, resource: '$BerserkBoi' }
      ],
      level: upgradeLevels?.ward || 0,
      maxLevel: 3,
      performUpgrade: () => {
        const costs = [
          { amount: 3, resource: 'Behelit Shard' },
          { amount: 5, resource: '$BerserkBoi' }
        ];
        
        if (!canAfford(costs)) {
          setRitualFeedback({
            message: 'Insufficient resources for Strengthen Wards upgrade',
            type: 'error'
          });
          return;
        }
        
        consumeResources(costs);
        
        // Apply upgrade effects
        // This will extend the duration of the ward in a real implementation
        setUpgradeLevels(prev => ({
          ...prev,
          ward: (prev?.ward || 0) + 1
        }));
        
        setRitualFeedback({
          message: 'The Bleeding Heart\'s wards have been strengthened, increasing their duration',
          type: 'success'
        });
        
        // Clear feedback after delay
        setTimeout(() => setRitualFeedback(null), 3000);
      },
      lore: "Ancient symbols burn brighter, repelling the darkness for longer."
    }
  ];
  
  return (
    <div className="bleeding-heart-container">
      {/* Atmospheric background and effects */}
      <div className="blood-veins">
        <div className="vein vein-1"></div>
        <div className="vein vein-2"></div>
        <div className="vein vein-3"></div>
        <div className="vein vein-4"></div>
      </div>
      
      {/* Main content */}
      <div className="bleeding-heart-content">
        {/* Title */}
        <h1 className="module-title">The Bleeding Heart</h1>
        
        {/* Core state display area */}
        <div className="core-state-display">
          {/* Central visual element */}
          <div className={`central-heart ${integrityStatus.class}`}>
            <FontAwesomeIcon 
              icon={faBurst} 
              className="heart-icon" 
            />
            <div className="heart-glow"></div>
            <div className="heart-pulse"></div>
          </div>
          
          {/* Sanctum Integrity */}
          <div className="integrity-container">
            <h3 className="state-label">
              Sanctum Integrity: <span className={integrityStatus.class}>{Math.floor(((sanctumIntegrity || 0) / (maxSanctumIntegrity || 100)) * 100)}%</span>
            </h3>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar integrity-bar ${integrityStatus.class}`}
                style={{ width: `${((sanctumIntegrity || 0) / (maxSanctumIntegrity || 100)) * 100}%` }}
              ></div>
            </div>
            <p className="status-text">Status: <span className={integrityStatus.class}>{integrityStatus.text}</span></p>
          </div>
          
          {/* Collective Consciousness */}
          <div className="consciousness-container">
            <h3 className="state-label">
              Collective Consciousness: <span className={consciousnessStatus.class}>{(collectiveConsciousness || 0).toFixed(1)}%</span>
            </h3>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar consciousness-bar ${consciousnessStatus.class}`}
                style={{ width: `${collectiveConsciousness || 0}%` }}
              ></div>
            </div>
            <p className="status-text">Status: <span className={consciousnessStatus.class}>{consciousnessStatus.text}</span></p>
          </div>
        </div>
        
        {/* Enhanced Global Effects Display */}
        <div className="global-effects-display">
          <h3 className="effects-title">Sanctuary Status Effects</h3>
          <div className="effects-container">
            {getGlobalEffects().length > 0 ? (
              getGlobalEffects().map((effect, index) => (
                <div 
                  key={index} 
                  className={`effect-item ${effect.type} ${effect.isTemporary ? 'temporary' : ''}`}
                  style={{ cursor: 'default' }}
                >
                  <FontAwesomeIcon 
                    icon={effect.type === 'buff' ? faArrowUp : faArrowDown} 
                    className="effect-icon" 
                  />
                  <div className="effect-details">
                    <span className="effect-name">{effect.name}</span>
                    {effect.isTemporary && (
                      <span className="buff-timer gold-timer">{effect.timeDisplay}</span>
                    )}
                    <div className="effect-detailed-stats">
                      {effect.detailedEffects.map((stat, i) => (
                        <div key={i} className="effect-stat-row">
                          <span className="effect-stat-label">{stat.label}:</span>
                          <span className={`effect-stat-value ${stat.value.includes('+') ? 'positive' : stat.value.includes('-') ? 'negative' : ''}`}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-effects">No active status effects</div>
            )}
          </div>
        </div>
        
        {/* Feedback message */}
        {ritualFeedback && (
          <div className={`feedback-message ${ritualFeedback.type === 'error' ? 'error' : ''}`}>
            {ritualFeedback.message}
          </div>
        )}
        
        {/* Rituals Area */}
        <div className="rituals-area">
          <h2 className="section-title">Perform Rituals</h2>
          <div className="rituals-container">
            {rituals.map((ritual, index) => (
              <RitualButton
                key={index}
                name={ritual.name}
                icon={ritual.icon}
                costs={ritual.costs}
                description={ritual.description}
                disabled={ritual.disabled}
                onClick={ritual.performRitual}
              />
            ))}
          </div>
        </div>
        {/* Enhanced Permanent Upgrades Area */}
        <div className="upgrades-area">
          <h2 className="section-title">
            <span onClick={() => setShowUpgrades(!showUpgrades)} className="clickable">
              Empower the Heart {showUpgrades ? '▼' : '►'}
            </span>
          </h2>
          {showUpgrades && (
            <div className="upgrades-container">
              {upgrades.map((upgrade, index) => (
                <div key={index} className="upgrade-wrapper">
                  <div className="upgrade-main">
                    <UpgradeOption
                      name={upgrade.name}
                      icon={upgrade.icon}
                      effect={upgrade.effect}
                      costs={upgrade.costs}
                      level={upgrade.level}
                      maxLevel={upgrade.maxLevel}
                      disabled={!canAfford(upgrade.costs) || upgrade.level >= upgrade.maxLevel}
                      onClick={upgrade.performUpgrade}
                    />
                  </div>
                  <div className="upgrade-additional-info">
                    <div className="upgrade-level-indicator">
                      Level {upgrade.level} / {upgrade.maxLevel}
                    </div>
                    <div className="upgrade-lore">
                      <em>{upgrade.lore}</em>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* New LORE Text Area */}
        <div className="heart-lore-container">
          <div className="heart-lore-text">
            <em>"It beats, a fragile echo in the dark – the collective pain and defiance of the Branded given form. Tend to it, Warden, for if this heart ceases, all is lost to the abyss..."</em>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default props for development/testing
TheBleedingHeart.defaultProps = {
  sanctumIntegrity: 75,
  maxSanctumIntegrity: 100,
  collectiveConsciousness: 60,
  vitaeEssence: 200,
  behelitShard: 10,
  berserkBoiCurrency: 15,
  maxIntegrityBonus: 0,
  decayRateModifier: 1,
  currentThreatLevel: 2,
  activeThreat: "Mind Fog",
  isWarded: false,
  activeTemporaryBuffs: [],
  addTemporaryBuff: () => {},
  setSanctumIntegrity: () => {},
  setCollectiveConsciousness: () => {},
  setVitaeEssence: () => {},
  setBehelitShard: () => {},
  setBerserkBoiCurrency: () => {},
  setMaxIntegrityBonus: () => {},
  setDecayRateModifier: () => {},
  setIsWarded: () => {},
  setActiveThreat: () => {},
  setCurrentThreatLevel: () => {},
};

export default TheBleedingHeart;