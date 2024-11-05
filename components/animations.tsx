"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useAnimate, Variants } from "framer-motion";
import React, { useState } from "react";
import { TbMinus, TbPlus } from "react-icons/tb";

export default function LimitedCounter() {
  const [number, setNumber] = useState(0);
  const [direction, setDirection] = useState(1);

  const [scope, animate] = useAnimate();

  const handleClick = (action: "decrease" | "increase") => {
    if (action === "decrease") {
      if (number === 0) {
        animate(scope.current, { x: [0, 5, -5, 0] }, { duration: 0.2 });
        return;
      }

      setNumber(number - 1);
      setDirection(-1);
    } else if (action === "increase") {
      if (number === 20) {
        animate(scope.current, { x: [0, 5, -5, 0] }, { duration: 0.2 });
        return;
      }
      setNumber(number + 1);
      setDirection(1);
    }
  };

  return (
    <div className="mx-auto flex items-center justify-center">
      <div
        ref={scope}
        className="flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-neutral-200/50 p-0.5 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <button
          onClick={() => handleClick("decrease")}
          className={cn(
            "rounded-full bg-neutral-300 p-2 transition-colors",
            number > 0 && "hover:bg-neutral-400/50 active:bg-neutral-400/60",
            number === 0 && "cursor-not-allowed opacity-50",
            "dark:bg-neutral-700 dark:text-neutral-400",
            number > 0 &&
              "dark:hover:bg-neutral-500/50 dark:active:bg-neutral-500/30",
            "focus:outline-none",
          )}
          aria-label="Decrease"
        >
          <TbMinus size={20} />
        </button>

        <h3 className="w-12 text-center">
          <AnimatePresence mode="popLayout" custom={direction}>
            {number
              .toString()
              .split("")
              .map((value, index) => (
                <motion.span
                  key={`${value} ${index}`}
                  variants={animation}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={direction}
                  className="inline-block tabular-nums"
                >
                  {value}
                </motion.span>
              ))}
          </AnimatePresence>
        </h3>

        <button
          onClick={() => handleClick("increase")}
          className={cn(
            "rounded-full bg-neutral-300 p-2 transition-colors",
            number < 20 && "hover:bg-neutral-400/50 active:bg-neutral-400/60",
            number === 20 && "cursor-not-allowed opacity-50",
            "dark:bg-neutral-700 dark:text-neutral-400",
            number < 20 &&
              "dark:hover:bg-neutral-500/50 dark:active:bg-neutral-500/30",
            "focus:outline-none",
          )}
          aria-label="Increase"
        >
          <TbPlus size={20} />
        </button>
      </div>
    </div>
  );
}

const animation: Variants = {
  hidden: (direction: -1 | 1) => ({
    y: direction === 1 ? 13 : -13,
    opacity: 0,
    filter: "blur(4px)",
  }),
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (direction: -1 | 1) => ({
    y: direction === 1 ? -13 : 13,
    opacity: 0,
    filter: "blur(4px)",
  }),
};
