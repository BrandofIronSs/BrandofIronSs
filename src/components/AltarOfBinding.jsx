import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFlask, faVial } from '@fortawesome/free-solid-svg-icons';
import { getSynthesisRecipeById } from '../gameData/synthesisRecipes';
import { getItemDefinition } from '../gameData/items';
import './AltarOfBinding.css';

// Component to display the Altar of Binding interface
const AltarOfBinding = ({ 
  knownSynthesisRecipes, 
  synthesisQueue, 
  stashItems,
  startSynthesis,
  gold,
  vitaeEssence,
  behelitShard,
  echoes,
  berserkBoiCurrency
}) => {
  // State for updating time remaining
  const [timeNow, setTimeNow] = useState(Date.now());
  
  // Update time every second to refresh countdown timers
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeNow(Date.now());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Helper function to check if player has enough materials and resources
  const hasEnoughMaterials = (recipe) => {
    if (!recipe || !recipe.materials) {
      return false;
    }

    return recipe.materials.every(required => {
      // Check if it's a resource
      if (required.resourceId) {
        let resourceAmount = 0;
        switch (required.resourceId) {
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
        return resourceAmount >= required.quantity;
      } 
      // Check if it's an item in stash
      else if (required.itemId) {
        const stashItem = stashItems.find(item => 
          (item.id === required.itemId) || (item.itemId === required.itemId)
        );
        return stashItem && stashItem.quantity >= required.quantity;
      }
      
      return false;
    });
  };
  
  // Handle transmutation button click
  const handleTransmuteClick = (recipeId) => {
    const recipe = knownSynthesisRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // Add to queue if we have enough materials
    if (hasEnoughMaterials(recipe)) {
      startSynthesis(recipeId);
    }
  };
  
  // Format time in seconds to MM:SS format
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };
  
  // Helper to get material details including owned quantities
  const getMaterialDetails = (recipe) => {
    if (!recipe.materials) {
      return [];
    }
    
    return recipe.materials.map(material => {
      // Handle resource type materials
      if (material.resourceId) {
        let resourceAmount = 0;
        let resourceName = material.resourceId;
        let resourceIcon = '💰';
        
        // Determine resource amount and icon based on resourceId
        switch (material.resourceId) {
          case 'gold':
            resourceAmount = gold;
            resourceName = 'Gold';
            resourceIcon = '💰';
            break;
          case 'vitae_essence':
            resourceAmount = vitaeEssence;
            resourceName = 'Vitae Essence';
            resourceIcon = '🩸';
            break;
          case 'behelit_shard':
            resourceAmount = behelitShard;
            resourceName = 'Behelit Shard';
            resourceIcon = '👁️';
            break;
          case 'echoes':
            resourceAmount = echoes;
            resourceName = 'Echoes';
            resourceIcon = '🔮';
            break;
          case 'berserkBoiCurrency':
            resourceAmount = berserkBoiCurrency;
            resourceName = '$BerserkBoi';
            resourceIcon = '💲';
            break;
          default:
            resourceAmount = 0;
        }
        
        return {
          id: material.resourceId,
          name: resourceName,
          icon: resourceIcon,
          requiredQuantity: material.quantity,
          ownedQuantity: resourceAmount,
          hasEnough: resourceAmount >= material.quantity
        };
      } 
      // Handle item type materials
      else if (material.itemId) {
        const itemDef = getItemDefinition(material.itemId);
        const stashItem = stashItems?.find(item => 
          (item.id === material.itemId) || (item.itemId === material.itemId)
        );
        
        const ownedQuantity = stashItem?.quantity || 0;
        
        return {
          id: material.itemId,
          name: itemDef?.name || material.itemId,
          icon: itemDef?.icon || '❓',
          requiredQuantity: material.quantity,
          ownedQuantity,
          hasEnough: ownedQuantity >= material.quantity
        };
      }
      
      return null;
    }).filter(Boolean);
  };
  
  // Helper to calculate the time remaining for a task
  const getTimeRemaining = (endTime) => {
    const remaining = Math.max(0, endTime - timeNow);
    return remaining;
  };
  
  // Calculate progress percentage for a synthesis task
  const calculateProgress = (task) => {
    if (!task) return 0;
    
    const recipe = getSynthesisRecipeById(task.recipeId);
    if (!recipe) return 0;
    
    const totalDuration = recipe.processingTime * 1000; // Convert to milliseconds
    const elapsed = totalDuration - getTimeRemaining(task.endTime);
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };
  
  // Get product information for display
  const getProductInfo = (recipe) => {
    if (recipe.product.itemId) {
      const item = getItemDefinition(recipe.product.itemId);
      return {
        name: item?.name || recipe.product.itemId,
        icon: item?.icon || '❓',
        quantity: recipe.product.quantity
      };
    } 
    else if (recipe.product.resourceId) {
      let resourceName = recipe.product.resourceId;
      let resourceIcon = '💰';
      
      // Determine resource name and icon based on resourceId
      switch (recipe.product.resourceId) {
        case 'gold':
          resourceName = 'Gold';
          resourceIcon = '💰';
          break;
        case 'vitae_essence':
          resourceName = 'Vitae Essence';
          resourceIcon = '🩸';
          break;
        case 'behelit_shard':
          resourceName = 'Behelit Shard';
          resourceIcon = '👁️';
          break;
        case 'echoes':
          resourceName = 'Echoes';
          resourceIcon = '🔮';
          break;
        case 'berserkBoiCurrency':
          resourceName = '$BerserkBoi';
          resourceIcon = '💲';
          break;
      }
      
      return {
        name: resourceName,
        icon: resourceIcon,
        quantity: recipe.product.quantity
      };
    }
    
    return { name: 'Unknown', icon: '❓', quantity: 0 };
  };
  
  // Recipe Card Component
  const RecipeCard = ({ recipe }) => {
    // If recipe is invalid, we still need to call hooks before returning null
    // This ensures hooks are called in the same order every time
    const isValidRecipe = recipe && recipe.product;

    // Check if recipe is already in queue - will be safe even if recipe is invalid
    const isInQueue = useMemo(() => {
      if (!synthesisQueue || !isValidRecipe) return false;
      return synthesisQueue.some(task => task.recipeId === recipe.id);
    }, [recipe?.id, synthesisQueue, isValidRecipe]);
    
    // Check if player has enough materials - will be safe even if recipe is invalid
    const canTransmute = useMemo(() => {
      if (!isValidRecipe) return false;
      return hasEnoughMaterials(recipe) && !isInQueue;
    }, [recipe, isInQueue, isValidRecipe]);
    
    // Add handler to prevent event bubbling issues
    const handleButtonClick = (e) => {
      e.stopPropagation(); // Prevent event from bubbling up
      if (canTransmute && isValidRecipe) {
        handleTransmuteClick(recipe.id);
      }
    };

    // Early return after hooks are called
    if (!isValidRecipe) {
      return null;
    }
    
    const productInfo = getProductInfo(recipe);
    const materials = getMaterialDetails(recipe);
    
    return (
      <div className={`recipe-card ${canTransmute ? 'can-transmute' : 'cannot-transmute'}`}>
        <div className="recipe-card-header">
          <div className="recipe-icon">
            {productInfo.icon}
          </div>
          <h3 className="recipe-name">
            {productInfo.quantity > 1 ? `${productInfo.name} (${productInfo.quantity}x)` : productInfo.name}
          </h3>
        </div>
        
        <div className="recipe-materials">
          <div className="materials-label">Required Materials:</div>
          <ul className="material-list">
            {materials.map((material, idx) => (
              <li key={`${material.id}-${idx}`} className="material-item">
                <div className="material-name">
                  <span className="material-icon">{material.icon}</span>
                  <span>{material.name}</span>
                </div>
                <div className={`material-quantity ${material.hasEnough ? 'sufficient' : 'insufficient'}`}>
                  {material.ownedQuantity}/{material.requiredQuantity}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="recipe-info">
          <div className="processing-time">
            <FontAwesomeIcon icon={faClock} /> {formatTime(recipe.processingTime)}
          </div>
        </div>
        
        <button 
          className="transmute-btn"
          onClick={handleButtonClick}
          disabled={!canTransmute}
        >
          Transmute
        </button>
      </div>
    );
  };
  
  // Queue Item Component
  const QueueItem = ({ task }) => {
    const recipe = getSynthesisRecipeById(task.recipeId);
    const productInfo = recipe ? getProductInfo(recipe) : { name: 'Unknown', icon: '❓' };
    const timeRemaining = getTimeRemaining(task.endTime);
    const progress = calculateProgress(task);
    
    return (
      <div className="queue-item">
        <div className="queue-item-icon">
          {productInfo.icon}
        </div>
        <div className="queue-item-details">
          <div className="queue-item-name">{productInfo.name}</div>
          <div className="queue-progress-container">
            <div 
              className="queue-progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="queue-item-time">{formatTime(Math.ceil(timeRemaining / 1000))}</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="altar-of-binding-container">
      <div className="altar-header">
        <h1 className="altar-title">Altar of Binding</h1>
      </div>
      
      <div className="altar-content">
        {/* Recipe List Section */}
        <div className="recipes-section">
          <div className="recipes-header">
            <h2 className="recipes-title">Transmutation Rituals</h2>
          </div>
          
          <div className="recipes-list">
            {knownSynthesisRecipes && knownSynthesisRecipes.length > 0 ? (
              knownSynthesisRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <div className="empty-recipes">
                <div className="empty-icon">
                  <FontAwesomeIcon icon={faFlask} />
                </div>
                <div className="empty-text">No transmutation rituals discovered yet.</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Queue Section */}
        <div className="queue-section">
          <div className="queue-header">
            <h2 className="queue-title">Active Rituals</h2>
          </div>
          
          <div className="queue-list">
            {synthesisQueue && synthesisQueue.length > 0 ? (
              synthesisQueue.map(task => (
                <QueueItem key={task.taskId} task={task} />
              ))
            ) : (
              <div className="empty-queue">
                <div className="empty-icon">
                  <FontAwesomeIcon icon={faVial} />
                </div>
                <div className="empty-text">No active transmutations.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltarOfBinding; 