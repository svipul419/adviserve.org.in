import React from "react";
import {
  Github,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
} from "lucide-react";
import { useAnimate } from "framer-motion";

export const ClipPathLinks = () => {
  return (
    <div className="divide-y border divide-white/10 border-black/10 mt-12 bg-ink-raised rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <LinkBox Icon={Mail} href="mailto:contact@adviserve.com" />
        <LinkBox Icon={Linkedin} href="#" />
      </div>
      <div className="grid grid-cols-4 divide-x divide-white/10">
        <LinkBox Icon={Twitter} href="#" />
        <LinkBox Icon={Github} href="#" />
        <LinkBox Icon={Instagram} href="#" />
        <LinkBox Icon={Facebook} href="#" />
      </div>
      <div className="grid grid-cols-3 divide-x divide-white/10">
        <LinkBox
          href="#"
          className="h-10 w-auto object-contain grayscale opacity-80"
          imgSrc="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        />
        <LinkBox
          href="#"
          className="h-10 w-auto object-contain grayscale opacity-80"
          imgSrc="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        />
        <LinkBox
          href="#"
          className="h-10 w-auto object-contain grayscale opacity-80"
          imgSrc="https://images.unsplash.com/photo-1611162618071-b39a2ec05f01?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        />
      </div>
    </div>
  );
};

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES: Record<string, string[]> = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES: Record<string, string[]> = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

const LinkBox = ({ Icon, href, imgSrc, className }: any) => {
  const [scope, animate] = useAnimate();

  const getNearestSide = (e: React.MouseEvent) => {
    const box = (e.target as HTMLElement).getBoundingClientRect();

    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left",
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right",
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top",
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom",
    };

    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);

    return sortedProximity[0].side;
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: ENTRANCE_KEYFRAMES[side],
    });
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: EXIT_KEYFRAMES[side],
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative grid h-20 w-full place-content-center sm:h-28 md:h-36 text-gray-600 hover:text-black transition-colors"
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="custom"
          className={className ?? "max-h-10 sm:max-h-16 md:max-h-20 object-contain"}
        />
      ) : (
        <Icon className="text-xl sm:text-3xl md:text-3xl" />
      )}

      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 grid place-content-center bg-accent-blue text-black"
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="custom hover"
            className={className ?? "max-h-10 sm:max-h-16 md:max-h-20 object-contain"}
          />
        ) : (
          <Icon className="text-xl sm:text-3xl md:text-3xl" />
        )}
      </div>
    </a>
  );
};
