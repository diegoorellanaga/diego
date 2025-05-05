import React, { useEffect, useRef } from 'react';
import { Engine, Scene, FollowCamera, Vector3 } from '@babylonjs/core'; // Added FollowCamera
import WorldManager from './WorldManager';
import CharacterManager from './CharacterManager';
import { createArcRotateCamera, createBasicLights } from '../utils/LightAndCamera';
import { UIManager } from './ui/UIManager';
import "@babylonjs/gui";

const GameManager = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const worldManager = useRef(null);
  const characterManager = useRef(null);
  const cameraRef = useRef(null);
  const lightRef = useRef(null);
  const uiManager = useRef(null);
  const currentLevel = useRef(1);
  const gameLoopRunning = useRef(false);

  // Add debug logs at key points
  console.log('GameManager rendering');

  const loadLevel = async (level) => {
    console.log(`Loading level ${level}`);
    try {
      await worldManager.current.loadWorld(level);
      await characterManager.current.spawnPlayer(level); // If spawnPlayer is async
      startGameLoop();
    } catch (error) {
      console.error('Level loading failed:', error);
    }
  };

//   const loadLevelSelect = async (level) => {
//     console.log(`Loading level ${level}`);
//     try {
//       await worldManager.current.loadWorld(level);
//       await characterManager.current.spawnPlayer(); // If spawnPlayer is async
//     } catch (error) {
//       console.error('Level loading failed:', error);
//     }
//   };


  const startGameLoop = () => {

    if (gameLoopRunning.current || !engineRef.current) return;
    
    console.log('Starting game loop');
    gameLoopRunning.current = true;

    console.log('Starting game loop');
    if (!engineRef.current) {
      console.error('Engine not initialized!');
      return;
    }
  
    // This will run every frame automatically
    engineRef.current.runRenderLoop(() => {
      try {
        if (sceneRef.current.isReady()) {

        sceneRef.current.render();
        update();
        }
      } catch (loopError) {
        console.error('Game loop error:', loopError);
      }
    });
  };

  useEffect(() => {
    console.log('Setup effect running');
    if (canvasRef.current && !engineRef.current) {
      try {
        // Set canvas physical size
        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;

        // Initialize engine and scene
        engineRef.current = new Engine(canvasRef.current, true);
        sceneRef.current = new Scene(engineRef.current);
        
        console.log('Engine and scene created');

        // Setup camera and lights
        cameraRef.current = createArcRotateCamera(
          sceneRef.current, 
          canvasRef.current,
          {
            position: new Vector3(0, 15, -20),
            radius: 15
          }
        );
        
        lightRef.current = createBasicLights(sceneRef.current);
        console.log('Camera and lights initialized');

        // Initialize managers
        worldManager.current = new WorldManager(
          engineRef.current, 
          sceneRef.current, 
          cameraRef.current,
          lightRef.current
        );
        
        characterManager.current = new CharacterManager(
          sceneRef.current, 
          cameraRef.current,
          lightRef.current
        );

        uiManager.current = new UIManager(
            sceneRef.current,
            async (worldId) => {
            //  await worldManager.current.loadWorld(worldId);

              await loadLevel(worldId)

              return true; // Resolve promise
            }
          );
        
        // Show initial menu
      //  uiManager.current.showMainMenu();  //showInGameMenu
        uiManager.current.showInGameMenu();
        console.log('Managers initialized');

        loadLevel(currentLevel.current);

        const handleResize = () => {
          canvasRef.current.width = canvasRef.current.clientWidth;
          canvasRef.current.height = canvasRef.current.clientHeight;
          engineRef.current.resize();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          console.log('Cleaning up');
          window.removeEventListener('resize', handleResize);
          engineRef.current.dispose();
        };
      } catch (initError) {
        console.error('Initialization failed:', initError);
      }
    }
  }, []);

  const update = () => {
    try {
      worldManager.current?.update();
      characterManager.current?.update();
    } catch (updateError) {
      console.error('Update error:', updateError);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block' 
        }} 
      />
    </div>
  );
};

export default GameManager;