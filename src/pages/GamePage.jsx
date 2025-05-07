import React, { useState, useEffect, useRef } from 'react';
import { 
  faHeartbeat, faUsers, faMap, faHammer,
  faHandHoldingDollar, faExchangeAlt, faFlask, faGhost
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import ResourceDisplay from '../components/ResourceDisplay';
import ActiveTasksDisplay from '../components/ActiveTasksDisplay';
import GrimoireAltarView from '../components/GrimoireAltarView';
import ModuleNavButton from '../components/ModuleNavButton';
import BackButton from '../components/BackButton';
import TheBleedingHeart from '../components/TheBleedingHeart';
import StashView from '../components/StashView';
import BleakExpanse from '../components/BleakExpanse';
import DevTools from '../components/DevTools';
import Ironbound from '../components/Ironbound';
import IronForge from '../components/IronForge';
import AltarOfBinding from '../components/AltarOfBinding';
import WhispersOfFate from '../components/WhispersOfFate';
import ThePaupersHandFixed from '../components/ThePaupersHandFixed';
import WyrdExchange from '../components/WyrdExchange';
import PlayerProfileModal from '../components/PlayerProfileModal';
import TreasuryModal from '../components/TreasuryModal';

// Import placeholder components
import IronboundViewPlaceholder from '../components/placeholders/IronboundViewPlaceholder';
import IronForgeViewPlaceholder from '../components/placeholders/IronForgeViewPlaceholder';
import BlackMarketViewPlaceholder from '../components/placeholders/BlackMarketViewPlaceholder';
import WyrdExchangeViewPlaceholder from '../components/placeholders/WyrdExchangeViewPlaceholder';
import WhispersOfFateViewPlaceholder from '../components/placeholders/WhispersOfFateViewPlaceholder';
import BleedingHeartBaseViewPlaceholder from '../components/placeholders/BleedingHeartBaseViewPlaceholder';

import './GamePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// The GamePage component serves as the main game interface
// It contains the central view area and surrounding UI elements using CSS Grid
const GamePage = ({
  // Resources
  vitaeEssence,
  setVitaeEssence,
  behelitShard,
  setBehelitShard,
  berserkBoiCurrency,
  setBerserkBoiCurrency,
  gold,
  setGold,
  echoes,
  setEchoes,
  
  // Stash data
  stashItems,
  setStashItems,
  addItemsToStash,
  removeItemsFromStash,
  
  // Dev tools functions
  addResource,
  updateResource,
  finishExplorationNow,
  bleakExpanseRef,
  addExperienceToSelectedMerc,
  addIronOre,
  addSteelIngot,
  addLeather,
  addWood,
  resetGame,
  
  // Bleeding Heart stats
  sanctumIntegrity,
  setSanctumIntegrity,
  maxSanctumIntegrity,
  collectiveConsciousness,
  setCollectiveConsciousness,
  
  // Upgrade modifiers
  maxIntegrityBonus,
  setMaxIntegrityBonus,
  decayRateModifier,
  setDecayRateModifier,
  
  // Threat management
  currentThreatLevel,
  setCurrentThreatLevel,
  activeThreat,
  setActiveThreat,
  isWarded,
  setIsWarded,
  
  // Temporary buff management
  activeTemporaryBuffs,
  addTemporaryBuff,
  removeTemporaryBuff,
  
  // Module navigation state
  currentModuleView,
  setCurrentModuleView,
  
  // Page navigation
  setCurrentPage,
  
  // Mercenary data and functions
  playerMercenaries,
  updateMercenary,
  hireMercenary,
  dismissMercenary,
  selectedMercId,
  setSelectedMercId,
  
  // Iron Forge data and functions
  knownRecipes,
  craftingQueue,
  startCrafting,
  unlockRecipe,
  
  // Altar of Binding state
  knownSynthesisRecipes,
  synthesisQueue,
  startSynthesis,
  unlockSynthesisRecipe,
  
  // Helper functions
  calculateSquadPower,
  getExplorationModifiers,
  
  // BleakExpanse state
  bleakExpanseState,
  setBleakExpanseState,
  
  // Bleeding Heart state
  bleedingHeartState,
  updateBleedingHeartState,
  
  // Global exploration state and functions
  activeExplorationTask,
  setActiveExplorationTask,
  explorationEventActive,
  setExplorationEventActive,
  currentExplorationEvent,
  setCurrentExplorationEvent,
  startNewExploration,
  completeExploration,
  
  // Add new props for WhispersOfFate
  performPrayer,
  
  // Task system props
  playerTasks,
  claimTaskReward,
  taskDefinitions,
  
  // The Pauper's Hand
  shopListings,
  purchaseShopItem,
  allItemDefinitions,
  
  // Wyrd Exchange
  marketListings,
  purchaseMarketItem,
  sellItemToMarket,
  MARKET_TAX_RATE,
  
  addLogEntry
}) => {
  // State for handling transition effects
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionView, setTransitionView] = useState(null);
  const [isBaseView, setIsBaseView] = useState(true);
  
  // State for modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTreasuryModalOpen, setIsTreasuryModalOpen] = useState(false);
  
  // Ref for the addLogEntry function
  const addLogEntryRef = useRef(null);

  // Update isBaseView when currentModuleView changes
  useEffect(() => {
    setIsBaseView(currentModuleView === 'The Bleeding Heart - Base');
  }, [currentModuleView]);

  // Handler for clicking on a module icon
  const handleModuleClick = (moduleName) => {
    console.log(`Module clicked: ${moduleName}`); // Add logging for debugging
    setIsTransitioning(true);
    // Save current view for transition
    setTransitionView(renderCurrentModuleView());
    
    // Set a short delay before changing the view
    setTimeout(() => {
      setCurrentModuleView(moduleName);
      // After another short delay, end transition
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionView(null);
      }, 300);
    }, 300);
  };

  // Handler for opening the treasury modal
  const handleOpenTreasuryModal = () => {
    setIsTreasuryModalOpen(true);
  };
  
  // Function to update core resources for Treasury swaps
  const updateCoreResource = (resourceType, amount) => {
    switch (resourceType) {
      case 'berserkBoiCurrency':
        setBerserkBoiCurrency(prev => Math.max(0, prev + amount));
        break;
      case 'echoes':
        setEchoes(prev => Math.max(0, prev + amount));
        break;
      case 'gold':
        setGold(prev => Math.max(0, prev + amount));
        break;
      default:
        console.warn(`Unknown resource type: ${resourceType}`);
    }
  };

  // Add event listener for the custom navigation event from the placeholder
  useEffect(() => {
    const handleNavigateEvent = (event) => {
      console.log('Navigate event received:', event.detail.moduleName);
      if (event.detail && event.detail.moduleName) {
        handleModuleClick(event.detail.moduleName);
      }
    };

    // Add the event listener
    document.addEventListener('navigateToModule', handleNavigateEvent);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('navigateToModule', handleNavigateEvent);
    };
  }, []);

  // Handler for clicking the back button to return to the base view
  const handleBackToBaseClick = () => {
    setIsTransitioning(true);
    setTransitionView(renderCurrentModuleView());
    
    setTimeout(() => {
      setCurrentModuleView('The Bleeding Heart - Base');
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionView(null);
      }, 300);
    }, 300);
  };

  // Module navigation data with names, icons, and positions
  const moduleNavData = [
    { 
      name: 'The Bleeding Heart', 
      icon: faHeartbeat, 
      position: { top: '5%', left: '45%' } 
    },
    { 
      name: 'Ironbound Covenant', 
      icon: faUsers, 
      position: { top: '25%', left: '15%' } 
    },
    { 
      name: 'Bleak Expanse', 
      icon: faMap, 
      position: { top: '25%', right: '15%' } 
    },
    { 
      name: 'Iron Forge', 
      icon: faHammer, 
      position: { top: '50%', left: '5%' } 
    },
    { 
      name: 'The Pauper\'s Hand', 
      icon: faHandHoldingDollar, 
      position: { top: '50%', right: '5%' } 
    },
    { 
      name: 'Wyrd Exchange', 
      icon: faExchangeAlt, 
      position: { bottom: '25%', left: '15%' } 
    },
    { 
      name: 'Altar of Binding', 
      icon: faFlask, 
      position: { bottom: '25%', right: '15%' } 
    },
    { 
      name: 'Whispers of Fate', 
      icon: faGhost, 
      position: { bottom: '5%', left: '45%' } 
    }
  ];

  // Render the appropriate module based on current view
  const renderCurrentModuleView = () => {
    switch (currentModuleView) {
      case 'The Bleeding Heart - Base':
        return (
          <GrimoireAltarView 
            onTreasuryClick={handleOpenTreasuryModal}
          />
        );

      case 'The Bleeding Heart':
        return (
          <TheBleedingHeart
            // Core stats
            sanctumIntegrity={sanctumIntegrity}
            maxSanctumIntegrity={maxSanctumIntegrity}
            collectiveConsciousness={collectiveConsciousness}
            
            // Resources
            vitaeEssence={vitaeEssence}
            behelitShard={behelitShard}
            berserkBoiCurrency={berserkBoiCurrency}
            
            // Upgrade modifiers
            maxIntegrityBonus={maxIntegrityBonus}
            decayRateModifier={decayRateModifier}
            
            // Threats
            currentThreatLevel={currentThreatLevel}
            activeThreat={activeThreat}
            
            // Boolean states
            isWarded={isWarded}
            
            // Temporary buff management
            activeTemporaryBuffs={activeTemporaryBuffs}
            addTemporaryBuff={addTemporaryBuff}
            removeTemporaryBuff={removeTemporaryBuff}
            
            // State persistence
            bleedingHeartState={bleedingHeartState}
            updateBleedingHeartState={updateBleedingHeartState}
            
            // Update functions
            setSanctumIntegrity={setSanctumIntegrity}
            setCollectiveConsciousness={setCollectiveConsciousness}
            setVitaeEssence={setVitaeEssence}
            setBehelitShard={setBehelitShard}
            setBerserkBoiCurrency={setBerserkBoiCurrency}
            setMaxIntegrityBonus={setMaxIntegrityBonus}
            setDecayRateModifier={setDecayRateModifier}
            setIsWarded={setIsWarded}
            setActiveThreat={setActiveThreat}
            setCurrentThreatLevel={setCurrentThreatLevel}
          />
        );

      case 'Bleak Expanse':
        return (
          <BleakExpanse
            // Only the props needed by the component after refactoring
            playerMercenaries={playerMercenaries}
            calculateSquadPower={calculateSquadPower}
            
            // BleakExpanse state
            bleakExpanseState={bleakExpanseState}
            setBleakExpanseState={setBleakExpanseState}
            
            // Global exploration state - passing the new props
            activeExplorationTask={activeExplorationTask}
            startNewExploration={startNewExploration}
            completeExploration={completeExploration}
            
            // Reference for dev tools
            ref={bleakExpanseRef}
          />
        );

      case 'Ironbound Covenant':
        return (
          <Ironbound 
            playerMercenaries={playerMercenaries}
            stashItems={stashItems}
            gold={gold}
            updateMercenary={updateMercenary}
            updateResource={updateResource}
            removeItemsFromStash={removeItemsFromStash}
            addItemsToStash={addItemsToStash}
            hireMercenary={hireMercenary}
            dismissMercenary={dismissMercenary}
            selectedMercId={selectedMercId}
            setSelectedMercId={setSelectedMercId}
          />
        );
      case 'Iron Forge':
        return (
          <IronForge
            knownRecipes={knownRecipes}
            craftingQueue={craftingQueue}
            stashItems={stashItems}
            startCrafting={startCrafting}
            unlockRecipe={unlockRecipe}
          />
        );
      case 'The Pauper\'s Hand':
        return (
          <ThePaupersHandFixed
            shopListings={shopListings}
            allItemDefinitions={allItemDefinitions}
            gold={gold}
            purchaseShopItem={purchaseShopItem}
            addLogEntry={addLogEntry}
          />
        );
      case 'Wyrd Exchange':
        return (
          <WyrdExchange
            marketListings={marketListings}
            allItemDefinitions={allItemDefinitions}
            gold={gold}
            berserkBoiCurrency={berserkBoiCurrency}
            stashItems={stashItems}
            purchaseMarketItem={purchaseMarketItem}
            sellItemToMarket={sellItemToMarket}
            addLogEntry={addLogEntry}
            MARKET_TAX_RATE={MARKET_TAX_RATE}
          />
        );
      case 'Altar of Binding':
        return (
          <AltarOfBinding
            knownSynthesisRecipes={knownSynthesisRecipes}
            synthesisQueue={synthesisQueue}
            stashItems={stashItems}
            startSynthesis={startSynthesis}
            gold={gold}
            vitaeEssence={vitaeEssence}
            behelitShard={behelitShard}
            echoes={echoes}
            berserkBoiCurrency={berserkBoiCurrency}
          />
        );
      case 'Whispers of Fate':
        return (
          <WhispersOfFate
            echoes={echoes}
            performPrayer={performPrayer}
            updateResource={updateResource}
          />
        );
      case 'Stash':
        return <StashView 
          stashItems={stashItems} 
          allItemDefinitions={allItemDefinitions}
          addItemsToStash={addItemsToStash}
        />;
      default:
        return <BleedingHeartBaseViewPlaceholder />;
    }
  };

  return (
    <div className="game-page-container">      
      {/* Left column - Resources display */}
      <div className="resources-area">
        <ResourceDisplay 
          onStashClick={handleModuleClick}
          onReturnToTitle={() => setCurrentPage('intro')}
          gold={gold}
          vitaeEssence={vitaeEssence}
          behelitShard={behelitShard}
          echoes={echoes}
          berserkBoiCurrency={berserkBoiCurrency}
          addResource={addResource}
          finishExplorationNow={finishExplorationNow}
          addExperienceToSelectedMerc={addExperienceToSelectedMerc}
          selectedMercId={selectedMercId}
          addIronOre={addIronOre}
          addSteelIngot={addSteelIngot}
          addLeather={addLeather}
          addWood={addWood}
        />
      </div>
      
      {/* Central column - Main game view with dynamic module content */}
      <div className={`center-area ${!isBaseView ? 'module-view' : ''}`}>
        {/* Twitter social link in the center area's top-right corner */}
        <a
          href="https://x.com/BrandofIron"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link twitter-link"
          aria-label="Follow Brand of Iron on Twitter"
        >
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </a>
        
        {/* Render the current module view with transition effect */}
        <div className={`module-content-wrapper ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          {renderCurrentModuleView()}
        </div>
        
        {/* Show transition view when transitioning */}
        {isTransitioning && transitionView && (
          <div className="module-content-wrapper transition-view fade-out">
            {transitionView}
          </div>
        )}
        
        {/* Conditionally render either navigation buttons or back button */}
        {isBaseView ? (
          /* In base view: show module navigation buttons */
          <>
            {moduleNavData.map((module, index) => (
              <ModuleNavButton
                key={index}
                moduleName={module.name}
                icon={module.icon}
                style={module.position}
                onClick={handleModuleClick}
                activeModule={currentModuleView}
              />
            ))}
          </>
        ) : (
          /* In module view: show back button */
          <BackButton 
            onClick={handleBackToBaseClick} 
            style={{ top: '20px', right: '20px' }}
          />
        )}
      </div>
      
      {/* Right column - Active tasks display */}
      <div className="tasks-area">
        <ActiveTasksDisplay 
          onAddLogEntryRef={addLogEntryRef}
          playerTasks={playerTasks}
          taskDefinitions={taskDefinitions}
          claimTaskReward={claimTaskReward}
        />
      </div>

      {/* Player Profile Modal */}
      <PlayerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      
      {/* Treasury/Aether Exchange Modal */}
      <TreasuryModal
        isOpen={isTreasuryModalOpen}
        onClose={() => setIsTreasuryModalOpen(false)}
        berserkBoiBalance={berserkBoiCurrency}
        echoesBalance={echoes}
        goldBalance={gold}
        updateCoreResource={updateCoreResource}
      />
    </div>
  );
};

export default GamePage; 