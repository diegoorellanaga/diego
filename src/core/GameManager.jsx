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

  const loadingDiv = useRef(null);

  // Add debug logs at key points
  console.log('GameManager rendering');

  const loadLevel = async (level) => {
    console.log(`Loading level ${level}`);
    try {

      engineRef.current.loadingScreen.displayLoadingUI()

      await new Promise(resolve => setTimeout(resolve, 0));

      await worldManager.current.loadWorld(level);
      await characterManager.current.spawnPlayer(level); // If spawnPlayer is async
      startGameLoop();

    } catch (error) {
      //engineRef.current.loadingScreen.hideLoadingUI();
      console.error('Level loading failed:', error);
    }finally {
      // This will be called automatically when render loop resumes
      // But we call it here to be safe
      engineRef.current.loadingScreen.hideLoadingUI();
      //engineRef.current.hideLoadingUI();
    }
  };

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


        // engineRef.current.loadingScreen.displayLoadingUI = () => {
        //   const div = document.createElement("div");
        //   div.textContent = "🛸 Loading Diego's Website...";
        //   div.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:white;display:flex;justify-content:center;align-items:center;`;
        //   document.body.appendChild(div);
        //  // this._loadingDiv = div;
        //  loadingDiv.current = div;
        // };


        engineRef.current.loadingScreen.displayLoadingUI = () => {
          loadingDiv.current = document.createElement("div");
          loadingDiv.current.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          `;
          
          // Create GIF element
          const gif = document.createElement("img");
          gif.src = process.env.PUBLIC_URL +"/assets/images/loading.gif";
          gif.style.cssText = `
          width: 20vw;           /* 10% of viewport width */
          height: 20vw;          /* Maintain square ratio */
          max-width: 200px;      /* Prevent becoming too large */
          max-height: 200px;     /* Prevent becoming too large */
          min-width: 120px;       /* Prevent becoming too small */
          min-height: 120px;      /* Prevent becoming too small */
          object-fit: contain;   /* Maintain aspect ratio */
          margin-bottom: 2vh;    /* Relative to viewport height */
        `;
          
          // Create loading text
          const text = document.createElement("div");
          text.textContent = "Diego Orellana...";
          text.style.cssText = `
            color: white;
            font-size: 18px;
          `;
          
          // Append elements
          loadingDiv.current.appendChild(gif);
          loadingDiv.current.appendChild(text);
          document.body.appendChild(loadingDiv.current);
        };

  
        engineRef.current.loadingScreen.hideLoadingUI = () => {
        //  this._loadingDiv?.remove();
        setTimeout(()=>{loadingDiv.current.remove()},2000)
        
        };

        
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