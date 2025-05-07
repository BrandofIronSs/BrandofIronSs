// src/gameData/skills.js

// Define the combat effects for all skills
export const skillEffects = {
  // Warrior skills
  'Heavy Swing': { 
    description: 'A powerful but slow attack that deals massive damage.',
    trigger: 'on_combat_start', 
    chance: 0.2, 
    effect: { 
      type: 'stat_buff', 
      target: 'self', 
      stat: 'physicalAttack', 
      multiplier: 1.2, 
      durationRounds: 3 
    }
  },
  'Endure Pain': { 
    description: 'When health is low, the mercenary gains increased defense.',
    trigger: 'on_low_hp', 
    threshold: 0.3, 
    effect: { 
      type: 'stat_buff', 
      target: 'self', 
      stat: 'physicalDefense', 
      multiplier: 1.25, 
      durationRounds: 2 
    }
  },
  
  // Rogue skills
  'Quick Stab': { 
    description: 'A fast attack with increased critical chance.',
    trigger: 'on_attack', 
    chance: 0.25, 
    effect: { 
      type: 'stat_buff', 
      target: 'self', 
      stat: 'critChance', 
      addValue: 15, 
      durationRounds: 1 
    }
  },
  'Fade': { 
    description: 'Temporarily increases evasion when attacked.',
    trigger: 'on_hit', 
    chance: 0.3, 
    effect: { 
      type: 'stat_buff', 
      target: 'self', 
      stat: 'evasion', 
      multiplier: 1.3, 
      durationRounds: 2 
    }
  },
  
  // Mage skills
  'Mana Bolt': { 
    description: 'A magical attack that ignores physical defense.',
    trigger: 'on_attack', 
    chance: 0.35, 
    effect: { 
      type: 'special_attack', 
      damageType: 'magical', 
      damageMultiplier: 1.1,
      ignoreDefense: 0.5, 
      durationRounds: 1 
    }
  },
  'Minor Ward': { 
    description: 'A protective barrier that reduces incoming damage.',
    trigger: 'on_combat_start', 
    chance: 0.4, 
    effect: { 
      type: 'damage_reduction', 
      target: 'self', 
      reduction: 0.2, 
      durationRounds: 2 
    }
  }
};

// Function to check if a skill should trigger
export const shouldSkillTrigger = (skill, triggerType, conditions = {}) => {
  // Get the skill effect definition
  const skillEffect = skillEffects[skill];
  if (!skillEffect) return false;
  
  // Check if this is the right trigger type
  if (skillEffect.trigger !== triggerType) return false;
  
  // Check probability
  if (skillEffect.chance && Math.random() > skillEffect.chance) return false;
  
  // Check HP threshold for "on_low_hp" trigger
  if (triggerType === 'on_low_hp' && skillEffect.threshold) {
    const { currentHP, maxHP } = conditions;
    if (!currentHP || !maxHP || (currentHP / maxHP) > skillEffect.threshold) {
      return false;
    }
  }
  
  // All checks passed
  return true;
};

// Function to apply skill effects to a mercenary or enemy
export const applySkillEffect = (target, skill) => {
  const skillEffect = skillEffects[skill]?.effect;
  if (!skillEffect) return { ...target };
  
  // Create a copy of the target with the applied effects
  const updatedTarget = { ...target };
  
  switch (skillEffect.type) {
    case 'stat_buff':
      // Apply stat multiplier if defined
      if (skillEffect.multiplier && updatedTarget.combatStats[skillEffect.stat] !== undefined) {
        updatedTarget.combatStats = {
          ...updatedTarget.combatStats,
          [skillEffect.stat]: Math.round(updatedTarget.combatStats[skillEffect.stat] * skillEffect.multiplier)
        };
      }
      
      // Apply additive value if defined
      if (skillEffect.addValue && updatedTarget.combatStats[skillEffect.stat] !== undefined) {
        updatedTarget.combatStats = {
          ...updatedTarget.combatStats,
          [skillEffect.stat]: updatedTarget.combatStats[skillEffect.stat] + skillEffect.addValue
        };
      }
      
      // Add active buff to track duration
      updatedTarget.activeBuffs = [
        ...(updatedTarget.activeBuffs || []),
        {
          id: `${skill}_${Date.now()}`,
          name: skill,
          remainingRounds: skillEffect.durationRounds,
          affectedStat: skillEffect.stat,
          multiplier: skillEffect.multiplier,
          addValue: skillEffect.addValue
        }
      ];
      break;
      
    case 'damage_reduction':
      updatedTarget.damageReduction = (updatedTarget.damageReduction || 0) + skillEffect.reduction;
      
      // Add active buff to track duration
      updatedTarget.activeBuffs = [
        ...(updatedTarget.activeBuffs || []),
        {
          id: `${skill}_${Date.now()}`,
          name: skill,
          remainingRounds: skillEffect.durationRounds,
          damageReduction: skillEffect.reduction
        }
      ];
      break;
      
    case 'special_attack':
      updatedTarget.specialAttack = {
        name: skill,
        damageType: skillEffect.damageType,
        damageMultiplier: skillEffect.damageMultiplier,
        ignoreDefense: skillEffect.ignoreDefense,
        remainingRounds: skillEffect.durationRounds
      };
      break;
  }
  
  return updatedTarget;
};

// Function to remove expired buffs at the end of a round
export const processBuffDurations = (entity) => {
  if (!entity.activeBuffs || entity.activeBuffs.length === 0) {
    return { ...entity };
  }
  
  const updatedEntity = { ...entity };
  const expiredBuffs = [];
  const remainingBuffs = [];
  
  // Process each buff
  updatedEntity.activeBuffs.forEach(buff => {
    if (buff.remainingRounds <= 1) {
      // Buff has expired
      expiredBuffs.push(buff);
    } else {
      // Reduce duration and keep buff
      remainingBuffs.push({
        ...buff,
        remainingRounds: buff.remainingRounds - 1
      });
    }
  });
  
  // Update active buffs
  updatedEntity.activeBuffs = remainingBuffs;
  
  // Remove effects of expired buffs
  expiredBuffs.forEach(buff => {
    // Revert stat buffs
    if (buff.affectedStat && buff.multiplier && updatedEntity.combatStats[buff.affectedStat]) {
      updatedEntity.combatStats[buff.affectedStat] = Math.round(
        updatedEntity.combatStats[buff.affectedStat] / buff.multiplier
      );
    }
    
    // Remove additive bonuses
    if (buff.affectedStat && buff.addValue && updatedEntity.combatStats[buff.affectedStat]) {
      updatedEntity.combatStats[buff.affectedStat] -= buff.addValue;
    }
    
    // Remove damage reduction
    if (buff.damageReduction) {
      updatedEntity.damageReduction = Math.max(0, (updatedEntity.damageReduction || 0) - buff.damageReduction);
    }
  });
  
  // Clear special attack if expired
  if (updatedEntity.specialAttack && updatedEntity.specialAttack.remainingRounds <= 1) {
    updatedEntity.specialAttack = null;
  } else if (updatedEntity.specialAttack) {
    updatedEntity.specialAttack.remainingRounds--;
  }
  
  return updatedEntity;
}; 