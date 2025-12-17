<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
  import { viewerStore } from '../stores/viewer';
  import { themeStore, type Theme } from '../stores/theme';
  import LoadingOverlay from './LoadingOverlay.svelte';
  
  interface Props {
    modelUrl: string;
    onLoad?: () => void;
  }
  
  let { modelUrl, onLoad }: Props = $props();
  
  let containerRef: HTMLDivElement;
  let canvasRef: HTMLCanvasElement;
  
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;
  let model: THREE.Object3D | null = null;
  let spotLight: THREE.SpotLight;
  let gridHelper: THREE.GridHelper;
  let animationId: number;
  let initialized = false;
  
  let isLoading = $state(true);
  let loadProgress = $state(0);
  let loadError = $state<string | null>(null);
  let currentTheme = $state<Theme>('light');
  
  // Subscribe to theme store
  themeStore.subscribe(t => {
    currentTheme = t;
    updateSceneTheme();
  });
  
  // Subscribe to viewer store
  let viewerState = $state({
    autoRotate: true,
    showGrid: true,
    lightRotation: 0,
    environmentPreset: 'studio' as const,
  });
  
  const unsubscribe = viewerStore.subscribe(state => {
    viewerState = state;
    updateViewerSettings();
  });
  
  function getThemeColors() {
    if (currentTheme === 'dark') {
      return {
        background: 0x1a1612,
        grid1: 0x3d342a,
        grid2: 0x2a241e,
        ambient: 0xfff8f0,
        ambientIntensity: 0.25,
      };
    }
    return {
      background: 0xf5efe4,
      grid1: 0xd4c4a8,
      grid2: 0xe8dcc8,
      ambient: 0xfff8f0,
      ambientIntensity: 0.4,
    };
  }
  
  function updateSceneTheme() {
    if (!scene || !gridHelper) return;
    
    const colors = getThemeColors();
    scene.background = new THREE.Color(colors.background);
    
    // Recreate grid with new colors
    scene.remove(gridHelper);
    gridHelper = new THREE.GridHelper(10, 20, colors.grid1, colors.grid2);
    gridHelper.visible = viewerState.showGrid;
    scene.add(gridHelper);
  }
  
  function updateViewerSettings() {
    if (!scene) return;
    
    // Update controls
    if (controls) {
      controls.autoRotate = viewerState.autoRotate;
    }
    
    // Update grid visibility
    if (gridHelper) {
      gridHelper.visible = viewerState.showGrid;
    }
    
    // Update spotlight position based on rotation
    if (spotLight) {
      const angle = (viewerState.lightRotation * Math.PI) / 180;
      const radius = 5;
      spotLight.position.x = Math.cos(angle) * radius;
      spotLight.position.z = Math.sin(angle) * radius;
    }
  }
  
  async function initScene() {
    if (!containerRef || !canvasRef) return;
    
    const colors = getThemeColors();
    
    // Create scene with theme-aware background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
      45,
      containerRef.clientWidth / containerRef.clientHeight,
      0.1,
      1000
    );
    camera.position.set(3, 2, 3);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(containerRef.clientWidth, containerRef.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    
    // Create controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = viewerState.autoRotate;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 1;
    controls.maxDistance = 20;
    controls.target.set(0, 0, 0);
    
    // Setup lighting
    setupLighting();
    
    // Create grid with theme colors
    gridHelper = new THREE.GridHelper(10, 20, colors.grid1, colors.grid2);
    gridHelper.visible = viewerState.showGrid;
    scene.add(gridHelper);
    
    initialized = true;
    
    // Load model or create placeholder
    await loadModel();
    
    // Start animation loop
    animate();
    
    // Handle resize
    window.addEventListener('resize', handleResize);
  }
  
  function setupLighting() {
    const colors = getThemeColors();
    
    // Warm ambient light
    const ambientLight = new THREE.AmbientLight(colors.ambient, colors.ambientIntensity);
    scene.add(ambientLight);
    
    // Main directional light (warm sunlight)
    const directionalLight = new THREE.DirectionalLight(0xfff5e6, 0.9);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Spotlight for surface inspection (user-controllable)
    spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 5, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.castShadow = true;
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);
    
    // Fill light (warm bronze tint)
    const fillLight = new THREE.DirectionalLight(0xd4a574, 0.35);
    fillLight.position.set(-5, 2, -5);
    scene.add(fillLight);
    
    // Rim light (golden accent)
    const rimLight = new THREE.DirectionalLight(0xdaa520, 0.4);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);
    
    // Hemisphere light for natural museum-like bounce
    const hemiLight = new THREE.HemisphereLight(0xfff8f0, 0xd4c4a8, 0.5);
    scene.add(hemiLight);
  }
  
  function createPlaceholderCoin() {
    // Create a coin-like placeholder using basic geometry
    const group = new THREE.Group();
    
    // Coin body (cylinder) - bronze/gold appearance
    const coinGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 64);
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: 0xb8860b, // Gold/bronze color
      metalness: 0.7,
      roughness: 0.35,
    });
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.rotation.x = Math.PI / 2; // Lay flat
    coin.castShadow = true;
    coin.receiveShadow = true;
    group.add(coin);
    
    // Add edge ring for detail
    const edgeGeometry = new THREE.TorusGeometry(0.95, 0.03, 8, 64);
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xa67c52,
      metalness: 0.8,
      roughness: 0.25,
    });
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge.rotation.x = Math.PI / 2;
    edge.position.z = 0.05;
    group.add(edge);
    
    // Add a simple star pattern on the surface
    const starShape = new THREE.Shape();
    const outerRadius = 0.4;
    const innerRadius = 0.2;
    const points = 5;
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      if (i === 0) {
        starShape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      } else {
        starShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
    }
    starShape.closePath();
    
    const starGeometry = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.02,
      bevelEnabled: false,
    });
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xdaa520,
      metalness: 0.6,
      roughness: 0.4,
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.rotation.x = -Math.PI / 2;
    star.position.z = 0.06;
    group.add(star);
    
    return group;
  }
  
  async function loadModel() {
    if (!initialized || !scene) return;
    
    isLoading = true;
    loadProgress = 0;
    loadError = null;
    viewerStore.setModelLoading(true, 0);
    
    // Setup DRACO loader for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    
    try {
      // Load from network
      const gltf = await new Promise<any>((resolve, reject) => {
        gltfLoader.load(
          modelUrl,
          resolve,
          (progress) => {
            if (progress.lengthComputable) {
              loadProgress = (progress.loaded / progress.total) * 100;
              viewerStore.setModelLoading(true, loadProgress);
            }
          },
          reject
        );
      });
      
      // Remove old model if exists
      if (model) {
        scene.remove(model);
        disposeObject(model);
      }
      
      model = gltf.scene;
      
      // Center and scale the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      model.scale.setScalar(scale);
      
      model.position.sub(center.multiplyScalar(scale));
      model.position.y -= (box.min.y * scale);
      
      // Enable shadows on all meshes
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Enhance materials for better rendering
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => enhanceMaterial(mat));
            } else {
              enhanceMaterial(child.material);
            }
          }
        }
      });
      
      scene.add(model);
      
      // Focus camera on model
      controls.target.copy(new THREE.Vector3(0, size.y * scale / 2, 0));
      controls.update();
      
      onLoad?.();
    } catch (error) {
      console.warn('Failed to load model, using placeholder:', error);
      loadError = 'Model not available - showing placeholder';
      
      // Remove old model if exists
      if (model) {
        scene.remove(model);
        disposeObject(model);
      }
      
      // Create and add placeholder coin
      model = createPlaceholderCoin();
      scene.add(model);
      
      // Focus camera on placeholder
      controls.target.set(0, 0, 0);
      controls.update();
    } finally {
      isLoading = false;
      viewerStore.setModelLoading(false, 100);
    }
  }
  
  function enhanceMaterial(material: THREE.Material) {
    if (material instanceof THREE.MeshStandardMaterial) {
      material.envMapIntensity = 0.8;
      material.needsUpdate = true;
    }
  }
  
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (controls && renderer && scene && camera) {
      controls.update();
      renderer.render(scene, camera);
    }
  }
  
  function handleResize() {
    if (!containerRef || !camera || !renderer) return;
    
    const width = containerRef.clientWidth;
    const height = containerRef.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
  }
  
  function disposeObject(obj: THREE.Object3D) {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material?.dispose();
        }
      }
    });
  }
  
  export function resetCamera() {
    if (!controls || !camera) return;
    
    camera.position.set(3, 2, 3);
    controls.target.set(0, 0.5, 0);
    controls.update();
  }
  
  onMount(() => {
    initScene();
  });
  
  onDestroy(() => {
    unsubscribe();
    
    window.removeEventListener('resize', handleResize);
    
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    if (model) {
      disposeObject(model);
    }
    
    renderer?.dispose();
    controls?.dispose();
  });
