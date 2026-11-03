import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SignalCoreProps {
  className?: string;
  isCompact?: boolean;
}

export const SignalCore: React.FC<SignalCoreProps> = ({
  className = 'w-full h-full min-h-[420px]',
  isCompact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (isCompact ? 300 : 500);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(isCompact ? 42 : 38, width / height, 0.1, 1000);
    camera.position.set(0, 0, isCompact ? 16 : 15);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio Lighting matching #111817 dark atmosphere
    const ambientLight = new THREE.AmbientLight(0x111c19, 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x8baf9f, 3.6);
    keyLight.position.set(7, 9, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x245b56, 5.0);
    rimLight.position.set(-9, -5, -7);
    scene.add(rimLight);

    const copperLight = new THREE.PointLight(0xc98845, 4.5, 20);
    copperLight.position.set(2.2, 1.8, 3.5);
    scene.add(copperLight);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Materials based on SanketOne tokens
    const tealCeramicMat = new THREE.MeshPhongMaterial({
      color: 0x245b56,
      specular: 0x638f7e,
      shininess: 65,
      flatShading: false,
    });

    const darkBrushedMetalMat = new THREE.MeshPhongMaterial({
      color: 0x161d1c,
      specular: 0x52665c,
      shininess: 95,
    });

    const sageTranslucentMat = new THREE.MeshPhongMaterial({
      color: 0x638f7e,
      specular: 0xd6e5df,
      shininess: 70,
      transparent: true,
      opacity: 0.72,
    });

    const copperMat = new THREE.MeshPhongMaterial({
      color: 0xc98845,
      specular: 0xf1f4ef,
      shininess: 100,
    });

    const orbitLineMat = new THREE.LineBasicMaterial({
      color: 0x3a4a43,
      transparent: true,
      opacity: 0.55,
    });

    const activeSignalLineMat = new THREE.LineBasicMaterial({
      color: 0x8baf9f,
      transparent: true,
      opacity: 0.85,
    });

    // Central Sculptural Anchor
    const coreGeom = new THREE.IcosahedronGeometry(isCompact ? 1.4 : 1.8, 1);
    const centralMesh = new THREE.Mesh(coreGeom, tealCeramicMat);
    masterGroup.add(centralMesh);

    // Internal wireframe lattice cage
    const innerCageGeom = new THREE.OctahedronGeometry(isCompact ? 1.8 : 2.3, 0);
    const innerCageMat = new THREE.MeshBasicMaterial({
      color: 0x3e7567,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const innerCage = new THREE.Mesh(innerCageGeom, innerCageMat);
    masterGroup.add(innerCage);

    // Architectural Concentric Signal Rings
    const scaleFactor = isCompact ? 0.8 : 1.0;

    const ringGeom1 = new THREE.TorusGeometry(3.6 * scaleFactor, 0.05, 16, 120);
    const ring1 = new THREE.Mesh(ringGeom1, darkBrushedMetalMat);
    ring1.rotation.x = Math.PI / 2.25;
    ring1.rotation.y = 0.3;
    masterGroup.add(ring1);

    const ringGeom2 = new THREE.TorusGeometry(4.8 * scaleFactor, 0.038, 16, 140);
    const ring2 = new THREE.Mesh(ringGeom2, sageTranslucentMat);
    ring2.rotation.x = Math.PI / 1.65;
    ring2.rotation.y = -0.35;
    masterGroup.add(ring2);

    const ringGeom3 = new THREE.TorusGeometry(6.0 * scaleFactor, 0.025, 16, 160);
    const ring3 = new THREE.Mesh(ringGeom3, orbitLineMat);
    ring3.rotation.x = Math.PI / 3.2;
    ring3.rotation.z = 0.4;
    masterGroup.add(ring3);

    // Dynamic signal node beacons
    const nodePositions = [
      { pos: new THREE.Vector3(2.6, 1.8, 1.4).multiplyScalar(scaleFactor), type: 'copper', scale: 0.35 },
      { pos: new THREE.Vector3(-3.0, 1.2, -0.9).multiplyScalar(scaleFactor), type: 'teal', scale: 0.28 },
      { pos: new THREE.Vector3(2.1, -2.5, 1.6).multiplyScalar(scaleFactor), type: 'sage', scale: 0.30 },
      { pos: new THREE.Vector3(-3.4, -1.8, 1.2).multiplyScalar(scaleFactor), type: 'dark', scale: 0.24 },
      { pos: new THREE.Vector3(0.5, 3.6, -1.6).multiplyScalar(scaleFactor), type: 'teal', scale: 0.26 },
      { pos: new THREE.Vector3(-1.6, 2.9, 1.9).multiplyScalar(scaleFactor), type: 'sage', scale: 0.27 },
      { pos: new THREE.Vector3(3.8, -0.8, -1.4).multiplyScalar(scaleFactor), type: 'dark', scale: 0.25 },
    ];

    nodePositions.forEach((nd) => {
      let mat = tealCeramicMat;
      if (nd.type === 'copper') mat = copperMat;
      else if (nd.type === 'sage') mat = sageTranslucentMat;
      else if (nd.type === 'dark') mat = darkBrushedMetalMat;

      const spGeom = new THREE.SphereGeometry(nd.scale * scaleFactor, 24, 24);
      const mesh = new THREE.Mesh(spGeom, mat);
      mesh.position.copy(nd.pos);
      masterGroup.add(mesh);

      const pts = [new THREE.Vector3(0, 0, 0), nd.pos];
      const lGeom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(lGeom, nd.type === 'copper' ? activeSignalLineMat : orbitLineMat);
      masterGroup.add(line);
    });

    // Ambient data particles
    const pCount = isCompact ? 35 : 55;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const r = (2.4 + Math.random() * 4.2) * scaleFactor;
      const phi = (Math.random() - 0.5) * Math.PI * 0.85;
      pPos[i] = r * Math.cos(theta) * Math.cos(phi);
      pPos[i + 1] = r * Math.sin(phi);
      pPos[i + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x8baf9f,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(pGeom, pMat);
    masterGroup.add(particles);

    // Mouse reaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = normX * 0.35;
      targetY = normY * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || (isCompact ? 300 : 500);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Viewport intersection observer to pause WebGL rendering when scrolled offscreen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      masterGroup.rotation.y = t * 0.11 + mouseX;
      masterGroup.rotation.x = Math.sin(t * 0.09) * 0.07 + mouseY;

      const s = 1.0 + Math.sin(t * 1.3) * 0.022;
      centralMesh.scale.set(s, s, s);

      ring1.rotation.z = t * 0.07;
      ring2.rotation.z = -t * 0.05;
      ring3.rotation.z = t * 0.035;
      particles.rotation.y = -t * 0.04;

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [isCompact]);

  return <div ref={containerRef} className={className} />;
};

