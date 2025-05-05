import { MainMenuUI } from "./MainMenuUI";
import { InGameMenuUI } from "./InGameMenuUI";
import { AdvancedDynamicTexture } from "@babylonjs/gui";

export class UIManager {
  constructor(scene, worldChangeCallback) {
    if (!scene) throw new Error("Scene is required");
    if (!worldChangeCallback) throw new Error("Callback is required");

    this.scene = scene;
    this.currentUI = null;
    
    // Store callbacks
    this.worldChangeCallback = worldChangeCallback;
  }

  async showMainMenu() {
    await this.clearCurrentUI();
    
    try {
      this.currentUI = new MainMenuUI(
        this.scene, 
        async (worldId) => {
          try {
            await this.worldChangeCallback(worldId);
            await this.showInGameMenu();
          } catch (error) {
            console.error("World transition failed:", error);
            this.showErrorUI(`Failed to load world: ${error.message}`);
          }
        },
        async  () => {await this.showInGameMenu();}
      );
      console.log("Main menu shown");
    } catch (error) {
      console.error("Failed to show main menu:", error);
      this.showErrorUI("Failed to load main menu");
    }
  }

  async showInGameMenu() {
    await this.clearCurrentUI();
    
    try {
      this.currentUI = new InGameMenuUI(
        this.scene,
        async () => {
          await this.showMainMenu();
        }
      );
      console.log("In-game menu shown");
    } catch (error) {
      console.error("Failed to show in-game menu:", error);
      this.showErrorUI("Failed to load in-game menu");
    }
  }

  showErrorUI(message) {
    this.clearCurrentUI();
    try {
      const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("errorUI", true, this.scene);
      // ... (rest of error UI setup)
      
      this.currentUI = { 
        dispose: () => {
          if (!guiTexture.isDisposed()) {
            guiTexture.dispose();
          }
        } 
      };
    } catch (error) {
      console.error("Failed to create error UI:", error);
    }
  }

  async clearCurrentUI() {
    try {
      if (this.currentUI) {
        console.log("Clearing current UI");
        await this.currentUI.dispose?.();
        
        // Additional cleanup of any lingering GUI textures
        this.scene.textures.forEach(texture => {
          if (texture instanceof AdvancedDynamicTexture) {
            texture.dispose();
          }
        });
        
        this.currentUI = null;
      }
    } catch (error) {
      console.error("UI cleanup failed:", error);
    }
  }

  dispose() {
    this.clearCurrentUI();
  }
}