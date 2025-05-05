

import { Mesh } from '@babylonjs/core';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { configureWorldCamera } from '../../utils/LightAndCamera';
import { Vector3, } from '@babylonjs/core';
import '@babylonjs/loaders/glTF'; // Import GLTF loader
class World3 {
    constructor(engine, scene, camera, lights) {
        this.scene = scene;
        this.camera = camera;
        this.lights = lights;
        this.meshes = []; // Track all created meshes
        
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
        const ground = Mesh.CreateGround("world2_ground", 1, 2, 2, this.scene);
        this.meshes.push(ground);
        this.loadGLBSkybox();
        // Add other world objects here
        // const obj = new Mesh(...);
        // this.meshes.push(obj);
  
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
            "spaceship.glb", 
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


  update() {
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
      
    } catch (error) {
      console.error("World2 disposal failed:", error);
    }
  }
}

export default World3;