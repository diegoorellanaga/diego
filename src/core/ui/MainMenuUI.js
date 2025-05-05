import { AdvancedDynamicTexture, TextBlock, Rectangle, Button, Control } from "@babylonjs/gui";
import { createPanelStyle } from "./styles/panelStyles";
import { createButtonStyle } from "./styles/buttonStyles";

export class MainMenuUI {
    constructor(scene, onWorldSelected, showInGameMenu) {
        this.showInGameMenu = showInGameMenu;
        this.scene = scene;
        this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUI", true, this.scene);
    
    
    if (!this.scene) {
      console.error("No scene provided to MainMenuUI");
      throw new Error("Scene is required");
    }

    // Create UI texture
    this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUI", true, this.scene);
    this.guiTexture.renderScale = 1;
    
    // Store callback
    this.onWorldSelected = onWorldSelected;
    
    this.createMenu();
  }

  createMenu() {
    try {
      // Create panel and ADD IT TO THE ROOT CONTAINER
      const panel = createPanelStyle(this.guiTexture, {
        height: "400px",
        background: "rgba(20, 20, 40, 0.9)"
      });
      this.guiTexture.addControl(panel); // THIS WAS MISSING

      // Title
      const title = new TextBlock("title", "WORLD SELECTOR");
      title.color = "white";
      title.fontSize = 28;
      title.height = "60px";
      title.top = "-120px";
      panel.addControl(title);

      // Close Button (top-right corner)
      const closeBtn = createButtonStyle(this.guiTexture, "closeBtn", "✕", {
        width: "40px",
        height: "40px",
        background: "rgba(255, 50, 50, 0.8)",
        hoverBackground: "rgba(255, 80, 80, 0.9)",
        color: "white",
        thickness: 0,
        cornerRadius: 20
      });
      closeBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      closeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      closeBtn.top = "10px";
      closeBtn.left = "-10px";
      closeBtn.onPointerClickObservable.add(() => {
          console.log("Close button clicked");
          this.showInGameMenu()
          this.dispose();
      });
      panel.addControl(closeBtn);


      // World 1 Button
      const world1Btn = createButtonStyle(this.guiTexture, "world1", "SKY RESUME", {
        background: "rgba(0, 150, 255, 0.8)",
        hoverBackground: "rgba(0, 200, 255, 0.9)"
      });
      world1Btn.top = "-20px";
      world1Btn.onPointerClickObservable.add(() => {
        console.log("World 1 selected");
        this.onWorldSelected(1);
      });
      panel.addControl(world1Btn);

      // World 2 Button
      const world2Btn = createButtonStyle(this.guiTexture, "world2", "MEDIEVAL WORLD", { 
        background: "rgba(150, 100, 0, 0.8)",
        hoverBackground: "rgba(200, 150, 0, 0.9)"
      });
      world2Btn.top = "40px";
      world2Btn.onPointerClickObservable.add(() => {
        console.log("World 2 selected");
        this.onWorldSelected(2);
      });
      panel.addControl(world2Btn);


      // World 2 Button
      const world3Btn = createButtonStyle(this.guiTexture, "world3", "FUTURISTIC WORLD", {
        background: "rgba(150, 100, 0, 0.8)",
        hoverBackground: "rgba(200, 150, 0, 0.9)"
      });
      world3Btn.top = "100px";
      world3Btn.onPointerClickObservable.add(() => {
        console.log("World 2 selected");
        this.onWorldSelected(3);
      });
      panel.addControl(world3Btn);


      // DEBUG: Log the complete UI hierarchy
      console.log("UI Hierarchy:", {
        root: this.guiTexture.rootContainer,
        panel: panel,
        buttons: {
          world1: world1Btn,
          world2: world2Btn
        }
      });

    } catch (error) {
      console.error("Menu creation failed:", error);
      throw error;
    }
  }

  async dispose() {
    if (this.guiTexture ) {
      this.guiTexture.dispose();
    }
}
}