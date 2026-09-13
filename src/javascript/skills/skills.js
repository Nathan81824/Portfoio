import * as THREE from "three";

const getThemeColor = (variable, fallback) => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();

  return new THREE.Color(value || fallback);
};

const randomCharacter = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

  return characters[
    Math.floor(Math.random() * characters.length)
  ];
};

const createSkillsScene = (container) => {
  if (!container) {
    return () => {};
  }

  // ==========================================
  // THEME
  // ==========================================

  const accentPrimary = getThemeColor(
    "--accent-primary",
    "#ff9f00"
  );

  const accentSecondary = getThemeColor(
    "--accent-secondary",
    "#ff8a00"
  );

  const accentHover = getThemeColor(
    "--accent-hover",
    "#ffb703"
  );

  const textPrimary = getThemeColor(
    "--text-primary",
    "#ffffff"
  );

  // ==========================================
  // SKILLS
  // ==========================================

  const skills = [
    "React",
    "JavaScript",
    "HTML & CSS",
    "Tailwind CSS",
    "Three.js",
    "Zustand",
    "Git & GitHub",
  ];

  // ==========================================
  // SIZE
  // ==========================================

  const width =
    container.clientWidth || 600;

  const height =
    container.clientHeight || 600;

  // ==========================================
  // SCENE
  // ==========================================

  const scene = new THREE.Scene();

  // ==========================================
  // CAMERA
  // ==========================================

  const camera =
    new THREE.PerspectiveCamera(
      42,
      width / height,
      0.1,
      100
    );

  camera.position.set(
    0,
    0,
    7
  );

  // ==========================================
  // RENDERER
  // ==========================================

  const renderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference:
        "high-performance",
    });

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );

  renderer.setSize(
    width,
    height
  );

  renderer.outputColorSpace =
    THREE.SRGBColorSpace;

  renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

  renderer.toneMappingExposure = 1.1;

  container.appendChild(
    renderer.domElement
  );

  // ==========================================
  // MAIN CARD GROUP
  // ==========================================

  const cardGroup =
    new THREE.Group();

  scene.add(cardGroup);

  // ==========================================
  // CARD
  // ==========================================

  const cardGeometry =
    new THREE.BoxGeometry(
      4.8,
      3.5,
      0.42
    );

  const cardColor =
    accentSecondary
      .clone()
      .multiplyScalar(0.12);

  const cardMaterial =
    new THREE.MeshPhysicalMaterial({
      color: cardColor,
      metalness: 0.55,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      emissive: accentPrimary,
      emissiveIntensity: 0.18,
    });

  const card =
    new THREE.Mesh(
      cardGeometry,
      cardMaterial
    );

  cardGroup.add(card);

  // ==========================================
  // CARD EDGES
  // ==========================================

  const edgeGeometry =
    new THREE.EdgesGeometry(
      cardGeometry
    );

  const edgeMaterial =
    new THREE.LineBasicMaterial({
      color: accentPrimary,
      transparent: true,
      opacity: 0.95,
    });

  const edges =
    new THREE.LineSegments(
      edgeGeometry,
      edgeMaterial
    );

  cardGroup.add(edges);

  // ==========================================
  // INNER FRAME
  // ==========================================

  const frameGeometry =
    new THREE.BoxGeometry(
      4.45,
      3.15,
      0.455
    );

  const frameEdges =
    new THREE.EdgesGeometry(
      frameGeometry
    );

  const frameMaterial =
    new THREE.LineBasicMaterial({
      color: accentSecondary,
      transparent: true,
      opacity: 0.3,
    });

  const innerFrame =
    new THREE.LineSegments(
      frameEdges,
      frameMaterial
    );

  cardGroup.add(innerFrame);

  // ==========================================
  // CARD CONTENT GROUP
  // ==========================================

  const contentGroup =
    new THREE.Group();

  contentGroup.position.z =
    0.25;

  cardGroup.add(
    contentGroup
  );

  // ==========================================
  // SMALL LABEL
  // ==========================================

  const labelCanvas =
    document.createElement(
      "canvas"
    );

  labelCanvas.width = 1024;
  labelCanvas.height = 256;

  const labelContext =
    labelCanvas.getContext(
      "2d"
    );

  labelContext.clearRect(
    0,
    0,
    1024,
    256
  );

  labelContext.font =
    "600 34px Inter, Arial, sans-serif";

  labelContext.fillStyle =
    accentPrimary.getStyle();

  labelContext.fillText(
    "CURRENT SKILL",
    70,
    105
  );

  labelContext.fillStyle =
    "rgba(255,255,255,0.35)";

  labelContext.font =
    "500 22px Inter, Arial, sans-serif";

  labelContext.fillText(
    "WHAT I BUILD WITH",
    70,
    150
  );

  const labelTexture =
    new THREE.CanvasTexture(
      labelCanvas
    );

  labelTexture.colorSpace =
    THREE.SRGBColorSpace;

  const labelGeometry =
    new THREE.PlaneGeometry(
      4.45,
      1.05
    );

  const labelMaterial =
    new THREE.MeshBasicMaterial({
      map: labelTexture,
      transparent: true,
      depthWrite: false,
    });

  const label =
    new THREE.Mesh(
      labelGeometry,
      labelMaterial
    );

  label.position.set(
    0,
    1.05,
    0
  );

  contentGroup.add(
    label
  );

  // ==========================================
  // SKILL CANVAS
  // ==========================================

  const skillCanvas =
    document.createElement(
      "canvas"
    );

  skillCanvas.width = 1200;
  skillCanvas.height = 360;

  const skillContext =
    skillCanvas.getContext(
      "2d"
    );

  const skillTexture =
    new THREE.CanvasTexture(
      skillCanvas
    );

  skillTexture.colorSpace =
    THREE.SRGBColorSpace;

  skillTexture.minFilter =
    THREE.LinearFilter;

  skillTexture.magFilter =
    THREE.LinearFilter;

  const skillGeometry =
    new THREE.PlaneGeometry(
      4.5,
      1.35
    );

  const skillMaterial =
    new THREE.MeshBasicMaterial({
      map: skillTexture,
      transparent: true,
      depthWrite: false,
    });

  const skillMesh =
    new THREE.Mesh(
      skillGeometry,
      skillMaterial
    );

  skillMesh.position.set(
    0,
    -0.05,
    0.04
  );

  contentGroup.add(
    skillMesh
  );

  // ==========================================
  // UNDERLINE
  // ==========================================

  const underlineGeometry =
    new THREE.PlaneGeometry(
      2.4,
      0.025
    );

  const underlineMaterial =
    new THREE.MeshBasicMaterial({
      color: accentPrimary,
      transparent: true,
      opacity: 0.8,
    });

  const underline =
    new THREE.Mesh(
      underlineGeometry,
      underlineMaterial
    );

  underline.position.set(
    0,
    -0.82,
    0.04
  );

  contentGroup.add(
    underline
  );

  // ==========================================
  // BOTTOM LABEL
  // ==========================================

  const bottomCanvas =
    document.createElement(
      "canvas"
    );

  bottomCanvas.width = 1024;
  bottomCanvas.height = 200;

  const bottomContext =
    bottomCanvas.getContext(
      "2d"
    );

  bottomContext.clearRect(
    0,
    0,
    1024,
    200
  );

  bottomContext.font =
    "500 24px Inter, Arial, sans-serif";

  bottomContext.fillStyle =
    "rgba(255,255,255,0.35)";

  bottomContext.textAlign =
    "center";

  bottomContext.fillText(
    "NATHAN • FRONTEND DEVELOPER",
    512,
    100
  );

  const bottomTexture =
    new THREE.CanvasTexture(
      bottomCanvas
    );

  bottomTexture.colorSpace =
    THREE.SRGBColorSpace;

  const bottomGeometry =
    new THREE.PlaneGeometry(
      4.45,
      0.7
    );

  const bottomMaterial =
    new THREE.MeshBasicMaterial({
      map: bottomTexture,
      transparent: true,
      depthWrite: false,
    });

  const bottom =
    new THREE.Mesh(
      bottomGeometry,
      bottomMaterial
    );

  bottom.position.set(
    0,
    -1.25,
    0
  );

  contentGroup.add(
    bottom
  );

  // ==========================================
  // TEXT SCRAMBLE STATE
  // ==========================================

  let currentSkillIndex = 0;

  let currentText =
    skills[0];

  let displayedText =
    skills[0];

  let scrambleText =
    skills[0];

  let scrambleStart = 0;

  let scrambleDuration = 850;

  let isScrambling = false;

  // ==========================================
  // START SCRAMBLE
  // ==========================================

  const startScramble = (
    newSkill
  ) => {
    currentText = newSkill;

    scrambleText =
      newSkill
        .split("")
        .map(() =>
          randomCharacter()
        )
        .join("");

    scrambleStart =
      performance.now();

    isScrambling = true;
  };

  // ==========================================
  // DRAW SKILL TEXT
  // ==========================================

  const drawSkill = (
    text,
    opacity = 1
  ) => {
    skillContext.clearRect(
      0,
      0,
      skillCanvas.width,
      skillCanvas.height
    );

    // Orange glow
    skillContext.shadowColor =
      accentPrimary.getStyle();

    skillContext.shadowBlur =
      28;

    skillContext.globalAlpha =
      opacity;

    skillContext.font =
      "700 92px Inter, Arial, Helvetica, sans-serif";

    skillContext.textAlign =
      "center";

    skillContext.textBaseline =
      "middle";

    skillContext.fillStyle =
      accentPrimary.getStyle();

    skillContext.fillText(
      text,
      600,
      180
    );

    // Reset shadow
    skillContext.shadowBlur =
      0;

    // Small secondary line
    skillContext.font =
      "500 20px Inter, Arial, Helvetica, sans-serif";

    skillContext.fillStyle =
      "rgba(255,255,255,0.32)";

    skillContext.fillText(
      "TECHNOLOGY",
      600,
      285
    );

    skillContext.globalAlpha = 1;

    skillTexture.needsUpdate =
      true;
  };

  // ==========================================
  // SCRAMBLE UPDATE
  // ==========================================

  const updateScramble = (
    now
  ) => {
    if (!isScrambling) {
      return;
    }

    const elapsed =
      now - scrambleStart;

    const progress =
      Math.min(
        elapsed /
          scrambleDuration,
        1
      );

    const target =
      currentText;

    let result = "";

    for (
      let i = 0;
      i < target.length;
      i++
    ) {
      const characterProgress =
        i / target.length;

      if (
        progress >
        characterProgress
      ) {
        result += target[i];
      } else {
        result +=
          randomCharacter();
      }
    }

    displayedText =
      result;

    drawSkill(
      displayedText
    );

    if (progress >= 1) {
      displayedText =
        target;

      isScrambling = false;

      drawSkill(
        displayedText
      );
    }
  };

  // Initial text
  drawSkill(
    currentText
  );

  // ==========================================
  // SKILL TRANSITION
  // ==========================================

  let transitionActive =
    false;

  let transitionStart = 0;

  let transitionDuration =
    650;

  let nextSkillIndex =
    1;

  const startTransition = (
    now
  ) => {
    if (
      transitionActive ||
      isScrambling
    ) {
      return;
    }

    transitionActive =
      true;

    transitionStart =
      now;

    nextSkillIndex =
      (currentSkillIndex + 1) %
      skills.length;
  };

  const updateTransition = (
    now
  ) => {
    if (!transitionActive) {
      return;
    }

    const elapsed =
      now -
      transitionStart;

    const progress =
      Math.min(
        elapsed /
          transitionDuration,
        1
      );

    // Smooth easing
    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );

    // ==================================
    // CURRENT SKILL GOES UP
    // ==================================

    if (progress < 0.5) {
      const phase =
        progress / 0.5;

      const move =
        phase * 1.4;

      skillMesh.position.y =
        -0.05 + move;

      skillMesh.material.opacity =
        1 - phase;

      return;
    }

    // ==================================
    // NEW SKILL COMES FROM BELOW
    // ==================================

    if (
      currentSkillIndex !==
      nextSkillIndex
    ) {
      currentSkillIndex =
        nextSkillIndex;

      startScramble(
        skills[currentSkillIndex]
      );
    }

    const phase =
      (progress - 0.5) /
      0.5;

    const move =
      -1.4 +
      phase * 1.4;

    skillMesh.position.y =
      -0.05 + move;

    skillMesh.material.opacity =
      phase;

    if (progress >= 1) {
      skillMesh.position.y =
        -0.05;

      skillMesh.material.opacity =
        1;

      transitionActive =
        false;
    }
  };

  // ==========================================
  // TIMING
  // ==========================================

  let skillVisibleStart =
    performance.now();

  const visibleDuration =
    2200;

  // ==========================================
  // PARTICLES
  // ==========================================

  const particleCount = 90;

  const particlePositions =
    new Float32Array(
      particleCount * 3
    );

  for (
    let i = 0;
    i < particleCount;
    i++
  ) {
    const index =
      i * 3;

    particlePositions[index] =
      (Math.random() - 0.5) * 8;

    particlePositions[
      index + 1
    ] =
      (Math.random() - 0.5) * 6;

    particlePositions[
      index + 2
    ] =
      (Math.random() - 0.5) * 3 -
      1;
  }

  const particleGeometry =
    new THREE.BufferGeometry();

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      particlePositions,
      3
    )
  );

  const particleMaterial =
    new THREE.PointsMaterial({
      color: accentPrimary,
      size: 0.025,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

  const particles =
    new THREE.Points(
      particleGeometry,
      particleMaterial
    );

  scene.add(
    particles
  );

  // ==========================================
  // GLOW
  // ==========================================

  const glowCanvas =
    document.createElement(
      "canvas"
    );

  glowCanvas.width = 256;
  glowCanvas.height = 256;

  const glowContext =
    glowCanvas.getContext(
      "2d"
    );

  const glowGradient =
    glowContext.createRadialGradient(
      128,
      128,
      10,
      128,
      128,
      128
    );

  glowGradient.addColorStop(
    0,
    `rgba(
      ${Math.round(
        accentPrimary.r * 255
      )},
      ${Math.round(
        accentPrimary.g * 255
      )},
      ${Math.round(
        accentPrimary.b * 255
      )},
      0.35
    )`
  );

  glowGradient.addColorStop(
    0.5,
    `rgba(
      ${Math.round(
        accentSecondary.r * 255
      )},
      ${Math.round(
        accentSecondary.g * 255
      )},
      ${Math.round(
        accentSecondary.b * 255
      )},
      0.12
    )`
  );

  glowGradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  glowContext.fillStyle =
    glowGradient;

  glowContext.fillRect(
    0,
    0,
    256,
    256
  );

  const glowTexture =
    new THREE.CanvasTexture(
      glowCanvas
    );

  glowTexture.colorSpace =
    THREE.SRGBColorSpace;

  const glowMaterial =
    new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

  const glowSprite =
    new THREE.Sprite(
      glowMaterial
    );

  glowSprite.scale.set(
    7,
    7,
    1
  );

  glowSprite.position.z =
    -0.8;

  cardGroup.add(
    glowSprite
  );

  // ==========================================
  // LIGHTS
  // ==========================================

  const ambientLight =
    new THREE.AmbientLight(
      0xffffff,
      1.5
    );

  scene.add(
    ambientLight
  );

  const orangeLight =
    new THREE.PointLight(
      accentPrimary,
      10,
      12
    );

  orangeLight.position.set(
    3.5,
    2.8,
    4
  );

  scene.add(
    orangeLight
  );

  const secondaryLight =
    new THREE.PointLight(
      accentSecondary,
      7,
      10
    );

  secondaryLight.position.set(
    -3,
    -2,
    3
  );

  scene.add(
    secondaryLight
  );

  const topLight =
    new THREE.PointLight(
      accentHover,
      5,
      8
    );

  topLight.position.set(
    0,
    4,
    2
  );

  scene.add(
    topLight
  );

  // ==========================================
  // MOUSE
  // ==========================================

  const targetRotation = {
    x: 0,
    y: 0,
  };

  const handleMouseMove = (
    event
  ) => {
    const rect =
      container.getBoundingClientRect();

    const x =
      (event.clientX -
        rect.left) /
        rect.width -
      0.5;

    const y =
      (event.clientY -
        rect.top) /
        rect.height -
      0.5;

    targetRotation.y =
      x * 0.45;

    targetRotation.x =
      y * -0.3;
  };

  container.addEventListener(
    "mousemove",
    handleMouseMove
  );

  // ==========================================
  // RESIZE
  // ==========================================

  const handleResize = () => {
    const newWidth =
      container.clientWidth ||
      600;

    const newHeight =
      container.clientHeight ||
      600;

    camera.aspect =
      newWidth /
      newHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      newWidth,
      newHeight
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );
  };

  window.addEventListener(
    "resize",
    handleResize
  );

  // ==========================================
  // ANIMATION
  // ==========================================

  const clock =
    new THREE.Clock();

  let animationFrame;

  const animate = () => {
    animationFrame =
      requestAnimationFrame(
        animate
      );

    const elapsed =
      clock.getElapsedTime();

    const now =
      performance.now();

    // ==================================
    // CARD FLOAT
    // ==================================

    cardGroup.position.y =
      Math.sin(
        elapsed * 1.2
      ) * 0.08;

    // ==================================
    // CARD MOUSE ROTATION
    // ==================================

    cardGroup.rotation.x +=
      (targetRotation.x -
        cardGroup.rotation.x) *
      0.05;

    cardGroup.rotation.y +=
      (targetRotation.y -
        cardGroup.rotation.y) *
      0.05;

    cardGroup.rotation.z =
      Math.sin(
        elapsed * 0.7
      ) * 0.015;

    // ==================================
    // PARTICLES
    // ==================================

    particles.rotation.y =
      elapsed * 0.025;

    particles.rotation.x =
      Math.sin(
        elapsed * 0.25
      ) * 0.05;

    // ==================================
    // GLOW
    // ==================================

    glowSprite.material.opacity =
      0.55 +
      Math.sin(
        elapsed * 1.5
      ) *
        0.1;

    // ==================================
    // LIGHT MOVEMENT
    // ==================================

    orangeLight.position.x =
      3.5 +
      Math.sin(
        elapsed * 0.8
      ) *
        0.7;

    orangeLight.position.y =
      2.8 +
      Math.cos(
        elapsed * 0.7
      ) *
        0.4;

    // ==================================
    // SCRAMBLE
    // ==================================

    updateScramble(
      now
    );

    // ==================================
    // TRANSITION
    // ==================================

    updateTransition(
      now
    );

    // ==================================
    // START NEXT SKILL
    // ==================================

    if (
      !isScrambling &&
      !transitionActive &&
      now -
        skillVisibleStart >
        visibleDuration
    ) {
      skillVisibleStart =
        now;

      startTransition(
        now
      );
    }

    // ==================================
    // RENDER
    // ==================================

    renderer.render(
      scene,
      camera
    );
  };

  animate();

  // ==========================================
  // CLEANUP
  // ==========================================

  return () => {
    cancelAnimationFrame(
      animationFrame
    );

    container.removeEventListener(
      "mousemove",
      handleMouseMove
    );

    window.removeEventListener(
      "resize",
      handleResize
    );

    cardGeometry.dispose();
    cardMaterial.dispose();

    edgeGeometry.dispose();
    edgeMaterial.dispose();

    frameGeometry.dispose();
    frameEdges.dispose();
    frameMaterial.dispose();

    labelGeometry.dispose();
    labelMaterial.dispose();
    labelTexture.dispose();

    skillGeometry.dispose();
    skillMaterial.dispose();
    skillTexture.dispose();

    underlineGeometry.dispose();
    underlineMaterial.dispose();

    bottomGeometry.dispose();
    bottomMaterial.dispose();
    bottomTexture.dispose();

    particleGeometry.dispose();
    particleMaterial.dispose();

    glowTexture.dispose();
    glowMaterial.dispose();

    renderer.dispose();

    if (
      renderer.domElement &&
      container.contains(
        renderer.domElement
      )
    ) {
      container.removeChild(
        renderer.domElement
      );
    }

    scene.clear();
  };
};

export default createSkillsScene;