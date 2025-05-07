import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScroll, faChevronRight, faGift } from '@fortawesome/free-solid-svg-icons';
import './ActiveTasksDisplay.css';

// ActiveTasksDisplay component shows current tasks/missions in right panel
const ActiveTasksDisplay = ({ onAddLogEntryRef, playerTasks, taskDefinitions, claimTaskReward }) => {
  // State for log entries
  const [sanctumLog, setSanctumLog] = useState([]);
  
  // Create an addLogEntry function with callback to ensure referential stability
  const addLogEntry = useCallback((message) => {
    const now = new Date();
    const newEntry = {
      message,
      timestamp: now.toLocaleTimeString(),
      fullTimestamp: now
    };
    
    setSanctumLog(prevLogs => [newEntry, ...prevLogs]);
  }, []);
  
  // Expose addLogEntry function to parent components through ref
  useEffect(() => {
    if (onAddLogEntryRef) {
      onAddLogEntryRef.current = addLogEntry;
    }
  }, [addLogEntry, onAddLogEntryRef]);
  
  // Initialize log entries with static timestamps once on component mount
  useEffect(() => {
    // Define messages
    const logMessages = [
      "The Bleeding Heart awakens to your presence...",
      "Your sanctuary awaits your command.",
      "The veil between worlds grows thin...",
      "Whispers echo through the Sanctum halls.",
      "Dark energies swirl within the Heart's chambers."
    ];
    
    // Create log entries with static timestamps
    const currentTime = new Date();
    
    // Create entries with timestamps 5 seconds apart for a more realistic log appearance
    const logEntries = logMessages.map((message, index) => {
      // Create a new date object set to current time minus (5 * index) seconds
      const timestamp = new Date(currentTime.getTime() - (index * 5000));
      return {
        message,
        timestamp: timestamp.toLocaleTimeString(),
        // Store full timestamp as a backup in case we need to sort logs later
        fullTimestamp: timestamp
      };
    });
    
    setSanctumLog(logEntries);
  }, []); // Empty dependency array ensures this only runs once at component mount

  // Function to handle claiming rewards
  const handleClaimReward = (taskId) => {
    claimTaskReward(taskId);
  };

  // Filter active tasks (tasks that are in playerTasks and not claimed)
  const getActiveTasks = () => {
    if (!playerTasks || !taskDefinitions) return [];
    
    return taskDefinitions
      .filter(task => {
        // Filter for tasks that are in playerTasks and not claimed
        const playerTask = playerTasks[task.id];
        return playerTask && !playerTask.claimed;
      })
      .map(task => {
        const playerProgress = playerTasks[task.id] || { progress: 0, completed: false, claimed: false };
        const targetValue = task.target.count || task.target.amount || 1;
        const progressPercentage = Math.min(100, Math.floor((playerProgress.progress / targetValue) * 100));
        
        return {
          ...task,
          progress: playerProgress.progress,
          targetValue,
          progressPercentage,
          completed: playerProgress.completed,
          claimed: playerProgress.claimed
        };
      })
      .sort((a, b) => {
        // Sort completed tasks first, then by progress percentage (descending)
        if (a.completed && !b.completed) return -1;
        if (!a.completed && b.completed) return 1;
        return b.progressPercentage - a.progressPercentage;
      });
  };

  // Get active tasks
  const activeTasks = getActiveTasks();

  return (
    <div className="tasks-display">
      <h3 className="section-title">ACTIVE TASKS</h3>
      <div className="tasks-scroll">
        {activeTasks.length === 0 ? (
          <div className="no-tasks-message">The pages of fate lie empty, awaiting your deeds to be inscribed...</div>
        ) : (
          activeTasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'task-completed' : ''}`}>
              <FontAwesomeIcon icon={faScroll} className="task-icon" />
              <div className="task-details">
                <span className="task-name">{task.title}</span>
                <span className="task-description">{task.description}</span>
                <div className="task-progress-bar">
                  <div 
                    className="task-progress-fill" 
                    style={{ width: `${task.progressPercentage}%` }}
                  ></div>
                </div>
                <div className="task-progress-text">
                  <span className="task-progress-value">{task.progress} / {task.targetValue}</span>
                  <span className="task-percentage">{task.progressPercentage}%</span>
                </div>
                
                {task.completed && (
                  <button 
                    className="claim-reward-button"
                    onClick={() => handleClaimReward(task.id)}
                  >
                    <FontAwesomeIcon icon={faGift} className="reward-icon" />
                    Seize the Boon
                    <FontAwesomeIcon icon={faChevronRight} className="claim-arrow" />
                  </button>
                )}
                
                {task.completed && (
                  <div className="task-rewards">
                    <div className="reward-details">
                      {task.rewards.gold && <span className="reward-gold">{task.rewards.gold} Gold</span>}
                      {task.rewards.vitaeEssence && <span className="reward-vitae">{task.rewards.vitaeEssence} Vitae</span>}
                      {task.rewards.behelitShard && <span className="reward-behelit">{task.rewards.behelitShard} Behelit</span>}
                      {task.rewards.echoes && <span className="reward-echoes">{task.rewards.echoes} Echoes</span>}
                      {task.rewards.items && task.rewards.items.length > 0 && (
                        <span className="reward-items">+ {task.rewards.items.length} items</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Sanctum Log Section */}
      <h3 className="section-title sanctum-log-title">SANCTUM LOG</h3>
      <div className="sanctum-log">
        <div className="log-entries">
          {sanctumLog.map((entry, index) => (
            <div key={index} className="log-entry">
              <span className="log-timestamp">{entry.timestamp}</span>
              <span className="log-message">{entry.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveTasksDisplay; 