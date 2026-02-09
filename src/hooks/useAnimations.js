import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useEntranceAnimation = (scope) => {
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      gsap.from(".animate-entrance", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
      });
    },
    { scope: scope },
  );
};

export const useStaggerReveal = (scope, selector, delay = 0, deps = []) => {
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      gsap.from(selector, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        delay: delay,
        clearProps: "all",
      });
    },
    { scope: scope, dependencies: deps },
  );
};

export const animateButtonPress = (element) => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: "power1.out",
    yoyo: true,
    repeat: 1,
  });
};

export const animateStatusChange = (element) => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    gsap.set(element, { opacity: 1, scale: 1 });
    return;
  }

  gsap.fromTo(
    element,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
  );
};

export const animateFilterSwitch = (scope) => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    gsap.set(scope.current, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    scope.current,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" },
  );
};
