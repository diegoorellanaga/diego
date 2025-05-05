import { 
    ArcRotateCamera, 
    Vector3, 
    HemisphericLight, 
    DirectionalLight,
    ShadowGenerator,
    FollowCamera
  } from '@babylonjs/core';
  
  // Camera Presets
  export const createArcRotateCamera = (scene, canvas, options = {}) => {
    const {
      alpha = -Math.PI / 2,
      beta = Math.PI / 2.5,
      radius = 10,
      target = Vector3.Zero(),
      lowerRadiusLimit = 5,
      upperRadiusLimit = 50,
      position = new Vector3(0, 15, -20)
    } = options;
  
    const camera = new ArcRotateCamera(
      "camera",
      alpha,
      beta,
      radius,
      target,
      scene
    );
  
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = lowerRadiusLimit;
    camera.upperRadiusLimit = upperRadiusLimit;
    camera.minZ = 0.1;
    camera.wheelPrecision = 50;
    camera.position = position;
  
    scene.activeCamera = camera;
    return camera;
  };
  
  // Light Presets
  export const createBasicLights = (scene) => {
    // Ambient light
    const ambientLight = new HemisphericLight(
      "ambientLight", 
      new Vector3(0, 1, 0), 
      scene
    );
    ambientLight.intensity = 0.5;
  
    // Directional light (sun)
    const sunLight = new DirectionalLight(
      "sunLight", 
      new Vector3(-1, -2, -1), 
      scene
    );
    sunLight.position = new Vector3(20, 40, 20);
    sunLight.intensity = 0.8;
    
    // Shadows
    const shadowGenerator = new ShadowGenerator(1024, sunLight);
    shadowGenerator.useBlurVarianceShadowMap = true;
    shadowGenerator.blurScale = 2;
  
    return {
      ambientLight,
      sunLight,
      shadowGenerator
    };
  };
  
  // Character Follow Camera
  export const setupFollowCamera = (scene, canvas, targetMesh, options = {}) => {
    const {
      radius = 5,
      heightOffset = 2,
      rotationOffset = 0,
      cameraAcceleration = 0.05
    } = options;
  
    const camera = new FollowCamera(
      "followCam",
      new Vector3(0, heightOffset, -radius),
      scene
    );
    
    camera.radius = radius;
    camera.heightOffset = heightOffset;
    camera.rotationOffset = rotationOffset;
    camera.cameraAcceleration = cameraAcceleration;
    camera.lockedTarget = targetMesh;
    camera.attachControl(canvas, true);
  
    scene.activeCamera = camera;
    return camera;
  };
  
  // World-Specific Camera Adjustments
  export const configureWorldCamera = (camera, config) => {
    if (config.position) camera.position = config.position;
    if (config.target) camera.setTarget(config.target);
    if (config.limits) {
      if (config.limits.alpha) camera.lowerAlphaLimit = config.limits.alpha[0];
      if (config.limits.beta) camera.lowerBetaLimit = config.limits.beta[0];
      if (config.limits.radius) camera.lowerRadiusLimit = config.limits.radius[0];
    }
  };