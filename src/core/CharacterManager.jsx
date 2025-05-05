import { Mesh, Vector3 } from "@babylonjs/core";

class CharacterManager {
  constructor(scene,camera, lights) {  // Accept scene as a parameter
    this.scene = scene;
    this.camera = camera;
    this.lights = lights;
    this.playerMesh = null;
  }

  spawnPlayer(level) {

    let position;
    if(level==1){
      position = new Vector3(10,-110,10)
    }else{
      position = new Vector3(0,0,0)
    }

    this.playerMesh = Mesh.CreateSphere("player", 16, 2, this.scene); // Use stored scene
    this.playerMesh.position = position;
  }

  update() {
    // Handle player movement, collisions, etc.
  }
}

export default CharacterManager;