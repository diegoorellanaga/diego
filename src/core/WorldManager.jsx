import World1 from "../worlds/world1";
import World2 from "../worlds/world2";
import World3 from "../worlds/world3";

class WorldManager {
    constructor(engine, scene,camera, lights) {
      this.engine = engine;
      this.scene = scene;
      this.camera = camera;
      this.lights = lights;
    }
  
    async loadWorld(worldId) {
      // Clean up previous world if exists
      // Clean up previous world
      if (this.currentWorld) {
        await this.currentWorld.dispose();
        this.currentWorld = null;
      }

      // Clear scene (remove all meshes except camera and lights)
      this.scene.meshes.forEach(mesh => {
        if (mesh !== this.camera ) {
          mesh.dispose();
        }
      });
      switch (worldId) {
        case 1:
            this.currentWorld = new World1(this.engine, this.scene, this.camera, this.lights);
          break;
          case 2:
            this.currentWorld = new World2(this.engine, this.scene, this.camera, this.lights);
          break;
          case 3:
            this.currentWorld = new World3(this.engine, this.scene, this.camera, this.lights);
          break;


        default:
          throw new Error(`World ${worldId} not found`);
      }


    }
  
    update() {
      if (this.currentWorld) {
        this.currentWorld.update();
      }
    }
  }
  
  export default WorldManager;