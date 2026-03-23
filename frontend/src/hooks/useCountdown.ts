import { useState, useEffect } from 'react'
import { getTimeRemaining } from '@/lib/utils'

/**
 * Countdown hook that works with both Date objects and ISO date strings.
 * It ensures the end time is always a Date instance before calculating the
 * remaining time. The hook also stops the interval when the countdown ends.
 */
export function useCountdown(endTime: Date | string) {
  // Helper to normalize the endTime to a Date instance
  const normalize = (et: Date | string): Date => {
    if (!et) return new Date(); // Avoid crashes if undefined/null
    const date = typeof et === 'string' ? new Date(et) : et;
    return isNaN(date.getTime()) ? new Date() : date;
  }

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(normalize(endTime)))

  useEffect(() => {
    if (!endTime) return;
    const target = normalize(endTime)
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(target)
      setTimeLeft(remaining)
      // Stop the timer when the countdown has ended
      if (remaining.isEnded) clearInterval(timer)
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return timeLeft
}
