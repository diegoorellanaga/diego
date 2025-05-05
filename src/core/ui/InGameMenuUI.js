import { AdvancedDynamicTexture, Control } from "@babylonjs/gui";
import { createButtonStyle } from "./styles/buttonStyles";

export class InGameMenuUI {
  constructor(scene, onMenuRequested) {
    if (!scene) {
      throw new Error("Scene is required for InGameMenuUI");
    }

    // Create UI texture properly attached to the scene
    this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("inGameUI", true, scene);
    this.guiTexture.renderScale = 1; // Ensure proper scaling
    
    // Store callback
    this.onMenuRequested = onMenuRequested;
    
    this.createMenuButton();
  }

  createMenuButton() {
    try {
      const menuBtn = createButtonStyle(this.guiTexture, "menuBtn", "MENU", {
        width: "100px",
        height: "30px",
        background: "rgba(99, 95, 95, 0.5)",
        hoverBackground: "rgba(68, 66, 211, 0.7)"
      });
      
      // Position the button
      menuBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      menuBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      menuBtn.top = "20px";
      menuBtn.left = "-20px";
      
      menuBtn.onPointerClickObservable.add(() => {
        console.log("Menu button clicked");
        //alert("clicked")
        this.onMenuRequested();
      });

      // Add to root container if not already done by createButtonStyle
      if (!menuBtn.parent) {
        this.guiTexture.addControl(menuBtn);
      }

    } catch (error) {
      console.error("Failed to create menu button:", error);
      throw error;
    }
  }

  async dispose() {
    if (this.guiTexture ) {
      this.guiTexture.dispose();
    }
  }
}