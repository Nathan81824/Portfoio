import {
  ContactShadows,
  Float,
  OrbitControls,
  PerspectiveCamera,
  Text,
  Environment,
} from "@react-three/drei";

import { Canvas, useFrame } from "@react-three/fiber";

import { motion, useReducedMotion } from "framer-motion";

import { Code2, Sparkles, Zap } from "lucide-react";

import { useRef } from "react";

/* =========================================================
   FLOATING CODE CUBE
   ========================================================= */

function CodeCube() {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    groupRef.current.rotation.x =
      Math.sin(time * 0.45) * 0.12;

    groupRef.current.rotation.y =
      time * 0.35;

    groupRef.current.rotation.z =
      Math.sin(time * 0.3) * 0.08;
  });

  return (
    <group ref={groupRef}>

      {/* Main cube */}

      <mesh>
        <boxGeometry args={[2.4, 2.4, 2.4]} />

        <meshStandardMaterial
          color="#111827"
          metalness={0.65}
          roughness={0.25}
          transparent
          opacity={0.92}
        />
      </mesh>


      {/* Inner cube */}

      <mesh scale={0.82}>
        <boxGeometry args={[2.4, 2.4, 2.4]} />

        <meshBasicMaterial
          color="#ff9f00"
          wireframe
          transparent
          opacity={0.75}
        />
      </mesh>


      {/* Code symbol */}

      <Text
        position={[0, 0, 1.23]}
        fontSize={0.65}
        color="#ff9f00"
        anchorX="center"
        anchorY="middle"
      >
        {"</>"}
      </Text>

    </group>
  );
}


/* =========================================================
   FLOATING RING
   ========================================================= */

function FloatingRing() {
  const ringRef = useRef(null);

  useFrame((state) => {
    if (!ringRef.current) return;

    const time = state.clock.getElapsedTime();

    ringRef.current.rotation.x =
      time * 0.25;

    ringRef.current.rotation.y =
      Math.sin(time * 0.4) * 0.4;

    ringRef.current.rotation.z =
      time * 0.18;
  });

  return (
    <mesh
      ref={ringRef}
      position={[0, 0, 0]}
    >
      <torusGeometry
        args={[2.15, 0.035, 16, 100]}
      />

      <meshBasicMaterial
        color="#ff9f00"
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}


/* =========================================================
   FLOATING PARTICLES
   ========================================================= */

function Particles() {
  const particlesRef = useRef(null);

  const count = 90;

  const positions = new Float32Array(
    count * 3
  );

  for (let i = 0; i < count; i++) {
    positions[i * 3] =
      (Math.random() - 0.5) * 8;

    positions[i * 3 + 1] =
      (Math.random() - 0.5) * 6;

    positions[i * 3 + 2] =
      (Math.random() - 0.5) * 5;
  }

  useFrame((state) => {
    if (!particlesRef.current) return;

    particlesRef.current.rotation.y =
      state.clock.getElapsedTime() * 0.025;

    particlesRef.current.rotation.x =
      Math.sin(
        state.clock.getElapsedTime() * 0.15
      ) * 0.05;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#ff9f00"
        size={0.035}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}


/* =========================================================
   MAIN 3D SCENE
   ========================================================= */

function ThreeDScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >

      <PerspectiveCamera
        makeDefault
        position={[0, 0, 8]}
        fov={42}
      />


      {/* =================================================
          LIGHTING
      ================================================= */}

      <ambientLight intensity={0.45} />

      <pointLight
        position={[4, 4, 5]}
        intensity={3}
        distance={10}
        color="#ff9f00"
      />

      <pointLight
        position={[-4, -2, 4]}
        intensity={1.4}
        distance={8}
        color="#ffffff"
      />

      <spotLight
        position={[0, 5, 5]}
        intensity={2}
        angle={0.35}
        penumbra={1}
      />


      {/* =================================================
          ENVIRONMENT
      ================================================= */}

      <Environment
        preset="city"
        environmentIntensity={0.25}
      />


      {/* =================================================
          MAIN OBJECT
      ================================================= */}

      <Float
        speed={1.4}
        rotationIntensity={0.25}
        floatIntensity={0.55}
      >
        <CodeCube />
      </Float>


      {/* =================================================
          RING
      ================================================= */}

      <Float
        speed={1}
        rotationIntensity={0.15}
        floatIntensity={0.25}
      >
        <FloatingRing />
      </Float>


      {/* =================================================
          PARTICLES
      ================================================= */}

      <Particles />


      {/* =================================================
          GROUND SHADOW
      ================================================= */}

      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.35}
        scale={8}
        blur={2.5}
        far={5}
      />


      {/* =================================================
          CAMERA CONTROLS
      ================================================= */}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.7}
        maxPolarAngle={Math.PI / 1.8}
        rotateSpeed={0.35}
      />

    </Canvas>
  );
}


