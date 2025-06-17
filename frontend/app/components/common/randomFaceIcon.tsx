import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"

interface FaceIconProps {
  size?: number
  className?: string
}

export default function FaceIcon({ size = 24, className = "" }: FaceIconProps) {
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0)

  const faces = [
    // 1. Happy
    <svg key="happy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <path d="M8 15s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
    </svg>,

    // 2. Sad
    <svg key="sad" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <path d="M16 17s-1.5-2-4-2-4 2-4 2" strokeLinecap="round" />
    </svg>,

    // 3. Relaxed
    <svg key="relaxed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M7 9h4" strokeLinecap="round" />
      <path d="M13 9h4" strokeLinecap="round" />
      <path d="M9 15s1 1 3 1 3-1 3-1" strokeLinecap="round" />
    </svg>,

    // 4. Annoyed
    <svg key="annoyed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M7 8l2 1" strokeLinecap="round" />
      <path d="M17 8l-2 1" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path d="M16 16s-1.5-1-4-1-4 1-4 1" strokeLinecap="round" />
    </svg>,

    // 5. Excited
    <svg key="excited" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="none" />
      <circle cx="15.5" cy="8.5" r="1.5" fill="none" />
      <circle cx="8.5" cy="8.5" r="0.5" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="0.5" fill="currentColor" />
      <path d="M7 15s2 3 5 3 5-3 5-3" strokeLinecap="round" />
    </svg>,

    // 6. Focused
    <svg key="focused" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 8l1 1" strokeLinecap="round" />
      <path d="M16 8l-1 1" strokeLinecap="round" />
      <circle cx="9" cy="10" r="0.5" fill="currentColor" />
      <circle cx="15" cy="10" r="0.5" fill="currentColor" />
      <line x1="10" y1="15" x2="14" y2="15" strokeLinecap="round" />
    </svg>,

    // 7. Sleepy
    <svg key="sleepy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M7 9s1-1 2-1 2 1 2 1" strokeLinecap="round" />
      <path d="M13 9s1-1 2-1 2 1 2 1" strokeLinecap="round" />
      <ellipse cx="12" cy="16" rx="2" ry="1" fill="none" />
      <path d="M16 6s0-1 1-1 1 1 1 1" strokeLinecap="round" />
    </svg>,

    // 8. Curious
    <svg key="curious" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M6 8l2-1" strokeLinecap="round" />
      <path d="M16 7l2 1" strokeLinecap="round" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <path d="M10 15s1 1 2 1 2-1 2-1" strokeLinecap="round" />
    </svg>,

    // 9. Thinking
    <svg key="thinking" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <line x1="10" y1="15" x2="14" y2="15" strokeLinecap="round" />
      <circle cx="16" cy="6" r="1" fill="none" />
      <circle cx="18" cy="4" r="0.5" fill="currentColor" />
      <circle cx="19" cy="6" r="0.3" fill="currentColor" />
    </svg>,

    // 10. Smiling
    <svg key="smiling" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <path d="M9 15s1 1 3 1 3-1 3-1" strokeLinecap="round" />
    </svg>,

    // 11. Confused
    <svg key="confused" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <path d="M10 15h4" strokeLinecap="round" />
      <path d="M12 3v2" strokeLinecap="round" />
      <path d="M10 4l1 1" strokeLinecap="round" />
      <path d="M14 4l-1 1" strokeLinecap="round" />
    </svg>,

    // 12. Angry
    <svg key="angry" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M6 7l3 2" strokeLinecap="round" />
      <path d="M18 7l-3 2" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path d="M16 17s-1.5-2-4-2-4 2-4 2" strokeLinecap="round" />
    </svg>,

    // 13. Surprised
    <svg key="surprised" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="8" r="1.5" fill="none" />
      <circle cx="15" cy="8" r="1.5" fill="none" />
      <circle cx="9" cy="8" r="0.5" fill="currentColor" />
      <circle cx="15" cy="8" r="0.5" fill="currentColor" />
      <ellipse cx="12" cy="16" rx="1.5" ry="2" fill="none" />
    </svg>,

    // 14. Embarrassed
    <svg key="embarrassed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M7 9s1-1 2-1 2 1 2 1" strokeLinecap="round" />
      <path d="M13 9s1-1 2-1 2 1 2 1" strokeLinecap="round" />
      <path d="M10 15s1 1 2 1 2-1 2-1" strokeLinecap="round" />
      <circle cx="7" cy="11" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="17" cy="11" r="1" fill="currentColor" opacity="0.3" />
    </svg>,

    // 15. Cool (with glasses)
    <svg key="cool" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <rect x="6" y="7" width="4" height="4" rx="2" fill="currentColor" opacity="0.8" />
      <rect x="14" y="7" width="4" height="4" rx="2" fill="currentColor" opacity="0.8" />
      <line x1="10" y1="9" x2="14" y2="9" strokeLinecap="round" />
      <path d="M9 15s1 1 3 1 3-1 3-1" strokeLinecap="round" />
    </svg>,

    // 16. Winking
    <svg key="winking" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M7 9l4 0" strokeLinecap="round" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <path d="M8 15s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
    </svg>,

    // 17. Neutral
    <svg key="neutral" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round" />
    </svg>,
  ]

  useEffect(() => {
    setCurrentFaceIndex(Math.floor(Math.random() * faces.length))
  }, [faces.length])

  return (
    <div
      className={cn("inline-flex items-center justify-center text-gray-600 ${className}", className)}
      style={{ width: size, height: size }}
    >
      <div style={{ width: size, height: size }}>{faces[currentFaceIndex]}</div>
    </div>
  )
}
