'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useAnimations, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

gsap.registerPlugin(ScrollTrigger)

// Initial State (Hero Section):
// cameraZ is very small to zoom in significantly (character is larger)
// charY is adjusted so we still stay centered vertically
const scrollState = {
  cameraZ: 1.5,
  charX: 0,
  charY: -1.2,
  charRotX: 0,
  charRotY: Math.PI / 6,
  charRotZ: 0,
  idleTime: 0,
}

interface CharacterProps {
  modelPath: string
  animationsPath?: string
  scale?: number
  basePosition?: [number, number, number]
  rotation?: [number, number, number]
  enableHeadTracking?: boolean
  headBoneName?: string
}

function Character({
  modelPath,
  animationsPath,
  scale = 1,
  basePosition = [0, 0, 0],
  rotation = [0, 0, 0],
  enableHeadTracking = false,
  headBoneName = 'Head',
}: CharacterProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(modelPath)
  const modelScene = useMemo(() => clone(scene), [scene])
  const headBoneRef = useRef<THREE.Object3D | null>(null)

  const animationsData = useGLTF(animationsPath || modelPath)
  const allAnimations = useMemo(
    () => (animationsPath && animationsData ? [...animations, ...animationsData.animations] : animations),
    [animations, animationsData, animationsPath],
  )
  const { actions, mixer } = useAnimations(allAnimations, group)

  // ... head tracking logic ...
  const mousePosition = useRef({ x: 0, y: 0 })
  const isMouseInWindow = useRef(true)

  useEffect(() => {
    if (!enableHeadTracking) return

    const handleMouseMove = (event: MouseEvent) => {
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

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [enableHeadTracking])

  useEffect(() => {
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
      const bone =
        modelScene.getObjectByName(headBoneName) ||
        modelScene.getObjectByName('mixamorigHead') ||
        modelScene.getObjectByName('Neck')
      headBoneRef.current = bone ?? null
    }
  }, [modelScene, enableHeadTracking, headBoneName])

  useFrame((_state, delta) => {
    if (!group.current) return

    scrollState.idleTime += delta
    const idleY = Math.sin(scrollState.idleTime * 1.3) * 0.03

    group.current.position.set(
      basePosition[0] + scrollState.charX,
      scrollState.charY + idleY,
      basePosition[2],
    )
    group.current.rotation.set(
      rotation[0] + scrollState.charRotX,
      rotation[1] + scrollState.charRotY,
      rotation[2] + scrollState.charRotZ,
    )

    if (enableHeadTracking && headBoneRef.current) {
      let targetRotationX = 0
      let targetRotationY = 0

      if (isMouseInWindow.current) {
        const mouseX = mousePosition.current.x
        const mouseY = mousePosition.current.y
        targetRotationY = mouseX * 3
        targetRotationX = -mouseY * 4
      }

      const lerpFactor = isMouseInWindow.current ? 0.08 : 0.03
      headBoneRef.current.rotation.y = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.y,
        targetRotationY,
        lerpFactor,
      )
      headBoneRef.current.rotation.x = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.x,
        targetRotationX,
        lerpFactor,
      )
    }
  })

  return (
    <group ref={group} position={basePosition} rotation={rotation} scale={scale}>
      <primitive object={modelScene} />
    </group>
  )
}

function MouseFollowLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const { viewport } = useThree()

  useFrame(({ pointer }) => {
    if (!lightRef.current) return
    lightRef.current.position.x = (pointer.x * viewport.width) / 2
    lightRef.current.position.y = (pointer.y * viewport.height) / 2
  })

  return <pointLight ref={lightRef} intensity={0.45} position={[0, 0, 3]} />
}

function ScrollCamera({ baseCameraY }: { baseCameraY: number }) {
  useFrame(({ camera }) => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, scrollState.cameraZ, 0.1)
    camera.position.y = baseCameraY
    camera.position.x = 0
  })

  return null
}

interface ScrollSceneProps {
  modelPath: string
  animationsPath?: string
  className?: string
}

export function ScrollScene({ modelPath, animationsPath, className }: ScrollSceneProps) {
  const setupScrollTrigger = useCallback(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.scroll-section')
    if (sections.length < 3) return

    // RESET STATE in case of unmount/remount
    scrollState.cameraZ = 1.5;
    scrollState.charX = 0;
    scrollState.charY = -1.6;
    scrollState.charRotX = 0;
    scrollState.charRotY = Math.PI / 6; // Offset to face front
    scrollState.charRotZ = 0;

    // Phase 2: First Scroll (Hero -> Section 2)
    // Camera pulls back to reveal full body, character spins and moves to the right.
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: sections[0], // scrubbing through the hero section height
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        snap: {
          snapTo: 1, // snaps to the exact end of the scrub timeline
          duration: { min: 0.5, max: 1.5 },
          delay: 0.1,
          ease: 'power1.inOut'
        }
      },
    })
    tl1.to(scrollState, {
      cameraZ: 3.5, // pull back less so the model appears larger
      charY: -1.5,  // adjust framing for full body while maintaining vertical center
      charX: 1.7,   // move right (adjusted slightly for new scale)
      charRotY: Math.PI * 2 - 0.25, // spin
      ease: 'power2.inOut'
    }, 0)


    // Phase 3: Second Scroll (Section 2 -> Section 3)
    // Character "flies" across from right to left, rotates horizontally
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: sections[1], // Section 2
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        snap: {
          snapTo: 1,
          duration: { min: 0.5, max: 1.5 },
          delay: 0.1,
          ease: 'power1.inOut'
        }
      },
    })
    tl2.to(scrollState, {
      charX: -1.8, // move left
      charY: -1.5, // keep same vertical center as section 2
      charRotX: 0, // stand upright
      charRotY: Math.PI / 2 - 0.25, // face more towards the right (the text)
      charRotZ: 0,
      ease: 'power2.inOut'
    }, 0)

    // Phase 4: Final State is maintained automatically, no further ScrollTriggers needed.

  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      setupScrollTrigger()
    })

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [setupScrollTrigger])

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0.6, 2.5], fov: 45 }} style={{ background: 'transparent' }} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[-5, 10, 5]} intensity={2} color="#fffcf5" />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <MouseFollowLight />

          <ScrollCamera baseCameraY={0.6} />

          <Character
            modelPath={modelPath}
            animationsPath={animationsPath}
            scale={1.2}
            basePosition={[0, 0, 0]}
            rotation={[0, 0, 0]}
            enableHeadTracking={true}
            headBoneName="Neck"
          />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
