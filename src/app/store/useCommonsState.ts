import type { RefObject } from "react";

import { create } from "zustand/react";

interface CommonsState {
  // Состояние
  scrollPosition: number;
  scrollHeight: number;
  containerRef: null | RefObject<HTMLDivElement>;
  isUserScrolling: boolean;

  // Действия
  setScrollPosition: (position: number) => void;
  setScrollHeight: (height: number) => void;
  registerContainer: (ref: RefObject<HTMLDivElement>) => void;
  scrollTo: (position: number) => void;
  updateScroll: () => void;
  setIsUserScrolling: (isScrolling: boolean) => void;
}

export const useScrollStore = create<CommonsState>((set, get) => ({
  // Начальное состояние
  scrollPosition: 0,
  scrollHeight: 0,
  containerRef: null,
  isUserScrolling: false,

  // Действия
  setScrollPosition: (position) => {
    set({ scrollPosition: position });

    // Синхронизируем с контейнером
    const { containerRef } = get();
    if (containerRef?.current) {
      containerRef.current.scrollTop = position;
    }
  },

  setScrollHeight: (height) => {
    set({ scrollHeight: height });
  },

  registerContainer: (ref) => {
    set({ containerRef: ref });

    // Обновляем высоту при регистрации
    if (ref.current) {
      set({
        scrollHeight: ref.current.scrollHeight,
        scrollPosition: ref.current.scrollTop
      });
    }
  },

  scrollTo: (position) => {
    const { containerRef } = get();
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: position,
        behavior: 'smooth'
      });
      set({ scrollPosition: position });
    }
  },

  updateScroll: () => {
    const { containerRef } = get();
    if (containerRef?.current) {
      set({
        scrollPosition: containerRef.current.scrollTop,
        scrollHeight: containerRef.current.scrollHeight
      });
    }
  },

  setIsUserScrolling: (isScrolling) => {
    set({ isUserScrolling: isScrolling });
  }
}));