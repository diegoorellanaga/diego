

import { Mesh } from '@babylonjs/core';
import { configureWorldCamera } from '../../utils/LightAndCamera';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Vector3,StandardMaterial,MeshBuilder,CubeTexture,Texture, Color3,VertexBuffer,Material,TransformNode,Color4, Matrix,VideoTexture } from '@babylonjs/core';
import '@babylonjs/loaders/glTF'; // Import GLTF loader
import { FallingCubes } from './objects/FallingCubes';
import { FallingPanels } from './objects/FallingPanels';
class World1 {
    constructor(engine, scene, camera, lights) {
        this.scene = scene;
        this.camera = camera;
        this.lights = lights;
        this.meshes = []; // Track all created meshes
        this.fallingCubes = new FallingCubes(scene);
        // this.fallingPanels = new FallingPanels(scene,(clickedPanel, event) => {
        //     // This function will be called when a panel is clicked
        //     console.log("Panel clicked!", clickedPanel);
            
        //     // Example actions:
        //     // 1. Change panel color
        //     //clickedPanel.material.diffuseColor = new Color3(1, 0, 0); // Turns red
            
        //     // 2. Make the panel jump
        //     if (clickedPanel.physics) {
        //         clickedPanel.physics.isResting = false;
        //         clickedPanel.velocity.y = 1.0; // Makes it jump up
        //     }
            
        //     // 3. Remove the panel after delay
        //     setTimeout(() => {
        //         this.downloadPDF();
        //         clickedPanel.dispose();
        //        // this.panels = this.panels.filter(p => p !== clickedPanel);
        //     }, 1000);
        // });
        this.fallingPanels = new FallingPanels(scene, (clickedPanel, panelType, event) => {
          console.log(`${panelType.label} panel clicked!`, panelType.id);
          
          if (clickedPanel.physics) {
              clickedPanel.physics.isResting = false;
              clickedPanel.velocity.y = 1.0;
          }
          
          setTimeout(() => {
              // Call different functions based on panel type
              if (panelType.id === this.fallingPanels.panelTypes.RESUME.id) {
                  this.downloadPDF(1); // Resume PDF
              } else if (panelType.id === this.fallingPanels.panelTypes.REFERENCE.id) {
                  this.downloadPDF(2); // Reference PDF
              } else if (panelType.id === this.fallingPanels.panelTypes.IMG_1.id) {
                this.downloadPDF(3); // Reference PDF
            } else if (panelType.id === this.fallingPanels.panelTypes.IMG_2.id) {
              this.downloadPDF(4); // Reference PDF
          }
              
              clickedPanel.dispose();
          }, 1000);
      });

        this.configureEnvironment();
        this.setupWorld() 
      }
    
      configureEnvironment() {
        // World-specific camera setup
        configureWorldCamera(this.camera, {
          position: new Vector3(0, 25, -40),
          target: new Vector3(0, 5, 0),
          limits: {
            beta: [0.1, Math.PI / 2] // Vertical angle limits
          }
        });
        
        // World-specific light adjustments
        this.lights.sunLight.intensity = 0.8;
        this.lights.sunLight.position = new Vector3(30, 50, 30);
      }

   setupWorld() {
    try {
        this.configureEnvironment();
        
        // Create ground and store reference
       // const ground = Mesh.CreateGround("world2_ground", 10, 10, 2, this.scene);
       // this.meshes.push(ground);

        // for (let i = 0; i < 10; i++) {
        //     this.fallingCubes.createCube();
        // }

        // for (let i = 0; i < 8; i++) {
        //     this.fallingPanels.createPanel({
        //         width: 0.2,   // Thin
        //         height: 1.5,  // Tall
        //         depth: 1.0    // Wide
        //     });
        // }
        
        // Add other world objects here
        // const obj = new Mesh(...);
        // this.meshes.push(obj);
        this.loadGLBSkybox()
        this.loadTable()
        this.loadPilar()
        this.loadMonitor()
  
      } catch (error) {
        console.error("World2 setup failed:", error);
        throw error;
      }
  }