</script>

<div bind:this={containerRef} class="relative w-full h-full min-h-[400px] bg-[var(--viewer-bg)] rounded-lg overflow-hidden transition-colors">
  <canvas bind:this={canvasRef} class="viewer-canvas"></canvas>
  
  {#if isLoading}
    <LoadingOverlay progress={loadProgress} message="Preparing artifact view..." />
  {/if}
  
  {#if loadError}
    <div class="absolute top-3 right-3 px-4 py-2 bg-[var(--bg-panel)]/95 border border-[var(--border-primary)] rounded-full 
                text-xs text-[var(--text-muted)] shadow-sm transition-colors" style="font-family: 'Crimson Text', Georgia, serif;">
      {loadError}
    </div>
  {/if}
  
  <!-- Viewer Info Overlay -->
  <div class="absolute top-4 left-4 text-xs text-[var(--text-muted)] space-y-1.5 pointer-events-none transition-colors">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[var(--accent-gold)]"></span>
      <span style="font-family: 'Crimson Text', Georgia, serif;">Drag to rotate</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[var(--accent-bronze)]"></span>
      <span style="font-family: 'Crimson Text', Georgia, serif;">Scroll to zoom</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[var(--accent-olive)]"></span>
      <span style="font-family: 'Crimson Text', Georgia, serif;">Right-click to pan</span>
    </div>
  </div>
</div>
