import React from 'react';
import './DevTools.css';

// DevTools component for testing and development
const DevTools = ({ 
  addResource, 
  finishExplorationNow, 
  addExperienceToSelectedMerc, 
  selectedMercId,
  addIronOre,
  addSteelIngot,
  addLeather,
  addWood,
  resetGame
}) => {
  // Emergency direct reset function - bypasses the App component's resetGame
  const emergencyReset = () => {
    if (window.confirm('紧急重置: 确定要删除所有游戏数据吗？所有进度将永久丢失！')) {
      try {
        console.log('执行紧急游戏重置...');
        
        // 清除所有localStorage数据
        localStorage.clear();
        
        // 设置重置标志到sessionStorage确保显示介绍页面
        sessionStorage.setItem('brand_of_iron_reset', 'true');
        
        // 在URL中添加查询参数强制完全刷新页面
        window.location.href = window.location.pathname + '?reset=' + Date.now();
        
        alert('重置已开始，页面即将重新加载。');
      } catch (error) {
        console.error('紧急重置失败:', error);
        alert('重置失败! 错误: ' + error.message);
      }
    }
  };

  return (
    <div className="dev-tools-container">
      <h3 className="dev-tools-title">== DEV TOOLS ==</h3>
      <div className="dev-tools-buttons">
        <button 
          className="dev-tools-button" 
          onClick={() => addResource('gold', 100)}
        >
          Add 100 Gold
        </button>
        <button 
          className="dev-tools-button" 
          onClick={() => addResource('vitae_essence', 50)}
        >
          Add 50 Vitae
        </button>
        <button 
          className="dev-tools-button" 
          onClick={() => addResource('behelit_shard', 5)}
        >
          Add 5 Behelit
        </button>
        <button 
          className="dev-tools-button" 
          onClick={() => addResource('echoes', 10)}
        >
          Add 10 Echoes
        </button>
        <button 
          className="dev-tools-button" 
          onClick={() => addResource('berserkBoiCurrency', 10)}
        >
          Add 10 $BerserkBoi
        </button>
        <button 
          className="dev-tools-button"
          onClick={() => addExperienceToSelectedMerc && addExperienceToSelectedMerc(100)}
          disabled={!selectedMercId}
          title={!selectedMercId ? "Select a mercenary first" : "Add 100 XP to selected mercenary"}
        >
          Add 100 XP (Selected)
        </button>
        <button 
          className="dev-tools-button exploration-button"
          onClick={finishExplorationNow}
        >
          Finish Exploration
        </button>
        
        {/* Crafting Material Buttons */}
        <div className="dev-tools-section-title">Crafting Materials</div>
        <button 
          className="dev-tools-button material-button"
          onClick={() => addIronOre && addIronOre(50)}
        >
          Add 50 Iron Ore
        </button>
        <button 
          className="dev-tools-button material-button"
          onClick={() => addSteelIngot && addSteelIngot(20)}
        >
          Add 20 Steel Ingot
        </button>
        <button 
          className="dev-tools-button material-button"
          onClick={() => addLeather && addLeather(30)}
        >
          Add 30 Leather
        </button>
        <button 
          className="dev-tools-button material-button"
          onClick={() => addWood && addWood(50)}
        >
          Add 50 Wood
        </button>
        
        {/* Reset Game Button */}
        <div className="dev-tools-section-title">Game Management</div>
        <button 
          className="dev-tools-button reset-button"
          onClick={resetGame}
          style={{ 
            backgroundColor: '#d32f2f', 
            color: 'white', 
            fontWeight: 'bold' 
          }}
        >
          RESET GAME (Deletes Save!)
        </button>
        
        {/* Emergency Reset Button */}
        <button 
          className="dev-tools-button reset-button"
          onClick={emergencyReset}
          style={{ 
            backgroundColor: '#880000', 
            color: 'white', 
            fontWeight: 'bold',
            marginTop: '8px'
          }}
        >
          EMERGENCY RESET (Direct)
        </button>
      </div>
    </div>
  );
};

export default DevTools; 