  async loadGLBSkybox() {
    try {
        // Load the GLB file
        const result = await SceneLoader.ImportMeshAsync(
            "", 
            "assets/models/", 
            "sky.glb", 
            this.scene
        );

        // Assuming the GLB contains a single mesh that's your skybox
        this.skybox = result.meshes[0];
     //   this.skybox.scaling = new Vector3(10, 10, 10); // Make it huge
        this.skybox.infiniteDistance = true;
        
        // Flip the normals if needed (so textures face inward)
        this.skybox.flipFaces(true);
        
        // Disable lighting on the skybox
        if (this.skybox.material) {
            this.skybox.material.disableLighting = true;
        }

        this.meshes.push(this.skybox);
    } catch (error) {
        console.error("Failed to load GLB skybox:", error);
        throw error;
    }
}


async loadTable() {
  try {
      // Load the table model
      const result = await SceneLoader.ImportMeshAsync(
          "", 
          "assets/models/", 
          "table.glb", 
          this.scene
      );

      this.table = result.meshes[0];
      
      // Scale the table up
      this.table.scaling = new Vector3(11.5, 11.5, 11.5);
      
      // Position the table lower on the Y axis
      this.table.position.y = -12;

      // Apply proper transparent material to all table meshes
      result.meshes.forEach(mesh => {
          if (mesh.material) {
              // For existing materials
              const material = mesh.material;
              material.alpha = 0.3; // Set transparency level
              material.transparencyMode = Material.MATERIAL_ALPHABLEND; // Proper blend mode
              material.backFaceCulling = false; // Often needed for transparency
              material.separateCullingPass = true; // Helps with rendering order
          } else {
              // Create new transparent material if none exists
              const transparentMaterial = new StandardMaterial("tableMaterial", this.scene);
              transparentMaterial.alpha = 0.3;
              transparentMaterial.transparencyMode = Material.MATERIAL_ALPHABLEND;
              transparentMaterial.backFaceCulling = false;
              transparentMaterial.separateCullingPass = true;
              
              // Preserve original colors if possible
              if (mesh.getVerticesData(VertexBuffer.ColorKind)) {
                  transparentMaterial.diffuseColor = new Color3(1, 1, 1);
              } else {
                  transparentMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);
              }
              
              mesh.material = transparentMaterial;
          }
          
          // Ensure proper rendering order
          mesh.alphaIndex = 1;
          mesh.hasVertexAlpha = true;
      });

      this.meshes.push(...result.meshes);
      
  } catch (error) {
      console.error("Failed to load table:", error);
      throw error;
  }
}


async loadPilar() {
  try {
      // Load the table model
      const result = await SceneLoader.ImportMeshAsync(
          "", 
          "assets/models/", 
          "onepilar.glb", 
          this.scene
      );

      this.pilar = result.meshes[0];
      
      // Scale the table up (adjust these values as needed)
      this.pilar.scaling = new Vector3(5, 5, 5);
      
      // Position the table lower on the Y axis
      this.pilar.position.y = -126; // Adjust this value to set how much lower
      

      this.meshes.push(...result.meshes);
      
  } catch (error) {
      console.error("Failed to load pilar:", error);
      throw error;
  }
}


async loadMonitor() {
  try {
      // Load monitor with center pivot
      const result = await SceneLoader.ImportMeshAsync(
          "", 
          "assets/models/", 
          "monitor.glb", 
          this.scene,
          undefined,
          undefined,
          undefined,
          undefined,
          true // This centers the pivot!
      );

      this.monitor = result.meshes[0];
      
      // 1. COMPLETE TRANSFORMATION RESET
      this.monitor.setPivotMatrix(Matrix.Identity()); // Reset pivot
      this.monitor.position = Vector3.Zero(); // Reset position
      this.monitor.rotation = Vector3.Zero(); // Reset rotation
      this.monitor.scaling = new Vector3(1, 1, 1); // Reset scale
      
      // 2. Apply fresh transformations (in correct order)
      this.monitor.scaling = new Vector3(6, 6, 6);
      this.monitor.position = new Vector3(-7, 0, 0);
      
      // 3. ROTATION - Try all methods until one works:
      
      // METHOD A: Direct Euler rotation
      this.monitor.rotation.y = Math.PI/2; // 30 degrees
      
      // METHOD C: Parent container approach (most reliable)
      if (!this.monitor.rotationQuaternion) {
          const container = new TransformNode("monitorContainer", this.scene);
          container.position.copyFrom(this.monitor.position);
          this.monitor.parent = container;
          this.monitor.position = Vector3.Zero();
          container.rotation.y = Math.PI/6;
          console.log("Using container rotation");
      }
      
      // 4. FORCE SCENE UPDATE
      this.scene.onAfterRenderObservable.addOnce(() => {
          this.monitor.computeWorldMatrix(true);
      });


     // Find the screen mesh - pure JS version
     const screenMesh = this.monitor.getChildren().find(function(mesh) {
      return mesh.name === "Plane.004" || mesh.name === "Plane.002";
  });

    if (screenMesh) {
        // Create video texture
        const videoTexture = new VideoTexture("monitorVideo", 
            process.env.PUBLIC_URL+"/assets/videos/video1.mp4",  // Update with your video path
            this.scene,
            false,                          // No audio
            true                            // Support transparency if needed
        );
        
        // Create material for screen
        const screenMaterial = new StandardMaterial("screenMaterial", this.scene);
        screenMaterial.diffuseTexture = videoTexture;
        screenMaterial.emissiveTexture = videoTexture; // Makes it glow
        screenMaterial.emissiveColor = new Color3(1, 1, 1);
        screenMaterial.specularColor = new Color3(0, 0, 0); // Remove reflections
        
        // Apply to screen mesh
        screenMesh.material = screenMaterial;
        
        // Play video (with slight delay to ensure texture is ready)
        setTimeout(() => {
            videoTexture.video.play();
            videoTexture.video.loop = true;
        }, 500);
    } 

      
      

      this.meshes.push(...result.meshes);
      
  } catch (error) {
      console.error("Monitor loading failed:", error);
      throw error;
  }
}

