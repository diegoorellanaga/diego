import { MeshBuilder, Vector3,Vector4, StandardMaterial, Texture, ActionManager, ExecuteCodeAction , Color3 } from '@babylonjs/core';

export class FallingPanels {
    constructor(scene,onClickCallback) {
        this.scene = scene;
        this.panels = [];
        this.onClickCallback = onClickCallback; 
        
        this.physics = {
            gravity: 0.03,          // Slower falling
            airResistance: 0.98,    // More air drag
            friction: 0.6,          // Less surface friction
            spinDamping: 0.95,      // How quickly rotation slows
            minSpeed: 0.22         // When to stop completely
        };

        // // Create shared material with texture
        // this.panelMaterial = new StandardMaterial("panelMaterial", this.scene);
        // const texturePaths = [
        //     process.env.PUBLIC_URL + "/assets/images/resume2.png", 
        //     process.env.PUBLIC_URL + "/assets/images/reference1.png", 
        //                  // If in same directory
        // ];
        
        // // // Test each path until one works
        //  this.panelMaterial.diffuseTexture = new Texture(texturePaths[0], this.scene);
        // // this.panelMaterial.specularColor = new Vector3(0.1, 0.1, 0.1);

        this.panelTypes = {
            RESUME: {
                id: 1,
                texturePath: process.env.PUBLIC_URL + "/assets/images/resume2.png",
                label: "Resume"
            },
            REFERENCE: {
                id: 2,
                texturePath: process.env.PUBLIC_URL + "/assets/images/reference2.png",
                label: "Reference"
            },
            IMG_1: {
                id: 3,
                texturePath: process.env.PUBLIC_URL + "/assets/images/img1.png",
                label: "img1"
            }
            ,
            IMG_2: {
                id: 4,
                texturePath: process.env.PUBLIC_URL + "/assets/images/img2.png",
                label: "img2"
            }
        };



    }

        // Class method to get random panel type
        // getRandomPanelType() {
        //     const types = Object.values(this.panelTypes);
        //     return types[Math.floor(Math.random() * types.length)];
        // }

        getRandomPanelType() {
            const weightedTypes = [
                this.panelTypes.RESUME,    // 1x weight
                this.panelTypes.RESUME,    // Extra entry = more likely
                this.panelTypes.RESUME, 
                this.panelTypes.RESUME, 
                this.panelTypes.REFERENCE,
                this.panelTypes.REFERENCE,
                this.panelTypes.IMG_1,
                this.panelTypes.IMG_2
            ];
            return weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
        }

    // createPanel(options = {}) { //Plane.002 -> Plane.004
    //     // Thin box dimensions (like a book)
    //     const width = options.width || 0.2;
    //     const height = options.height || 3;
    //     const depth = options.depth || 2.0;
        
    //     const panel = MeshBuilder.CreateBox("panel", { 
    //         width, 
    //         height, 
    //         depth,
    //         faceUV: this.getFaceUVOptions()  
    //     }, this.scene);

    //     panel.material = this.panelMaterial;
        
    //     // Starting position (above ground)
    //     panel.position = new Vector3(
    //        5+ (Math.random() - 0.5) * 10,
    //         25 + Math.random() * 5,
    //         (Math.random() - 0.5) * 10
    //     );
        
    //     // Initial velocity - slight horizontal movement
    //     panel.velocity = new Vector3(
    //         (Math.random() - 0.5) * 0.3,  // Gentle X push
    //         -0.2,                         // Downward push
    //         (Math.random() - 0.5) * 0.3   // Gentle Z push
    //     );
        
    //     // Physics properties
    //     panel.physics = {
    //         angularVelocity: new Vector3(
    //             (Math.random() - 0.5) * 0.2,  // Initial rotation X
    //             (Math.random() - 0.5) * 0.1,  // Rotation Y
    //             (Math.random() - 0.5) * 0.2   // Rotation Z
    //         ),
    //         isResting: false,
    //         dimensions: new Vector3(width, height, depth)
    //     };
    //     this.enablePanelClick(panel);
    //     this.panels.push(panel);
    //     return panel;
    // }
    

    createPanel(options = {}) {
        // Default to random type if not specified
        // const panelType = options.type || 
        //     (Math.random() > 0.5 ? this.panelTypes.RESUME : this.panelTypes.REFERENCE);

            const panelType = options.type || this.getRandomPanelType();

        const width = options.width || 0.2;
        const height = options.height || 3;
        const depth = options.depth || 2.0;
        
        const panel = MeshBuilder.CreateBox("panel", { 
            width, 
            height, 
            depth,
            faceUV: this.getFaceUVOptions()  
        }, this.scene);
    // 2. Create texture with error handling
    const texture = new Texture(panelType.texturePath, this.scene, false, false, Texture.BILINEAR_SAMPLINGMODE, null, () => {
        console.log("Texture loaded successfully!");
    }, (error) => {
        console.error("Texture failed to load:", error.message);
    });
     // 3. Create material with proper settings
     const panelMaterial = new StandardMaterial(`panelMaterial-${panelType.id}`, this.scene);
     panelMaterial.diffuseTexture = texture;
     
     // These settings help with visibility:
   //  panelMaterial.specularColor = new Color3(0, 0, 0); // Remove shininess
  //   panelMaterial.emissiveColor = new Color3(0.5, 0.5, 0.5); // Add self-illumination
   //  panelMaterial.disableLighting = true; // Make it fully visible regardless of scene lights
     
     panel.material = panelMaterial;
        
        // Store panel type information
        panel.panelType = panelType;
        
        // Starting position
        panel.position = new Vector3(
            5 + (Math.random() - 0.5) * 10,
            25 + Math.random() * 5,
            (Math.random() - 0.5) * 10
        );
        
        // Initial velocity
        panel.velocity = new Vector3(
            (Math.random() - 0.5) * 0.3,
            -0.2,
            (Math.random() - 0.5) * 0.3
        );
        
        // Physics properties
        panel.physics = {
            angularVelocity: new Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.2
            ),
            isResting: false,
            dimensions: new Vector3(width, height, depth)
        };
        
