"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const MINIMUM_DISPLAY_TIME = 500;

export default function NavigationProgress() {
  const pathname = usePathname();

  const startedAtRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const container = document.getElementById(
      "jk-navigation-progress"
    );

    const indicator = document.getElementById(
      "jk-navigation-progress-indicator"
    );

    if (!container || !indicator) {
      return;
    }

    const startedAt = startedAtRef.current;

    if (startedAt === null) {
      return;
    }

    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(
      0,
      MINIMUM_DISPLAY_TIME - elapsed
    );

    hideTimerRef.current = setTimeout(() => {
      container.style.opacity = "0";

      resetTimerRef.current = setTimeout(() => {
        indicator.style.transform = "translateX(-120%)";
        startedAtRef.current = null;
      }, 180);
    }, remaining);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, [pathname]);

  useEffect(() => {
    const container = document.getElementById(
      "jk-navigation-progress"
    );

    const indicator = document.getElementById(
      "jk-navigation-progress-indicator"
    );

    if (!container || !indicator) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as Element | null;
      const link = target?.closest("a");

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) {
        return;
      }

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      const targetUrl = new URL(
        href,
        window.location.origin
      );

      if (targetUrl.origin !== window.location.origin) {
        return;
      }

      const currentUrl =
        window.location.pathname +
        window.location.search;

      const nextUrl =
        targetUrl.pathname +
        targetUrl.search;

      if (nextUrl === currentUrl) {
        return;
      }

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      startedAtRef.current = Date.now();

      container.style.opacity = "1";

      indicator.style.transition = "none";
      indicator.style.transform = "translateX(-120%)";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          indicator.style.transition =
            "transform 900ms cubic-bezier(0.4, 0, 0.2, 1)";

          indicator.style.transform = "translateX(300%)";
        });
      });
    };

    document.addEventListener(
      "click",
      handleClick,
      true
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClick,
        true
      );
    };
  }, []);

  return (
    <div
      id="jk-navigation-progress"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[9999] h-[4px] overflow-hidden bg-transparent"
      style={{
        opacity: 0,
        transition: "opacity 180ms ease-out",
      }}
    >
      <div
        id="jk-navigation-progress-indicator"
        className="h-full w-[30%] rounded-r-full bg-[#C89A84] shadow-[0_1px_10px_rgba(200,154,132,0.7)]"
        style={{
          transform: "translateX(-120%)",
        }}
      />
    </div>
  );
}