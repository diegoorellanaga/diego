import { MeshBuilder, Vector3 } from '@babylonjs/core';

export class FallingCubes {
    constructor(scene) {
        this.scene = scene;
        this.cubes = [];
        this.groundSize = 10; // Should match your ground size
    }

    createCube() {
        const cube = MeshBuilder.CreateBox("fallingCube", { size: 0.5 }, this.scene);
        
        // Random position above the ground
        cube.position = new Vector3(
            (Math.random() - 0.5) * this.groundSize,
            20,
            (Math.random() - 0.5) * this.groundSize
        );
        
        // Random velocity
        cube.velocity = new Vector3(
            (Math.random() - 0.5) * 0.1,
            0,
            (Math.random() - 0.5) * 0.1
        );
        
        this.cubes.push(cube);
        return cube;
    }

    update() {
        const gravity = 0.05;
        const groundY = 0; // Ground level
        
        this.cubes.forEach(cube => {
            // Apply physics
            cube.velocity.y -= gravity;
            cube.position.addInPlace(cube.velocity);
            
            // Ground collision
            if (cube.position.y < groundY) {
                cube.position.y = groundY;
                cube.velocity.y *= -0.4; // Bounce with energy loss
                
                // Remove cube if it's barely moving
                if (Math.abs(cube.velocity.y) < 0.1) {
                    cube.velocity.y = 0;
                }
            }
        });
    }

    dispose() {
        this.cubes.forEach(cube => cube.dispose());
        this.cubes = [];
    }
}