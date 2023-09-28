import type { MotionProps, Transition } from "framer-motion";

type SetTransition = Pick<MotionProps, "initial" | "animate" | "exit">;
type TransitionType = "tween" | "inertia" | "spring";

type SetTransitionProps = {
  typeIn?: TransitionType;
  typeOut?: TransitionType;
  delay?: number;
  duration?: number;
  distanceX?: number;
  distanceY?: number;
  scale?: number;
  bounceDamping?: number;
  opacity?: number;
};

export function setTransition({
  typeIn = "tween",
  typeOut = "tween",
  delay = 0,
  duration,
  distanceX,
  distanceY,
  scale,
  bounceDamping = 10,
  opacity,
}: SetTransitionProps = {}): SetTransition {
  const transitionIn: Transition = {
    type: typeIn,
    delay: delay,
    duration: duration,
    opacity: opacity,
  };

  const transitionOut: Transition = {
    type: typeOut,
    delay: delay,
    duration: duration,
    opacity: opacity,
  };

  return {
    initial: {
      opacity: 0,
      x: distanceX,
      y: distanceY,
      scale: scale,
    },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        ...transitionIn,
        damping: bounceDamping,
      },
    },
    exit: {
      opacity: 0,
      x: distanceX,
      y: distanceY,
      scale: scale,
      transition: transitionOut,
    },
  };
}

type FadeInWhenVisible = Pick<
  MotionProps,
  "viewport" | "initial" | "whileInView" | "transition"
>;

export function fadeInWhenVisible(): FadeInWhenVisible {
  return {
    viewport: { margin: "0px 0px -100px" },
    initial: { y: 50, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    transition: { type: "spring" },
  };
}
