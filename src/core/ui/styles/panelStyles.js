import { Rectangle,Control } from "@babylonjs/gui";

export const createPanelStyle = (guiTexture, options = {}) => {
    const panel = new Rectangle("panel");
    panel.width = options.width || 0.5;
    panel.height = options.height || "300px";
    panel.color = options.color || "white";
    panel.thickness = options.thickness || 2;
    panel.background = options.background || "rgba(0, 0, 0, 0.7)";
    panel.cornerRadius = options.cornerRadius || 10;
    panel.verticalAlignment = options.verticalAlignment || Control.VERTICAL_ALIGNMENT_CENTER;
    panel.horizontalAlignment = options.horizontalAlignment || Control.HORIZONTAL_ALIGNMENT_CENTER;
    
    return panel;
  };