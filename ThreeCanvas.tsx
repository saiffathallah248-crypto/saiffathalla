import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const IMAGE_SOURCES = [
  '/images/saif-hero.png',
  '/images/cyberlearn89.png',
  '/images/secureshare-dashboard.png',
  '/images/rotaract-golf-madinaty.png',
  '/images/liveapi.png',
  '/images/constructio.png',
  '/images/deloitte-cyber.png',
  '/images/deloitte-data.png',
  '/images/ey-risk.png',
  '/images/telstra-cyber.png',
  '/images/sap.png',
  '/images/cisco-cpp.png',
];

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!canvasRef.current || cleanupRef.current) return;

    const container = canvasRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 200 : 400;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Texture loading
    const textureLoader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];
    let texturesLoaded = 0;

    IMAGE_SOURCES.forEach((src) => {
      const tex = textureLoader.load(src, () => {
        texturesLoaded++;
      });
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      textures.push(tex);
    });

    // Particle geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // UV offsets and texture indices
    const uvOffsets = new Float32Array(particleCount * 2);
    const textureIndices = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      uvOffsets[i * 2] = Math.random() * 0.5;
      uvOffsets[i * 2 + 1] = Math.random() * 0.5;
      textureIndices[i] = Math.floor(Math.random() * Math.min(textures.length, 5));
    }

    geometry.setAttribute('uvOffset', new THREE.InstancedBufferAttribute(uvOffsets, 2));
    geometry.setAttribute('textureIndex', new THREE.InstancedBufferAttribute(textureIndices, 1));

    // Shader uniforms
    const shaderUniforms: Record<string, THREE.IUniform> = {
      time: { value: 0 },
      mouse: { value: new THREE.Vector3(9999, 9999, 0) },
      mouseActive: { value: 0.0 },
      texture1: { value: textures[0] || null },
      texture2: { value: textures[1] || null },
      tTransition: { value: 0 },
      uTint: { value: new THREE.Color('#C8A45C') },
      uTintStrength: { value: 0.15 },
    };

    // Material with shader injection
    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: false,
      transparent: true,
      opacity: 0.9,
      alphaTest: 0.1,
      depthWrite: false,
    });

    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, shaderUniforms);

      // Vertex shader prefix
      shader.vertexShader =
        `uniform float time;
uniform vec3 mouse;
uniform float mouseActive;
varying vec2 vUv;
attribute vec2 uvOffset;
attribute float textureIndex;
varying float vTextureIndex;
` + shader.vertexShader;

      // Replace vertex main
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `void main() {
  vUv = uvOffset + uv * 0.5;
  vTextureIndex = textureIndex;
  vec3 pos = position;
  float dist = length(mouse.xy - pos.xy);
  float influence = smoothstep(3.0, 0.0, dist) * mouseActive;
  pos.z += sin(dist * 2.0 - time * 3.0) * influence * 2.0;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
`
      );

      // Fragment shader prefix
      shader.fragmentShader =
        `uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float tTransition;
uniform vec3 uTint;
uniform float uTintStrength;
varying vec2 vUv;
varying float vTextureIndex;
` + shader.fragmentShader;

      // Replace texture sampling
      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 texColor = texture2D(map, vUv);',
        `vec4 texColor;
if (vTextureIndex < 0.5) {
  texColor = texture2D(texture1, vUv);
} else if (vTextureIndex < 1.5) {
  texColor = texture2D(texture2, vUv);
} else if (vTextureIndex < 2.5) {
  texColor = texture2D(texture1, vUv + vec2(0.5, 0.0));
} else if (vTextureIndex < 3.5) {
  texColor = texture2D(texture2, vUv + vec2(0.5, 0.0));
} else {
  texColor = texture2D(texture1, vUv + vec2(0.0, 0.5));
}
texColor.rgb = mix(texColor.rgb, uTint, uTintStrength);
`
      );
    };

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Morph functions
    function morphToGrid(duration = 2) {
      const targetPositions = new Float32Array(particleCount * 3);
      const side = Math.ceil(Math.cbrt(particleCount));
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = i % side;
        const y = Math.floor((i / side) % side);
        const z = Math.floor(i / (side * side));
        targetPositions[i3] = (x - side / 2) * 1.5;
        targetPositions[i3 + 1] = (y - side / 2) * 1.5;
        targetPositions[i3 + 2] = (z - side / 2) * 1.5;
      }
      gsap.to(positions, {
        duration,
        endArray: Array.from(targetPositions),
        ease: 'power2.inOut',
        onUpdate: () => {
          geometry.attributes.position.needsUpdate = true;
        },
      });
    }

    function morphToSphere(duration = 2) {
      const targetPositions = new Float32Array(particleCount * 3);
      const radius = 8;
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const y = 1 - (i / (particleCount - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y) * radius;
        const theta = phi * i;
        targetPositions[i3] = Math.cos(theta) * radiusAtY;
        targetPositions[i3 + 1] = y * radius;
        targetPositions[i3 + 2] = Math.sin(theta) * radiusAtY;
      }
      gsap.to(positions, {
        duration,
        endArray: Array.from(targetPositions),
        ease: 'power2.inOut',
        onUpdate: () => {
          geometry.attributes.position.needsUpdate = true;
        },
      });
    }

    function morphToWave(duration = 2) {
      const targetPositions = new Float32Array(particleCount * 3);
      const cols = 20;
      const rows = Math.ceil(particleCount / cols);
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = (i % cols) - cols / 2;
        const z = Math.floor(i / cols) - rows / 2;
        const y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;
        targetPositions[i3] = x * 1.2;
        targetPositions[i3 + 1] = y;
        targetPositions[i3 + 2] = z * 1.2;
      }
      gsap.to(positions, {
        duration,
        endArray: Array.from(targetPositions),
        ease: 'power2.inOut',
        onUpdate: () => {
          geometry.attributes.position.needsUpdate = true;
        },
      });
    }

    // Morph cycle
    let delayedCalls: gsap.core.Tween[] = [];

    function startMorphCycle() {
      if (prefersReducedMotion) return;

      morphToSphere(2);
      const dc1 = gsap.delayedCall(3, () => {
        morphToWave(2);
        const dc2 = gsap.delayedCall(2.5, () => {
          morphToGrid(2);
          const dc3 = gsap.delayedCall(2.5, () => {
            startMorphCycle();
          });
          delayedCalls.push(dc3);
        });
        delayedCalls.push(dc2);
      });
      delayedCalls.push(dc1);
    }

    startMorphCycle();

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();
    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const planeIntersectPoint = new THREE.Vector3();

    function onMouseMove(event: MouseEvent) {
      if (prefersReducedMotion) return;
      mouseVec.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseVec.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseVec, camera);
      raycaster.ray.intersectPlane(interactionPlane, planeIntersectPoint);
      if (planeIntersectPoint) {
        (shaderUniforms.mouse.value as THREE.Vector3).copy(planeIntersectPoint);
        (shaderUniforms.mouseActive.value as number) = 1.0;
      }
    }

    function onMouseLeave() {
      (shaderUniforms.mouseActive.value as number) = 0.0;
    }

    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseleave', onMouseLeave);
    }

    // Resize handler
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    // Animation loop
    let animFrameId: number;
    function animate() {
      animFrameId = requestAnimationFrame(animate);
      if (!prefersReducedMotion) {
        (shaderUniforms.time.value as number) = performance.now() * 0.001;
      }
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    cleanupRef.current = () => {
      cancelAnimationFrame(animFrameId);
      gsap.killTweensOf(positions);
      delayedCalls.forEach((dc) => dc.kill());
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
