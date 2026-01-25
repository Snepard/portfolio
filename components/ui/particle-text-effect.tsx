"use client"

import { useEffect, useRef } from "react"

interface Vector2D {
  x: number
  y: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 10
  isKilled = false

  startColor = { r: 0, g: 0, b: 0 }
  targetColor = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move() {
    // Check if particle is close enough to its target to slow down
    let proximityMult = 1
    const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2))

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    // Add force towards target
    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    }

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y)
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    }

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y)
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce
      steer.y = (steer.y / steerMagnitude) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y

    // Move particle
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    // Blend towards target color
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }

    // Calculate current color
    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
    } else {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      // Set target outside the scene
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2)
      this.target.x = randomPos.x
      this.target.y = randomPos.y

      // Begin blending color to black
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0

      this.isKilled = true
    }
  }

  private generateRandomPos(x: number, y: number, mag: number): Vector2D {
    const randomX = Math.random() * 1000
    const randomY = Math.random() * 500

    const direction = {
      x: randomX - x,
      y: randomY - y,
    }

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag
      direction.y = (direction.y / magnitude) * mag
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    }
  }
}

interface ParticleTextEffectProps {
  words?: readonly string[]
  width?: number
  height?: number
  fontSize?: number
  className?: string
  canvasClassName?: string
  showCaption?: boolean
  backgroundFillStyle?: string
  backgroundMode?: "tint" | "fadeToTransparent" | "clear"
  fadeAlpha?: number
  fullscreen?: boolean
  anchorRef?: React.RefObject<HTMLElement | null>
  anchorPadding?: number
  interactive?: boolean
  colors?: { r: number; g: number; b: number }[]
}

const DEFAULT_WORDS = ["HELLO", "21st.dev", "ParticleTextEffect", "BY", "KAINXU"]

