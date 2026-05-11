'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Base delay in seconds before optional stagger */
  delay?: number
  /** Item index for staggered lists/grids */
  index?: number
  /** Extra delay per index step */
  staggerSec?: number
  /** Initial vertical offset in px (ignored when reduced motion) */
  y?: number
}

/**
 * Scroll-triggered fade + slide-up. Respects `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  index = 0,
  staggerSec = 0.07,
  y = 26,
}: Props) {
  const reducedMotion = useReducedMotion()
  const transitionDelay = delay + index * staggerSec

  return (
    <motion.div
      className={className}
      style={style}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px 0px -24px 0px', amount: 0.12 }}
      transition={{
        duration: reducedMotion ? 0 : 0.52,
        delay: reducedMotion ? 0 : transitionDelay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
