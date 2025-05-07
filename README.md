# Brand of Iron - Dark Fantasy Web Game

A dark fantasy web game with a grim medieval/gothic aesthetic inspired by "Berserk". This project uses React with Vite for a fast development environment.

## Project Overview

"Brand of Iron" is a web-based game featuring a unique UI centered around a cursed grimoire/altar that serves as the focal point for all game interactions. The game uses dark, medieval aesthetics with rusty iron, blood red colors and grimy textures to create an immersive atmosphere.

## Features

- Atmospheric dark fantasy intro page with thematic styling
- Unique grimoire/altar-based main game UI
- Resource management system
- Task tracking system
- Module-based gameplay with icon and text navigation buttons
- Responsive design that works on various screen sizes
- Dynamic content switching based on selected modules

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── GrimoireAltarView.jsx  # Central game UI element
│   ├── ModuleNavButton.jsx    # Navigation buttons with icon and text
│   ├── BackButton.jsx         # Return button for module views
│   ├── ResourceDisplay.jsx    # Resources panel component
│   ├── ActiveTasksDisplay.jsx # Tasks panel component
│   └── placeholders/         # Module view placeholders
├── pages/              # Main page components
│   ├── IntroPage.jsx   # Landing/intro page
│   └── GamePage.jsx    # Main game interface with 3-column layout
├── App.jsx             # Root component with page state management
├── main.jsx            # Entry point
└── assets/             # Images, fonts, etc.
```

## Page Descriptions

### Intro Page
- Purpose: Serves as a landing page to introduce the game's theme
- Features: 
  - Game title "Brand of Iron" prominently displayed
  - Atmospheric text to establish the dark setting
  - "Start Game" button to enter the main game

### Game Page
- Purpose: Main game interface with the grimoire/altar as the central focus
- Layout:
  - Resources display (left column)
  - Central grimoire/altar view (center column)
  - Active tasks display (right column)
- Navigation System:
  - ModuleNavButtons positioned around the grimoire that show both icon and text
  - Clicking a button switches the central area to that module's view
  - Back button appears in module views to return to the base grimoire view
- Game Modules:
  - The Bleeding Heart (base view)
  - Ironbound Covenant (followers/alliances)
  - Bleak Expanse (exploration)
  - Iron Forge (crafting/equipment)
  - The Pauper's Hand (market/trading)
  - Wyrd Exchange (mystical trades)
  - Altar of Binding (rituals/powers)
  - Whispers of Fate (quests/prophecies)

## Style Guidelines

- **Color Palette**:
  - Dark Black (#0a0a0a)
  - Dark Gray (#212121)
  - Blood Red (#4a0000)
  - Rust Orange (#754c24)
  - Iron Gray (#3c3c3c)
  - Parchment (#f9f6e8)
  - Burned Parchment (#d8c9a7)

- **Fonts**:
  - Title/Logo: "Grenze Gotisch", "Cinzel Decorative"
  - Thematic Headings: "Skranji", "Akronim"
  - UI Elements/Body: "Averia Serif Libre", "IM Fell DW Pica"

- **Design Principles**:
  - Dark, grimy textures
  - Medieval/gothic aesthetic
  - Rusty, weathered UI elements
  - Blood red accents
  - Thematic icons and symbols

## Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Install Font Awesome libraries:
```
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```
4. Start the development server:
```
npm run dev
```

## Component Details

### ModuleNavButton
- Purpose: Clickable navigation buttons positioned around the grimoire
- Features:
  - Displays both an icon and text for each module
  - Absolutely positioned around the central grimoire
  - Hover effects with pulse animation
  - Active state styling when selected
  - Responsive design for different screen sizes

### BackButton
- Purpose: Return button that appears in module views
- Features:
  - Positioned in the top-right corner of module views
  - Returns the user to the base grimoire view
  - Themed to match the game's aesthetic

### Content Switching
- The GamePage component manages which module view is displayed
- State management using React's useState hook
- Conditional rendering based on the selected module
- Smooth transitions between views

## Future Enhancements

- Game state management (Redux, Context API)
- Backend integration
- Animation effects for the grimoire interactions
- Sound effects and background music
- Module-specific UI components
- User authentication and profiles
- Multiplayer interactions

## Credits

- Fonts: Google Fonts (Grenze Gotisch, Cinzel Decorative, Skranji, Akronim, Averia Serif Libre, IM Fell DW Pica)
- Icons: Font Awesome
- Framework: React with Vite

## Resource System

The game includes two types of resources:

1. **Core Resources** - These are shown in the main ResourceDisplay panel on the left:
   - **Gold:** Base currency for general purchases
   - **Vitae Essence:** Core resource for Bastion upkeep
   - **Behelit Shard:** Endgame rare material
   - **Echoes:** Currency for the "Whispers of Fate" (Prayer/Gacha) system
   - **$BerserkBoi:** Premium currency / token

2. **Secondary Resources** - These are shown in the Stash inventory:
   - **Wood:** Building material
   - **Ore:** Crafting material
   - **Herbs:** Alchemy material
   - **Magic Crystal:** Enhancement material
   - **Karma:** Special currency for moral choices

### Stash System

The Stash can be accessed by clicking the "Stash" button at the bottom of the ResourceDisplay panel. The Stash contains:

1. A list of secondary resources (materials)
2. An inventory grid for items, equipment, and special materials
3. Additional tabs for gear, artifacts, and collectibles (to be implemented)

## Font Consistency

The game uses a consistent font hierarchy throughout the UI:
- Titles and Headers: var(--font-heading) - 'Grenze Gotisch'
- Navigation and Section Titles: var(--font-thematic) - 'Skranji'
- Resource Names and UI Elements: var(--font-old-print) - 'IM Fell DW Pica'
- General Text: var(--font-body) - 'Averia Serif Libre'
- Special Elements: var(--font-accent) - 'Cinzel Decorative'
- Mystical Text: var(--font-unsettling) - 'Akronim'

# Brand of Iron - Deepened Combat System (V2.x)

## Overview

The Deepened Combat System introduces specific combat stats, a turn-based damage calculation system, and skill effects to make equipment and mercenary stats more meaningful in combat during explorations.

## Combat Stats

Mercenaries and equipment now have specific combat stats that determine their effectiveness in battle:

### Core Combat Stats
- **physicalAttack**: Determines the raw damage dealt by physical attacks
- **physicalDefense**: Reduces incoming physical damage
- **accuracy**: Affects hit chance (higher values improve chance to hit)
- **evasion**: Makes a character harder to hit (higher values reduce enemy hit chance)
- **critChance**: Percentage chance to land a critical hit (1.5x damage)
- **hp**: Character's health points in combat

### Magic-Based Stats (for mages)
- **magicalAttack**: Determines damage dealt by magical attacks
- **magicalDefense**: Reduces incoming magical damage

## Equipment Effects

Equipment items now directly contribute to combat stats:

- **Weapons** generally provide **physicalAttack**, **accuracy**, and sometimes **critChance**
- **Armor** generally provides **physicalDefense** and sometimes **evasion**
- **Accessories** provide a variety of stat bonuses depending on their type

The quality of equipment affects the magnitude of these bonuses. Higher quality items provide greater stat bonuses.

## Combat Simulation

When an exploration completes, a turn-based combat simulation now runs:

1. An enemy is generated appropriate to the area and squad level
2. Each mercenary's total combat stats are calculated, including equipment bonuses
3. Combat proceeds in rounds (maximum 10 rounds)
4. During each round:
   - Each mercenary attempts to hit the enemy
   - Hit chance is calculated based on accuracy vs. evasion
   - Damage is calculated based on attack vs. defense
   - Critical hits are rolled based on critChance
   - The enemy selects a random target and attacks
   - Buff durations are processed at the end of the round

Combat ends when either:
- The enemy is defeated (Victory)
- All mercenaries are incapacitated (Defeat)
- Maximum rounds are reached (Struggle)

## Skill Effects

Mercenary skills can now activate during combat to provide various effects:

- **Trigger Types**:
  - `on_combat_start`: Activates at the beginning of combat
  - `on_attack`: Chance to activate when attacking
  - `on_hit`: Chance to activate when being hit
  - `on_low_hp`: Activates when health falls below a threshold

- **Effect Types**:
  - `stat_buff`: Temporarily increases a combat stat
  - `damage_reduction`: Reduces incoming damage
  - `special_attack`: Modifies attacks in various ways

## Enemy Variety

The system includes several enemy types with varied stat profiles:
- Basic enemies (Goblin Scout, Goblin Warrior, Forest Wolf)
- Advanced enemies (Corrupted Cultist, Twisted Sentinel, Shadow Stalker)

Each area can spawn different types of enemies with difficulty levels appropriate to the area.

## Development Notes

This implementation represents Phase 1 of the Deepened Combat System. Future phases may include:
- Individual mercenary HP tracking between expeditions
- More complex skill systems
- Status effects (poison, stun, etc.)
- Equipment with special effects beyond raw stats