// Helper function to create visible axes
createDebugAxes(position) {
  const axisX = MeshBuilder.CreateLines("axisX", {
      points: [Vector3.Zero(), new Vector3(1, 0, 0)],
      colors: [new Color4(1,0,0,1), new Color4(1,0,0,1)]
  }, this.scene);
  
  const axisY = MeshBuilder.CreateLines("axisY", {
      points: [Vector3.Zero(), new Vector3(0, 1, 0)],
      colors: [new Color4(0,1,0,1), new Color4(0,1,0,1)]
  }, this.scene);
  
  const axisZ = MeshBuilder.CreateLines("axisZ", {
      points: [Vector3.Zero(), new Vector3(0, 0, 1)],
      colors: [new Color4(0,0,1,1), new Color4(0,0,1,1)]
  }, this.scene);
  
  const axes = new TransformNode("debugAxes", this.scene);
  axisX.parent = axes;
  axisY.parent = axes;
  axisZ.parent = axes;
  axes.position = position;
  
  return axes;
}



  update() {
    this.fallingPanels.update();
   // this.fallingCubes.update();
    // if (Math.random() < 0.02) { // 2% chance per frame
    //     this.fallingCubes.createCube();
    // }
    if (this.fallingPanels.panels.length<10 && Math.random() < 0.01) { // 1% chance per frame
        this.fallingPanels.createPanel();
    }


    // World-specific updates
  }

  async dispose() {
    try {
      // Dispose all world-specific meshes
      this.meshes.forEach(mesh => {
        if (mesh ) {
          mesh.dispose();
        }
      });
      this.meshes = [];
      
      // Reset camera if needed
      this.camera.position = new Vector3(0, 0, 0);
      this.fallingCubes.dispose();
      this.fallingPanels.dispose();
      
    } catch (error) {
      console.error("World2 disposal failed:", error);
    }
  }

  downloadPDF(document_type) {
    let pdfUrl;
    let name_file;

    if(document_type==1){
      name_file="resume.pdf"
      pdfUrl = process.env.PUBLIC_URL+'/assets/documents/resume.pdf';
    }else if(document_type==2){
       name_file="reference.pdf"
      pdfUrl = process.env.PUBLIC_URL+'/assets/documents/reference.pdf';
    }else if(document_type==3){
      name_file="img1.png"
     pdfUrl = process.env.PUBLIC_URL+'/assets/images/img1.png';
   }else if(document_type==4){
    name_file="img2.png"
   pdfUrl = process.env.PUBLIC_URL+'/assets/images/img2.png';
 }




  //  const pdfUrl = '/assets/documents/resume.pdf';
    fetch(pdfUrl)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = name_file;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up object URL
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
            
            // Log download event (optional)
            console.log('PDF downloaded');
        })
        .catch(error => {
            console.error('Download failed:', error);
            // Fallback to regular link
            window.open(pdfUrl, '_blank');
        });
}


}

export default World1;