export function ParticleTextEffect({
  words = DEFAULT_WORDS,
  width = 1000,
  height = 500,
  fontSize = 100,
  className,
  canvasClassName,
  showCaption = true,
  backgroundFillStyle = "rgba(0, 0, 0, 0.1)",
  backgroundMode = "tint",
  fadeAlpha = 0.08,
  fullscreen = false,
  anchorRef,
  anchorPadding = 24,
  interactive = true,
  colors,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const wordTracesRef = useRef<Record<string, { width: number; height: number; points: Vector2D[] }>>({})
  const frameCountRef = useRef(0)
  const wordIndexRef = useRef(0)
  const colorIndexRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false })

  const pixelSteps = 6
  const drawAsPoints = true

  const generateSpawnPos = (canvas: HTMLCanvasElement): Vector2D => {
    if (fullscreen) {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      }
    }

    const x = canvas.width / 2
    const y = canvas.height / 2
    const mag = (canvas.width + canvas.height) / 2

    const randomX = Math.random() * 1000
    const randomY = Math.random() * 500

    const direction = {
      x: randomX - x,
      y: randomY - y,
    }

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag
      direction.y = (direction.y / magnitude) * mag
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    }
  }

  const nextWord = (word: string, canvas: HTMLCanvasElement) => {
    const anchorRect = fullscreen && anchorRef?.current ? anchorRef.current.getBoundingClientRect() : null
    let offsetX = 0
    let offsetY = 0
    let processWidth = canvas.width
    let processHeight = canvas.height

    if (anchorRect) {
      const paddedWidth = Math.max(1, Math.ceil(anchorRect.width + anchorPadding * 2))
      const paddedHeight = Math.max(1, Math.ceil(anchorRect.height + anchorPadding * 2))
      processWidth = paddedWidth
      processHeight = paddedHeight
      offsetX = Math.round(anchorRect.left - anchorPadding)
      offsetY = Math.round(anchorRect.top - anchorPadding)
    }

    let points: Vector2D[] = []
    const cached = wordTracesRef.current[word]

    if (cached && cached.width === processWidth && cached.height === processHeight) {
      points = cached.points
    } else {
      const offscreenCanvas = document.createElement("canvas")
      const offscreenCtx = offscreenCanvas.getContext("2d")!

      offscreenCanvas.width = processWidth
      offscreenCanvas.height = processHeight

      const effectiveFontSize = anchorRect
        ? Math.min(fontSize, Math.max(12, Math.floor(anchorRect.height * 0.9)))
        : fontSize

      offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      offscreenCtx.fillStyle = "white"
      offscreenCtx.font = `bold ${effectiveFontSize}px Arial`
      offscreenCtx.textAlign = "center"
      offscreenCtx.textBaseline = "middle"
      offscreenCtx.fillText(word, offscreenCanvas.width / 2, offscreenCanvas.height / 2)

      const imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      const pixels = imageData.data

      const coordsIndexes: number[] = []
      for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
        if (pixels[i + 3] > 0) {
          coordsIndexes.push(i)
        }
      }

      for (let i = coordsIndexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]]
      }

      for (const index of coordsIndexes) {
        const x = (index / 4) % offscreenCanvas.width
        const y = Math.floor(index / 4 / offscreenCanvas.width)
        points.push({ x, y })
      }

      wordTracesRef.current[word] = {
        width: processWidth,
        height: processHeight,
        points: points,
      }
    }

    let newColor: { r: number; g: number; b: number }
    if (colors && colors.length > 0) {
      newColor = colors[colorIndexRef.current % colors.length]
      colorIndexRef.current++
    } else {
      newColor = {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
      }
    }

    const particles = particlesRef.current
    let particleIndex = 0

    for (const point of points) {
      let particle: Particle
      if (particleIndex < particles.length) {
        particle = particles[particleIndex]
        particle.isKilled = false
        particleIndex++
      } else {
        particle = new Particle()
        const spawnPos = generateSpawnPos(canvas)
        particle.pos.x = spawnPos.x
        particle.pos.y = spawnPos.y

        particle.maxSpeed = Math.random() * 3 + 2
        particle.maxForce = particle.maxSpeed * 0.03
        particle.particleSize = Math.random() * 6 + 6
        particle.colorBlendRate = Math.random() * 0.015 + 0.001

        particles.push(particle)
      }

      particle.startColor = {
        r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
        g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
        b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
      }
      particle.targetColor = newColor
      particle.colorWeight = 0

      particle.target.x = point.x + offsetX
      particle.target.y = point.y + offsetY
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height)
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const particles = particlesRef.current

    // Background / trail handling
    if (backgroundMode === "clear") {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    } else if (backgroundMode === "fadeToTransparent") {
      const prev = ctx.globalCompositeOperation
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = prev
    } else {
      ctx.fillStyle = backgroundFillStyle
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      particle.move()
      particle.draw(ctx, drawAsPoints)

      // Remove dead particles that are out of bounds
      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1)
        }
      }
    }

    // Handle mouse interaction
    if (interactive && mouseRef.current.isPressed && mouseRef.current.isRightClick) {
      particles.forEach((particle) => {
        const distance = Math.sqrt(
          Math.pow(particle.pos.x - mouseRef.current.x, 2) + Math.pow(particle.pos.y - mouseRef.current.y, 2),
        )
        if (distance < 50) {
          particle.kill(canvas.width, canvas.height)
        }
      })
    }

    // Auto-advance words
    frameCountRef.current++
    if (frameCountRef.current % 480 === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length
      nextWord(words[wordIndexRef.current], canvas)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    particlesRef.current = []
    wordTracesRef.current = {}
    frameCountRef.current = 0
    wordIndexRef.current = 0

    const setCanvasSize = () => {
      if (fullscreen) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      } else {
        canvas.width = width
        canvas.height = height
      }
    }

    setCanvasSize()

    // Initialize with first word
    if (words.length > 0) {
      nextWord(words[0], canvas)
    }

    // Start animation
    animate()

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true
      mouseRef.current.isRightClick = e.button === 2
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false
      mouseRef.current.isRightClick = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    if (interactive) {
      canvas.addEventListener("mousedown", handleMouseDown)
      canvas.addEventListener("mouseup", handleMouseUp)
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("contextmenu", handleContextMenu)
    }

    const handleResize = () => {
      if (!fullscreen) return
      setCanvasSize()
    }

    if (fullscreen) {
      window.addEventListener("resize", handleResize)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }

      if (interactive) {
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("contextmenu", handleContextMenu)
      }

      if (fullscreen) {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [
    anchorPadding,
    anchorRef,
    backgroundFillStyle,
    backgroundMode,
    fadeAlpha,
    fontSize,
    fullscreen,
    height,
    interactive,
    width,
    words,
  ])

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className={canvasClassName}
        style={{ width: "100%", height: "100%" }}
      />
      {showCaption ? (
        <div className="mt-4 text-white text-sm text-center max-w-md">
          <p className="mb-2">Particle Text Effect</p>
          <p className="text-gray-400 text-xs">
            Right-click and hold while moving mouse to destroy particles • Words change automatically every 4 seconds
          </p>
        </div>
      ) : null}
    </div>
  )
}