        this.enablePanelClick(panel);
        this.panels.push(panel);
        return panel;
    }

    // enablePanelClick(panel) {
    //     // Initialize action manager if it doesn't exist
    //     if (!this.scene.actionManager) {
    //         this.scene.actionManager = new ActionManager(this.scene);
    //     }
        
    //     panel.actionManager = new ActionManager(this.scene);
        
    //     panel.actionManager.registerAction(
    //         new ExecuteCodeAction(
    //             ActionManager.OnPickTrigger,
    //             (evt) => {
    //                 if (this.onClickCallback ) {
    //                     this.onClickCallback(panel, evt);
    //                 }
    //             }
    //         )
    //     );
        
    //     // Make sure the panel is pickable
    //     panel.isPickable = true;
    // }

    enablePanelClick(panel) {
        if (!this.scene.actionManager) {
            this.scene.actionManager = new ActionManager(this.scene);
        }
        
        panel.actionManager = new ActionManager(this.scene);
        
        panel.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger,
                (evt) => {
                    if (this.onClickCallback) {
                        // Pass both the panel and its type information
                        this.onClickCallback(panel, panel.panelType, evt);
                    }
                }
            )
        );
        
        panel.isPickable = true;
    }

    // Custom UV mapping for box faces
    getFaceUVOptions() {
        return [
            new Vector4(0, 0, 0, 0), // Back
            new Vector4(0, 0, 0, 0), // Front (we'll put texture here)
            new Vector4(0, 0, 0, 0), // Right
            new Vector4(0, 0, 1, 1), // Left
            new Vector4(0, 0, 0, 0), // Top
            new Vector4(0, 0, 0, 0)  // Bottom
        ];
    }


    update() {
        const { gravity, airResistance, friction, spinDamping, minSpeed } = this.physics;
        
        this.panels.forEach(panel => {
            if (panel.physics.isResting) return;
            
            // Apply forces
            panel.velocity.y -= gravity;
            
            // Air resistance affects horizontal movement more
            panel.velocity.x *= airResistance;
            panel.velocity.z *= airResistance;
            
            // Update position
            panel.position.addInPlace(panel.velocity);
            
            // Update rotation
            panel.rotation.addInPlace(panel.physics.angularVelocity);
            
            // Ground collision (simplified)
            if (panel.position.y < 0) {
                panel.position.y = 0;
                
                // Bounce effect depends on impact angle
                const impactStrength = Math.abs(panel.velocity.y);
                panel.velocity.y *= -0.3; // Weak bounce
                
                // Friction effect
                panel.velocity.x *= friction;
                panel.velocity.z *= friction;
                
                // Realistic book-like behavior
                if (impactStrength > 0.5) {
                    // If falling fast, add rotational kick
                    panel.physics.angularVelocity.addInPlace(
                        new Vector3(
                            (Math.random() - 0.5) * impactStrength * 0.1,
                            (Math.random() - 0.3) * impactStrength * 0.05,
                            (Math.random() - 0.5) * impactStrength * 0.1
                        )
                    );
                    
                    // Slide effect
                    panel.velocity.x += panel.velocity.y * (Math.random() - 0.5) * 0.2;
                    panel.velocity.z += panel.velocity.y * (Math.random() - 0.5) * 0.2;
                }
                
                // Check if should come to rest
                if (panel.velocity.length() < minSpeed && 
                    panel.physics.angularVelocity.length() < minSpeed) {
                    panel.velocity.setAll(0);
                    panel.physics.angularVelocity.setAll(0);
                    panel.physics.isResting = true;
                    
                    // // Make panel settle flat (align to ground)
                    // panel.rotation.x = Math.PI * Math.round(panel.rotation.x / Math.PI);
                    // panel.rotation.z = Math.PI * Math.round(panel.rotation.z / Math.PI);

    // Force flat orientation (lying on ground)
    panel.rotation.x = Math.PI;  // 90 degrees flat
    panel.rotation.z = Math.PI/2;          // No Z-rotation
    panel.rotation.y = 2*Math.PI/(1+Math.random()*5)//Math.PI * Math.round(panel.rotation.y / Math.PI); // Only keep Y rotation aligned to nearest 180°

                }
            }
        });
    }

    dispose() {
        this.panels.forEach(panel => panel.dispose());
        this.panels = [];
    }
}