/* =========================================================
   FEATURE ITEM
   ========================================================= */

function Feature({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="three-d-feature">

      <div className="three-d-feature-icon">
        <Icon
          size={18}
          strokeWidth={1.8}
        />
      </div>

      <div>
        <strong>{title}</strong>

        <span>{text}</span>
      </div>

    </div>
  );
}


/* =========================================================
   THREE D SECTION
   ========================================================= */

function ThreeDSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="three-d-section"
      id="three-d"
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="three-d-background"
        aria-hidden="true"
      />

      <div
        className="three-d-grid"
        aria-hidden="true"
      />


      {/* =================================================
          CONTAINER
      ================================================= */}

      <div className="three-d-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <motion.header
          className="three-d-header"

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 70,
                }
          }

          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }

          viewport={{
            once: true,
            amount: 0.25,
          }}

          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          <span className="section-eyebrow">

            <Code2
              size={16}
              strokeWidth={1.8}
            />

            3D EXPERIENCE

          </span>


          <h2 className="section-title">

            I build for the{" "}

            <span>
              digital world.
            </span>

          </h2>


          <p className="three-d-header-text">

            Turning ideas into interactive experiences
            that feel as good as they look.

          </p>

        </motion.header>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="three-d-main">


          {/* =================================================
              3D CANVAS
          ================================================= */}

          <motion.div
            className="three-d-canvas"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -100,
                    scale: 0.94,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }
            }

            viewport={{
              once: true,
              amount: 0.2,
            }}

            transition={{
              duration: 1.2,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <ThreeDScene />

            <div
              className="three-d-canvas-glow"
              aria-hidden="true"
            />

          </motion.div>


          {/* =================================================
              TEXT CONTENT
          ================================================= */}

          <motion.div
            className="three-d-content"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 100,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                  }
            }

            viewport={{
              once: true,
              amount: 0.25,
            }}

            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <span className="three-d-content-label">
              Creative Development
            </span>


            <h3>
              More than just
              <span> pixels.</span>
            </h3>


            <p>
              I enjoy creating digital experiences
              that combine clean interfaces,
              thoughtful interactions and modern
              frontend technology.
            </p>


            <p>
              Every detail matters — from the way
              an interface responds to a user's
              actions to the performance behind
              the experience.
            </p>


            {/* =================================================
                FEATURES
            ================================================= */}

            <div className="three-d-features">

              <Feature
                icon={Sparkles}
                title="Interactive"
                text="Meaningful motion and interaction."
              />

              <Feature
                icon={Code2}
                title="Modern"
                text="Clean and scalable frontend code."
              />

              <Feature
                icon={Zap}
                title="Performance"
                text="Fast and responsive experiences."
              />

            </div>


            {/* =================================================
                SMALL STATUS
            ================================================= */}

            <div className="three-d-status">

              <span className="three-d-status-dot" />

              <span>
                Currently building something great.
              </span>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}


export default ThreeDSection;