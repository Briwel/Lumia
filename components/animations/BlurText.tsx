import React from 'react';
import { motion } from 'motion/react';

interface BlurTextProps {
  text: string;
  delay?: number; // Delay in milliseconds before starting
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'none';
  duration?: number; // Duration in seconds per character/word
  stagger?: number; // Stagger in seconds between characters/words
  onAnimationComplete?: () => void;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0,
  className = '',
  animateBy = 'letters',
  direction = 'bottom',
  duration = 0.5,
  stagger = 0.03,
  onAnimationComplete
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  // Define starting offsets based on direction
  const getOffset = () => {
    switch (direction) {
      case 'top': return { y: -20, x: 0 };
      case 'bottom': return { y: 20, x: 0 };
      case 'left': return { y: 0, x: -20 };
      case 'right': return { y: 0, x: 20 };
      case 'none':
      default: return { y: 0, x: 0 };
    }
  };

  const offset = getOffset();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay / 1000,
      }
    }
  };

  const itemVariants = {
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
      y: offset.y,
      x: offset.x
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: duration,
        ease: [0.21, 1.02, 0.43, 1.01] as any // Refined elastic/springy transition
      }
    }
  };

  return (
    <motion.span
      className={`inline-block select-none ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onAnimationComplete={onAnimationComplete}
    >
      {elements.map((element, index) => {
        // If splitting by letters and the element is a space, render a non-breaking space
        if (animateBy === 'letters' && element === ' ') {
          return (
            <span key={index} className="inline-block">
              &nbsp;
            </span>
          );
        }
        return (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block"
            style={{ willChange: 'transform, filter, opacity' }}
          >
            {element}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </motion.span>
  );
};
