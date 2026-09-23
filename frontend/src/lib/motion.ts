// Centralized Framer Motion configuration
// All animation variants and tokens in one place

export const EASING = [0.22, 1, 0.36, 1] as const;
export const EASING_DASHBOARD = [0.16, 1, 0.3, 1] as const;

// Standard reveal
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASING },
  },
};

// Stagger container
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

// Hero stagger
export const heroStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Hero text item
export const heroTextItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASING },
  },
};

// Hero dashboard
export const heroDashboard = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASING_DASHBOARD },
  },
};

// Feature card
export const featureCard = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASING },
  },
};

// Card hover
export const cardHover = {
  y: -6,
  transition: { type: "spring", stiffness: 350, damping: 25 },
};

// Course card hover
export const courseCardHover = {
  y: -8,
  transition: { type: "spring", stiffness: 350, damping: 25 },
};

// Dashboard showcase
export const dashboardReveal = {
  hidden: { opacity: 0, scale: 0.96, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASING_DASHBOARD },
  },
};

// Testimonial enter/exit
export const testimonialEnter = { opacity: 0, x: 40 };
export const testimonialCenter = { opacity: 1, x: 0 };
export const testimonialExit = { opacity: 0, x: -40 };
export const testimonialTransition = {
  duration: 0.45,
  ease: EASING,
};

// FAQ accordion
export const faqOpen = {
  height: "auto",
  opacity: 1,
  transition: { duration: 0.35, ease: EASING },
};
export const faqClosed = {
  height: 0,
  opacity: 0,
  transition: { duration: 0.35, ease: EASING },
};

// CTA button hover
export const ctaHover = {
  scale: 1.04,
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

// CTA idle pulse (disabled under reduced-motion)
export const ctaPulse = {
  scale: [1, 1.015, 1],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Footer column
export const footerCol = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASING },
  },
};

export const footerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Toast
export const toastEnter = {
  opacity: 0,
  x: 80,
};
export const toastAnimate = {
  opacity: 1,
  x: 0,
};
export const toastExit = {
  opacity: 0,
  x: 80,
};

// Modal
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
export const modalDialog = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 15 },
};

// Magnetic button
export const magneticSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
  mass: 0.5,
};

// Scroll reveal wrapper
export const scrollReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASING },
  },
};

// Viewport config
export const viewportOnce = { once: true, amount: 0.15 };
