import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faHammer, faClock, faCheckCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { getItemDefinition } from '../gameData/items';
import { getRecipeById } from '../gameData/recipes';
import './IronForge.css';

// Component to display the Iron Forge crafting interface
const IronForge = ({ knownRecipes, stashItems, startCrafting, craftingQueue }) => {
  // State for updating time remaining
  const [timeNow, setTimeNow] = useState(Date.now());
  
  // Update time every second to refresh countdown timers
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeNow(Date.now());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Debug: Log knownRecipes and stashItems
  useEffect(() => {
    console.log('DEBUGGING IRON FORGE COMPONENT:');
    console.log('IronForge received stashItems prop:', stashItems);
    console.log('Total recipes:', knownRecipes?.length);
    console.log('Recipe IDs:', knownRecipes?.map(r => r.id).join(', '));
    console.log('Total materials:', stashItems?.length);
    console.log('First recipe structure:', knownRecipes?.[0]);
    console.log('Stash items structure:', stashItems?.map(item => 
      `${item.id || item.itemId}: ${item.quantity} (using key: ${item.id ? 'id' : item.itemId ? 'itemId' : 'unknown'})`
    ));
    console.log('Crafting queue:', craftingQueue);
  }, [knownRecipes, stashItems, craftingQueue]);
  
  // Helper function to check if player has enough materials
  const hasEnoughMaterials = (recipe, stashItems) => {
    if (!recipe || !recipe.materials || !stashItems) {
      console.log(`Missing data for hasEnoughMaterials check: recipe=${!!recipe}, materials=${!!recipe?.materials}, stashItems=${!!stashItems}`);
      return false;
    }

    // Debug: Log stash items before material check
    console.log('Current stash items in hasEnoughMaterials:', stashItems);

    return recipe.materials.every(required => {
      // Check for both id and itemId since we don't know which one the stash uses
      const stashItem = stashItems.find(item => 
        (item.id && item.id === required.itemId) || 
        (item.itemId && item.itemId === required.itemId)
      );
      
      const hasEnough = stashItem && stashItem.quantity >= required.quantity;
      
      // Enhanced debug log with more details
      console.log(`Material check for recipe ${recipe.id}:`);
      console.log(`  Required: ${required.itemId} - Quantity: ${required.quantity}`);
      console.log(`  Found item in stash:`, stashItem);
      console.log(`  Owned quantity: ${stashItem?.quantity || 0}`);
      console.log(`  Has enough: ${hasEnough}`);
      
      return hasEnough;
    });
  };
  
  // Simple forge click handler
  const handleForgeClick = (recipeId) => {
    console.log('Forge button clicked for recipe:', recipeId);
    if (startCrafting) {
      startCrafting(recipeId);
    } else {
      console.log('startCrafting function not available');
    }
  };
  
  // Format crafting time (seconds to readable format)
  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  };
  
  // Format remaining time from milliseconds to MM:SS
  const formatRemainingTime = (milliseconds) => {
    if (milliseconds <= 0) return "Complete";
    
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage for a crafting task
  const calculateProgress = (task) => {
    if (!task) return 0;
    
    const recipe = getRecipeById(task.recipeId);
    if (!recipe) return 0;
    
    const totalDuration = recipe.craftingTime * 1000; // Convert to milliseconds
    const elapsed = totalDuration - (task.endTime - timeNow);
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };
  
  // Basic recipe card component structure - wrap content in scrollable area
  const BasicRecipeCard = ({ recipe }) => {
    const productItem = getItemDefinition(recipe.productItemId);
    
    // Clear console log to separate debugging for each recipe card
    console.log('------ Recipe Card Render ------', recipe.id);
    
    // Check if item is already in crafting queue
    const isInQueue = useMemo(() => {
      return craftingQueue?.some(task => task.recipeId === recipe.id);
    }, [recipe.id, craftingQueue]);
    
    // Check if player has enough materials for this recipe
    const canCraft = useMemo(() => {
      const result = hasEnoughMaterials(recipe, stashItems);
      console.log(`Can craft ${recipe.id}: ${result}`);
      return result && !isInQueue;
    }, [recipe, stashItems, isInQueue]);
    
    // Get material details including owned quantities
    const materialDetails = useMemo(() => {
      if (!recipe.materials) {
        console.warn(`Recipe ${recipe.id} has no materials array`);
        return [];
      }
      
      console.log('Calculating material details for recipe:', recipe.id);
      console.log('Current stash items:', stashItems);
      
      return recipe.materials.map(material => {
        const itemDef = getItemDefinition(material.itemId);
        // Check for both id and itemId properties in stash items
        const stashItem = stashItems?.find(item => 
          (item.id && item.id === material.itemId) || 
          (item.itemId && item.itemId === material.itemId)
        );
        
        const ownedQuantity = stashItem?.quantity || 0;
        
        console.log(`Material ${material.itemId} calculation:`);
        console.log(`  Item definition:`, itemDef);
        console.log(`  Found in stash:`, stashItem);
        console.log(`  Owned quantity: ${ownedQuantity}`);
        
        return {
          id: material.itemId,
          name: itemDef?.name || material.itemId,
          icon: itemDef?.icon || '❓',
          requiredQuantity: material.quantity,
          ownedQuantity,
          hasEnough: ownedQuantity >= material.quantity
        };
      });
    }, [recipe.id, recipe.materials, stashItems]);
    
    return (
      <div className={`basic-recipe-card ${canCraft ? 'can-craft' : isInQueue ? 'in-queue' : 'cannot-craft'}`}>
        {/* Card Header with Product Icon */}
        <div className="recipe-header">
          <div className="recipe-icon-wrapper">
            <span className="recipe-icon">{productItem?.icon || '❓'}</span>
          </div>
          <h3 className="recipe-name">{productItem?.name || recipe.productItemId}</h3>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="recipe-card-scrollable">
          {/* Materials Section */}
          <div className="recipe-materials">
            <div className="materials-title">Required Materials:</div>
            {materialDetails.length > 0 ? (
              <ul className="materials-list">
                {materialDetails.map((material, idx) => (
                  <li 
                    key={material.id || idx} 
                    className={material.hasEnough ? "has-materials" : "missing-materials"}
                  >
                    <span className="material-name">
                      <span className="material-icon">{material.icon}</span> {material.name}
                    </span>
                    <span className="material-count">
                      {material.ownedQuantity}/{material.requiredQuantity}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-materials">No materials specified for this recipe.</div>
            )}
          </div>
          
          {/* Crafting Stats */}
          <div className="recipe-stats">
            {/* Crafting Time */}
            <div className="stat-row">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="stat-label">Time:</div>
              <div className="stat-value">{formatTime(recipe.craftingTime || 0)}</div>
            </div>
            
            {/* Success Rate */}
            <div className="stat-row">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="stat-label">Success:</div>
              <div className="stat-value">{recipe.successRate ? `${recipe.successRate * 100}%` : 'Unknown'}</div>
            </div>
            
            {/* Quality Chances */}
            {recipe.qualityProbabilities && (
              <div className="quality-section">
                <div className="stat-row">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <div className="stat-label">Quality:</div>
                </div>
                <div className="quality-bars">
                  {Object.entries(recipe.qualityProbabilities).map(([quality, probability]) => (
                    <div className="quality-item" key={quality}>
                      <div className="quality-label">{quality}</div>
                      <div className="quality-bar">
                        <div 
                          className={`quality-fill ${quality.toLowerCase()}`} 
                          style={{ width: `${probability * 100}%` }}
                        ></div>
                      </div>
                      <div className="quality-percent">{Math.round(probability * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Forge Button - Outside the scrollable area */}
        <button 
          className="basic-forge-button"
          onClick={() => handleForgeClick(recipe.id)}
          disabled={!canCraft}
        >
          {isInQueue ? (
            <>In Progress</>
          ) : (
            <><FontAwesomeIcon icon={faHammer} /> FORGE</>
          )}
        </button>
      </div>
    );
  };
  
  // Queue Item Component
  const QueueItemCard = ({ task }) => {
    const recipe = getRecipeById(task.recipeId);
    if (!recipe) return null;
    
    const productItem = getItemDefinition(recipe.productItemId);
    const timeRemaining = task.endTime - timeNow;
    const progressPercent = calculateProgress(task);
    
    return (
      <div className="queue-item">
        <div className="queue-item-icon">
          {productItem?.icon || '❓'}
        </div>
        <div className="queue-item-details">
          <h3>{productItem?.name || recipe.productItemId}</h3>
          <div className="queue-progress-container">
            <div 
              className="queue-progress" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="queue-time-remaining">
            <FontAwesomeIcon icon={faClock} />
            <span>{formatRemainingTime(timeRemaining)}</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="iron-forge-container">
      <header className="forge-header">
        <h1>
          <FontAwesomeIcon icon={faFire} className="forge-icon" />
          Iron Forge
        </h1>
        <p className="forge-description">
          Craft weapons and tools from the bounty of the Bleak Expanse.
        </p>
      </header>
      
      <div className="forge-content">
        {/* Recipes Section */}
        <div className="recipes-section">
          <div className="section-title">
            <FontAwesomeIcon icon={faHammer} />
            Available Recipes
          </div>
          <div className="basic-recipes-grid">
            {!knownRecipes || knownRecipes.length === 0 ? (
              <div className="no-recipes">No recipes available.</div>
            ) : (
              knownRecipes.map((recipe, index) => (
                <BasicRecipeCard key={recipe.id || index} recipe={recipe} />
              ))
            )}
          </div>
        </div>
        
        {/* Crafting Queue Section */}
        <div className="crafting-queue-section">
          <div className="section-title">
            <FontAwesomeIcon icon={faFire} />
            Active Forging
          </div>
          
          {!craftingQueue || craftingQueue.length === 0 ? (
            <div className="queue-empty">No items are currently being forged.</div>
          ) : (
            <div className="queue-items">
              {craftingQueue.map(task => (
                <QueueItemCard key={task.taskId} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IronForge; 