import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number; // in seconds
  className?: string;
  startOnView?: boolean;
  once?: boolean;
  format?: (value: number) => string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startOnView = true,
  once = true,
  format = (value) => Math.floor(value).toLocaleString(),
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  // Calculate spring physics based on duration
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 120,
  });

  const isInView = useInView(ref, { once, margin: "0px" });

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = format(direction === "down" ? to : from);
    }
  }, [from, to, direction, format]);

  useEffect(() => {
    if (!isInView && startOnView) return;

    const timer = setTimeout(() => {
      motionValue.set(direction === "down" ? from : to);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, startOnView, motionValue, delay, direction, from, to]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = format(latest);
      }
    });
  }, [springValue, format]);

  return <span ref={ref} className={className} />;
};
