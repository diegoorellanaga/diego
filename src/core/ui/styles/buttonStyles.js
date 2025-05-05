
import { Button } from "@babylonjs/gui";
export const createButtonStyle = (guiTexture, name, text, options = {}) => {
    const button = Button.CreateSimpleButton(name, text);
    button.width = options.width || "200px";
    button.height = options.height || "40px";
    button.color = options.color || "white";
    button.background = options.background || "rgba(0, 0, 0, 0.5)";
    button.thickness = options.thickness || 1;
    button.cornerRadius = options.cornerRadius || 5;
    
    // Hover effects
    button.onPointerEnterObservable.add(() => {
      button.background = options.hoverBackground || "rgba(50, 50, 50, 0.8)";
    });
    
    button.onPointerOutObservable.add(() => {
      button.background = options.background || "rgba(0, 0, 0, 0.5)";
    });
  
    return button;
  };