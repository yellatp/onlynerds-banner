import { useState, useCallback, useRef } from 'react'
import type { BannerConfig, ElementPosition } from './types'

// ─── Types ───────────────────────────────────────────────────────────────────

export type ElementType =
  | 'name'
  | 'role'
  | 'team'
  | 'tagline'
  | 'skills'
  | 'currentLogo'
  | 'pastLogos'
  | 'gitBadge'

type DragState = {
  elementType: ElementType
  startMouseX: number
  startMouseY: number
  startElX: number
  startElY: number
}

type BoundingBox = {
  x: number
  y: number
  width: number
  height: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert a mouse/touch client coordinate to SVG viewBox coordinates */
function svgPoint(svg: SVGSVGElement, clientX: number, clientY: number): DOMPoint {
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  return pt.matrixTransform(svg.getScreenCTM()!.inverse())
}

/** Clamp a value between min and max */
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

/** Map element type to the BannerConfig key for its position override */
function positionKeyFor(type: ElementType): keyof BannerConfig | null {
  switch (type) {
    case 'name':        return 'namePos'
    case 'role':        return 'rolePos'
    case 'team':        return 'teamPos'
    case 'tagline':     return 'taglinePos'
    case 'skills':      return 'skillsPos'
    case 'currentLogo': return 'currentLogoPos'
    case 'pastLogos':   return 'pastLogosPos'
    case 'gitBadge':    return 'gitBadgePos'
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useDragResize(
  config: BannerConfig,
  onConfigChange: (updater: (prev: BannerConfig) => BannerConfig) => void,
  svgRef: React.RefObject<SVGSVGElement | null>,
  editMode: boolean,
) {
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const boxesRef = useRef<Map<ElementType, BoundingBox>>(new Map())

  // ── Register bounding boxes (called during render) ──────────────────────

  const registerBox = useCallback((type: ElementType, box: BoundingBox) => {
    boxesRef.current.set(type, box)
  }, [])

  // ── Get the effective position of an element (override or computed) ─────

  const getElementPos = useCallback((type: ElementType): ElementPosition | null => {
    switch (type) {
      case 'name':        return config.namePos ?? null
      case 'role':        return config.rolePos ?? null
      case 'team':        return config.teamPos ?? null
      case 'tagline':     return config.taglinePos ?? null
      case 'skills':      return config.skillsPos ?? null
      case 'currentLogo': return config.currentLogoPos ?? null
      case 'pastLogos':   return config.pastLogosPos ?? null
      case 'gitBadge':    return config.gitBadgePos ?? null
    }
  }, [config])

  // ── Reset an element's position to default ──────────────────────────────

  const resetPosition = useCallback((type: ElementType) => {
    onConfigChange(prev => {
      const key = positionKeyFor(type)
      if (!key) return prev
      return { ...prev, [key]: undefined }
    })
    setSelectedElement(null)
  }, [onConfigChange])

  // ── Update an element's position ────────────────────────────────────────

  const updatePosition = useCallback((type: ElementType, pos: ElementPosition) => {
    onConfigChange(prev => {
      const key = positionKeyFor(type)
      if (!key) return prev
      return { ...prev, [key]: pos }
    })
  }, [onConfigChange])

  // ── Core pointer handler (shared by mouse and touch) ────────────────────

  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    if (!editMode || !svgRef.current) return

    const pt = svgPoint(svgRef.current, clientX, clientY)

    // Hit-test: find which element was clicked (iterate in reverse z-order)
    const boxes = Array.from(boxesRef.current.entries()).reverse()
    for (const [type, box] of boxes) {
      if (pt.x >= box.x && pt.x <= box.x + box.width &&
          pt.y >= box.y && pt.y <= box.y + box.height) {
        // Start dragging (move only — resize is done via external +/- buttons)
        dragRef.current = {
          elementType: type,
          startMouseX: pt.x,
          startMouseY: pt.y,
          startElX: box.x,
          startElY: box.y,
        }
        setSelectedElement(type)
        return
      }
    }

    // Clicked empty space — deselect
    setSelectedElement(null)
    dragRef.current = null
  }, [editMode, svgRef])

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    const drag = dragRef.current
    if (!drag || !svgRef.current) return

    const pt = svgPoint(svgRef.current, clientX, clientY)

    const dx = pt.x - drag.startMouseX
    const dy = pt.y - drag.startMouseY

    const newX = clamp(drag.startElX + dx, 0, config.format.width)
    const newY = clamp(drag.startElY + dy, 0, config.format.height)
    updatePosition(drag.elementType, { x: Math.round(newX), y: Math.round(newY) })
  }, [config.format.width, config.format.height, updatePosition, svgRef])

  const handlePointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  // ── React event handlers ────────────────────────────────────────────────

  const onMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    handlePointerDown(e.clientX, e.clientY)
    e.preventDefault()
  }, [handlePointerDown])

  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    handlePointerMove(e.clientX, e.clientY)
    e.preventDefault()
  }, [handlePointerMove])

  const onMouseUp = useCallback((_e: React.MouseEvent<SVGSVGElement>) => {
    handlePointerUp()
  }, [handlePointerUp])

  const onTouchStart = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    const touch = e.touches[0] ?? e.changedTouches[0]
    if (touch) {
      handlePointerDown(touch.clientX, touch.clientY)
      e.preventDefault()
    }
  }, [handlePointerDown])

  const onTouchMove = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    const touch = e.touches[0] ?? e.changedTouches[0]
    if (touch) {
      handlePointerMove(touch.clientX, touch.clientY)
      e.preventDefault()
    }
  }, [handlePointerMove])

  const onTouchEnd = useCallback((_e: React.TouchEvent<SVGSVGElement>) => {
    handlePointerUp()
  }, [handlePointerUp])

  // ── Select element programmatically ─────────────────────────────────────

  const selectElement = useCallback((type: ElementType | null) => {
    setSelectedElement(type)
  }, [])

  return {
    selectedElement,
    registerBox,
    getElementPos,
    resetPosition,
    updatePosition,
    selectElement,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
