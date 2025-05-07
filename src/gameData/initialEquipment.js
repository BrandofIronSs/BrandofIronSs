// Initial equipment data to populate the stash

export const initialEquipment = [
  { 
    id: 'iron_sword',
    instanceId: 'eq_sword_01',
    name: 'Iron Sword',
    description: 'A standard iron sword. Reliable if unexceptional.',
    icon: '⚔️',
    type: 'Weapon',
    subType: 'Sword',
    quality: 'Common',
    stats: {
      strength: 5,
      agility: 2
    },
    value: 50,
    color: '#a8a8a8'
  },
  { 
    id: 'steel_blade',
    instanceId: 'eq_sword_02',
    name: 'Steel Blade',
    description: 'A finely crafted steel sword with a sharper edge.',
    icon: '⚔️',
    type: 'Weapon',
    subType: 'Sword',
    quality: 'Sturdy',
    stats: {
      strength: 8,
      agility: 3
    },
    value: 120,
    color: '#c0c0c0'
  },
  { 
    id: 'leather_armor',
    instanceId: 'eq_armor_01',
    name: 'Leather Armor',
    description: 'Basic protective gear made from tanned hides.',
    icon: '🥋',
    type: 'Armor',
    subType: 'Chest',
    quality: 'Common',
    stats: {
      strength: 1,
      agility: 3
    },
    value: 40,
    color: '#8b6b4b'
  },
  { 
    id: 'iron_helmet',
    instanceId: 'eq_armor_02',
    name: 'Iron Helmet',
    description: 'A sturdy iron helmet that offers decent head protection.',
    icon: '⛑️',
    type: 'Armor',
    subType: 'Head',
    quality: 'Common',
    stats: {
      strength: 2,
      willpower: 1
    },
    value: 35,
    color: '#a8a8a8'
  },
  { 
    id: 'lucky_charm',
    instanceId: 'eq_acc_01',
    name: 'Lucky Charm',
    description: 'A trinket that seems to bring good fortune to its bearer.',
    icon: '🍀',
    type: 'Accessory',
    subType: 'Trinket',
    quality: 'Common',
    stats: {
      willpower: 4
    },
    value: 25,
    color: '#3cb371'
  },
  { 
    id: 'silver_ring',
    instanceId: 'eq_acc_02',
    name: 'Silver Ring',
    description: 'A simple silver ring with a faint magical aura.',
    icon: '💍',
    type: 'Accessory',
    subType: 'Ring',
    quality: 'Sturdy',
    stats: {
      willpower: 3,
      agility: 2
    },
    value: 60,
    color: '#c0c0c0'
  }
]; 