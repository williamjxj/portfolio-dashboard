/**
 * Animation utilities for consistent animations across the application
 * Supports reduced motion preferences and performance optimization
 */

import { Variants, Transition } from 'framer-motion';

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  reducedMotion?: boolean;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on reduced motion preference
 */
export function getAnimationDuration(baseDuration: number = 0.3, config?: AnimationConfig): number {
  if (config?.reducedMotion || prefersReducedMotion()) {
    return 0;
  }
  return config?.duration || baseDuration;
}

/**
 * Get stagger delay for multiple elements
 */
export function getStaggerDelay(index: number, baseDelay: number = 0.1, config?: AnimationConfig): number {
  if (config?.reducedMotion || prefersReducedMotion()) {
    return 0;
  }
  return (config?.delay || 0) + (index * (config?.stagger || baseDelay));
}

/**
 * Get easing function
 */
export function getEasing(config?: AnimationConfig): string {
  if (config?.reducedMotion || prefersReducedMotion()) {
    return 'linear';
  }
  return config?.ease || 'easeOut';
}

/**
 * Fade in animation variants
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

/**
 * Slide up animation variants
 */
export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

/**
 * Slide down animation variants
 */
export const slideDownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

/**
 * Slide left animation variants
 */
export const slideLeftVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

/**
 * Slide right animation variants
 */
export const slideRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

/**
 * Scale animation variants
 */
export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

/**
 * Stagger container variants
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

/**
 * Stagger item variants
 */
export const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

/**
 * Hover animation variants
 */
export const hoverVariants: Variants = {
  rest: { 
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

/**
 * Tap animation variants
 */
export const tapVariants: Variants = {
  rest: { 
    scale: 1 
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1, ease: 'easeOut' }
  }
};

/**
 * Card hover animation variants
 */
export const cardHoverVariants: Variants = {
  rest: { 
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  hover: { 
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

/**
 * Modal animation variants
 */
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

/**
 * Backdrop animation variants
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

/**
 * Loading animation variants
 */
export const loadingVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

/**
 * Pulse animation variants
 */
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

/**
 * Shimmer animation variants
 */
export const shimmerVariants: Variants = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

/**
 * Bounce animation variants
 */
export const bounceVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

/**
 * Float animation variants
 */
export const floatVariants: Variants = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

/**
 * Create custom animation variants
 */
export function createAnimationVariants(config: AnimationConfig = {}): Variants {
  const duration = getAnimationDuration(0.3, config);
  const ease = getEasing(config);

  return {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration, ease }
    }
  };
}

/**
 * Create stagger animation variants
 */
export function createStaggerVariants(
  itemVariants: Variants = staggerItemVariants,
  staggerDelay: number = 0.1
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };
}

/**
 * Create hover animation variants
 */
export function createHoverVariants(
  scale: number = 1.05,
  duration: number = 0.2
): Variants {
  return {
    rest: { 
      scale: 1,
      transition: { duration, ease: 'easeOut' }
    },
    hover: { 
      scale,
      transition: { duration, ease: 'easeOut' }
    }
  };
}

/**
 * Create transition object
 */
export function createTransition(config: AnimationConfig = {}): Transition {
  return {
    duration: getAnimationDuration(0.3, config),
    ease: getEasing(config),
    delay: config.delay || 0
  };
}

/**
 * Create spring transition
 */
export function createSpringTransition(config: AnimationConfig = {}): Transition {
  return {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    delay: config.delay || 0
  };
}

/**
 * Create bounce transition
 */
export function createBounceTransition(config: AnimationConfig = {}): Transition {
  return {
    type: 'spring',
    stiffness: 400,
    damping: 10,
    delay: config.delay || 0
  };
}

/**
 * Animation presets for common use cases
 */
export const animationPresets = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: 'easeOut' }
  },

  // Card animations
  cardEnter: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },

  // Modal animations
  modalEnter: {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  // Button animations
  buttonHover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },

  // Loading animations
  loading: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }
};

/**
 * Utility function to check if animations should be disabled
 */
export function shouldDisableAnimations(): boolean {
  return prefersReducedMotion();
}

/**
 * Utility function to get animation-safe variants
 */
export function getAnimationSafeVariants(variants: Variants): Variants {
  if (shouldDisableAnimations()) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 }
    };
  }
  return variants;
}
