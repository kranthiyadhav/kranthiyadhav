/**
 * Three.js 3D Interactive Cyber Constellation & Glowing Wireframe Scene
 * Burra Kirani - Python Full-Stack Developer Portfolio
 */

(function () {
  'use strict';

  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') {
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 85;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Mouse interaction state
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  // 1. Particle Constellation
  const particleCount = 750;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0xff1a40), // Bright Neon Red
    new THREE.Color(0xd90429), // Crimson
    new THREE.Color(0xef233c), // Vibrant Red
    new THREE.Color(0x800018), // Deep Ruby Red
    new THREE.Color(0xff6b81)  // Soft Rose Red Accent
  ];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Distributed in a sphere-like cyber cloud
    const radius = 60 + Math.random() * 80;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = (Math.random() - 0.5) * 100;

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = chosenColor.r;
    colors[i3 + 1] = chosenColor.g;
    colors[i3 + 2] = chosenColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Glowing particle texture generator
  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 26, 64, 0.8)');
    gradient.addColorStop(0.6, 'rgba(217, 4, 41, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  const particleMaterial = new THREE.PointsMaterial({
    size: 2.2,
    map: createParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleCloud = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleCloud);

  // 2. Central 3D Cyber Core (Wireframe Icosahedron & Inner glowing Sphere)
  const coreGroup = new THREE.Group();

  // Outer wireframe icosahedron
  const icoGeometry = new THREE.IcosahedronGeometry(22, 1);
  const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0xff1a40,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending
  });
  const wireframeIco = new THREE.Mesh(icoGeometry, icoMaterial);
  coreGroup.add(wireframeIco);

  // Floating geometric rings around core
  const torusGeo1 = new THREE.TorusGeometry(32, 0.25, 8, 64);
  const torusMat1 = new THREE.MeshBasicMaterial({
    color: 0xff0037,
    transparent: true,
    opacity: 0.3,
    wireframe: true
  });
  const ring1 = new THREE.Mesh(torusGeo1, torusMat1);
  ring1.rotation.x = Math.PI / 3;
  coreGroup.add(ring1);

  const torusGeo2 = new THREE.TorusGeometry(38, 0.2, 8, 64);
  const torusMat2 = new THREE.MeshBasicMaterial({
    color: 0x9b001f,
    transparent: true,
    opacity: 0.25,
    wireframe: true
  });
  const ring2 = new THREE.Mesh(torusGeo2, torusMat2);
  ring2.rotation.y = Math.PI / 4;
  coreGroup.add(ring2);

  // Inner pulsing core point
  const innerSphereGeo = new THREE.SphereGeometry(6, 16, 16);
  const innerSphereMat = new THREE.MeshBasicMaterial({
    color: 0xff3b5c,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
  coreGroup.add(innerSphere);

  // Position the 3D cyber core slightly off-center for visual balance behind the hero visual
  coreGroup.position.set(22, 5, -20);
  scene.add(coreGroup);

  // Track mouse coordinates for smooth parallax
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX - windowHalfX) * 0.05;
    mouseY = (e.clientY - windowHalfY) * 0.05;
  }, { passive: true });

  // Scroll effect
  let scrollY = 0;
  window.addEventListener('scroll', function () {
    scrollY = window.scrollY || window.pageYOffset;
  }, { passive: true });

  // Window resize handler
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, { passive: true });

  // Animation Loop with smooth damping
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia mouse tracking
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // Rotate particle cloud
    particleCloud.rotation.y = elapsedTime * 0.04 + targetX * 0.01;
    particleCloud.rotation.x = elapsedTime * 0.02 + targetY * 0.01;

    // Rotate 3D Cyber Core
    coreGroup.rotation.x = elapsedTime * 0.15 + targetY * 0.02;
    coreGroup.rotation.y = elapsedTime * 0.25 + targetX * 0.02;
    ring1.rotation.z = elapsedTime * 0.12;
    ring2.rotation.x = elapsedTime * 0.08;

    // Subtle scale pulsation for inner sphere
    const pulseScale = 1 + Math.sin(elapsedTime * 2) * 0.12;
    innerSphere.scale.set(pulseScale, pulseScale, pulseScale);

    // Parallax depth based on scroll position
    const scrollFactor = scrollY * 0.02;
    camera.position.y = -scrollFactor * 0.4;
    coreGroup.position.y = 5 - scrollFactor * 0.3;

    renderer.render(scene, camera);
  }

  animate();
})();
