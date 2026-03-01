'use client'

import { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

interface ModelProps {
  modelPath: string
  animationsPath?: string
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  autoRotate?: boolean
  enableHeadTracking?: boolean
  headBoneName?: string
}

function Model({
  modelPath,
  animationsPath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = false,
  enableHeadTracking = false,
  headBoneName = "Head"
}: ModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(modelPath)
  const modelScene = useMemo(() => clone(scene), [scene])
  const headBoneRef = useRef<THREE.Object3D | null>(null)

  const animationsData = useGLTF(animationsPath || modelPath)

  const allAnimations = useMemo(() => animationsPath && animationsData
    ? [...animations, ...animationsData.animations]
    : animations, [animations, animationsData, animationsPath])

  const { actions, mixer } = useAnimations(allAnimations, group)

  // Global mouse tracking for full-screen effect
  const mousePosition = useRef({ x: 0, y: 0 })
  const isMouseInWindow = useRef(true)

  useEffect(() => {
    if (!enableHeadTracking) return

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize X/Y to -1 to 1 based on window size
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1
      isMouseInWindow.current = true
    }

    const handleMouseLeave = () => {
      isMouseInWindow.current = false
    }

    const handleMouseEnter = () => {
      isMouseInWindow.current = true
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [enableHeadTracking])

  useEffect(() => {
    // Play the first animation if available
    const actionNames = Object.keys(actions)
    if (actionNames.length > 0 && actions[actionNames[0]]) {
      actions[actionNames[0]]?.reset().fadeIn(0.5).play()
    }

    return () => {
      mixer?.stopAllAction()
    }
  }, [actions, mixer])

  useEffect(() => {
    if (enableHeadTracking) {
      const bone = modelScene.getObjectByName(headBoneName) || modelScene.getObjectByName("mixamorigHead") || modelScene.getObjectByName("Neck")
      if (bone) {
        headBoneRef.current = bone
      } else {
        console.warn(`Bone "${headBoneName}" not found. Head tracking disabled.`)
      }
    }
  }, [modelScene, enableHeadTracking, headBoneName])

  useFrame((state) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += 0.005
    }

    if (enableHeadTracking && headBoneRef.current) {
      let targetRotationX = 0
      let targetRotationY = 0

      if (isMouseInWindow.current) {
        // Get mouse position (-1 to 1) from global window listener
        const mouseX = mousePosition.current.x
        const mouseY = mousePosition.current.y

        // Target rotation (adjust sensitivity as needed)
        // Standard rigs often rotate head around Y for left/right and X for up/down
        // Note: Bones local axes might differ. Assuming standard orientation here.

        targetRotationY = mouseX * 5 // Look left/right
        targetRotationX = -mouseY * 5 // Look up/down
      }
      // When mouse is out of window, targetRotation stays at 0,0 (neutral position)

      // Smoothly interpolate current rotation to target
      const lerpFactor = isMouseInWindow.current ? 0.08 : 0.03 // Slower transition when returning to neutral
      headBoneRef.current.rotation.y = THREE.MathUtils.lerp(headBoneRef.current.rotation.y, targetRotationY, lerpFactor)
      headBoneRef.current.rotation.x = THREE.MathUtils.lerp(headBoneRef.current.rotation.x, targetRotationX, lerpFactor)
    }
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={modelScene} />
    </group>
  )
}

function MouseFollowLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const { viewport } = useThree()

  useFrame(({ pointer }) => {
    if (lightRef.current) {
      lightRef.current.position.x = (pointer.x * viewport.width) / 2
      lightRef.current.position.y = (pointer.y * viewport.height) / 2
    }
  })

  return <pointLight ref={lightRef} intensity={0.5} position={[0, 0, 3]} />
}

function CameraInitializer() {
  const controls = useRef<any>(null)

  useEffect(() => {
    if (controls.current) {
      controls.current.setAzimuthalAngle(-0.35) // rotate camera to the right
      controls.current.update()
    }
  }, [])

  return (
    <OrbitControls
      ref={controls}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 1.5}
    />
  )
}

interface GLBModelViewerProps {
  modelPath: string
  animationsPath?: string
  className?: string
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  autoRotate?: boolean
  enableOrbitControls?: boolean
  enableMouseLight?: boolean
  backgroundColor?: string
  cameraPosition?: [number, number, number]
  cameraFov?: number
  enableHeadTracking?: boolean
  headBoneName?: string
  paused?: boolean
}

export function GLBModelViewer({
  modelPath,
  animationsPath,
  className,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = false,
  enableOrbitControls = true,
  enableMouseLight = true,
  backgroundColor = 'transparent',
  cameraPosition = [0, 0, 5],
  cameraFov = 50,
  enableHeadTracking = false,
  headBoneName = "Head"
  , paused = false
}: GLBModelViewerProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: cameraPosition, fov: cameraFov }}
        style={{ background: backgroundColor }}
        gl={{ alpha: true, antialias: true }}
        frameloop={paused ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          {/* Natural sunlight from top-left */}
          <directionalLight position={[-5, 10, 5]} intensity={2} color="#fffcf5" />
          {/* Subtle fill light */}
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          {enableMouseLight && <MouseFollowLight />}

          <Model
            modelPath={modelPath}
            animationsPath={animationsPath}
            scale={scale}
            position={position}
            rotation={rotation}
            autoRotate={autoRotate}
            enableHeadTracking={enableHeadTracking}
            headBoneName={headBoneName}
          />

          <Environment preset="city" />

          {enableOrbitControls && <CameraInitializer />}
        </Suspense>
      </Canvas>
    </div>
  )
}

// Preload models
export function preloadModel(path: string) {
  useGLTF.preload(path)
}
