import { useRef, useMemo, useState, useEffect, useCallback } from "react";

import type { AudioItem, AudioTrackData } from "@/app/types.ts";

import { PROXY_SERVER_URL } from "@/app/constants.ts";

interface UseFilterValidAudiosOptions {
  concurrency?: number;
  itemTimeout?: number;
  globalTimeout?: number;
}

interface UseFilterValidAudiosResult<T extends AudioTrackData> {
  validatedItems: T[];             // Отфильтрованные валидные треки
  isLoading: boolean;          // Идет ли проверка
}

const PROXY_SERVER_PART = "/api/v1/proxy?url=";

/**
 * из-за конкуррентности может вызывать дубли
 */
export const useValidateAudioTracks = <T extends AudioItem>(items: T[], {
  concurrency = 3,
  itemTimeout = 1500,
  globalTimeout = 7000,
}: UseFilterValidAudiosOptions): UseFilterValidAudiosResult<AudioTrackData> => {
  const memoItems = useMemo(()=> items, []);

  const [validated, setValidated] = useState<AudioTrackData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeRequestsRef = useRef(0);
  const abortControllersRef = useRef<Set<AbortController>>(new Set());
  const currentIndexRef = useRef(0);
  const isMountedRef = useRef(true);
  const globalTimeoutRef = useRef<number | undefined>();
  const itemTimeoutsRef = useRef<Set<number>>(new Set());

  //функиця очистки
  const cleanup = useCallback(() => {
    if (globalTimeoutRef.current) {
      clearTimeout(globalTimeoutRef.current);
      globalTimeoutRef.current = undefined;
    }
    itemTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    itemTimeoutsRef.current.clear();
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();
    activeRequestsRef.current = 0;
  }, []);


  const validateSingleAudio = useCallback((item: AudioItem): Promise<AudioTrackData> => {
    const validationPromise = new Promise<AudioTrackData>((resolve) => {
      const controller = new AbortController();
      abortControllersRef.current.add(controller);

      const timeoutId = window.setTimeout(() => {
        controller.abort();
        cleanupAudio();
        const invalidAudio = createInvalidResult(item);
        resolve(invalidAudio);
      }, itemTimeout);

      itemTimeoutsRef.current.add(timeoutId);

      let audio = new Audio();

      const cleanupAudio = () => {
        if (audio) {
          audio.removeEventListener("canplay", handleSuccessWithoutProxy);
          audio.removeEventListener("canplay", handleSuccessWithProxy);
          audio.removeEventListener("error", retryWithProxy);
          audio.removeEventListener("error", handleError);
          audio.src = "";
        }
      };

      const handleSuccessWithoutProxy = () => {
        console.log(`success without proxy: ${item.url} `);
        clearTimeout(timeoutId);
        itemTimeoutsRef.current.delete(timeoutId);
        abortControllersRef.current.delete(controller);
        cleanupAudio();
        const validAudio = createValidResult(item, audio, false);
        if (validAudio.duration !== null && !isNaN(validAudio.duration)) {
          resolve(validAudio);
        }
      };

      const retryWithProxy = () => {
        console.log(`retry with proxy ${item.url}`);
        cleanupAudio();
        audio.remove();
        audio = new Audio();
        audio.addEventListener("canplay", handleSuccessWithProxy);
        audio.addEventListener("error", handleError);
        audio.src = addProxy(audio.src);
        try {
          audio.load();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          /* игнорируем */
        }
      };

      const handleSuccessWithProxy = () => {
        console.log(`success with proxy: ${item.url} `);
        clearTimeout(timeoutId);
        itemTimeoutsRef.current.delete(timeoutId);
        abortControllersRef.current.delete(controller);
        cleanupAudio();
        const validAudio = createValidResult(item, audio, true);
        if (validAudio.duration !== null && !isNaN(validAudio.duration)) {
          resolve(validAudio);
        }
      };

      const handleError = () => {
        clearTimeout(timeoutId);
        itemTimeoutsRef.current.delete(timeoutId);
        abortControllersRef.current.delete(controller);
        cleanupAudio();
        console.log("err2");
        const invalidAudio = createInvalidResult(item);
        resolve(invalidAudio);
      };


      audio.addEventListener("canplay", handleSuccessWithoutProxy);
      audio.addEventListener("error", retryWithProxy);
      audio.src = item.url;
      try {
        audio.load();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { /* empty */
        /* игнорируем */
      }
    });

    return validationPromise;
  },[itemTimeout]);


  useEffect(() => {
    isMountedRef.current = true;
    setValidated([]);
    setIsLoading(true);

    if (!memoItems.length) {
      setIsLoading(false);
      return;
    }

    // Сбрасываем индексы и счётчики перед запуском
    currentIndexRef.current = 0;
    activeRequestsRef.current = 0;

    globalTimeoutRef.current = window.setTimeout(() => {
      cleanup();
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }, globalTimeout);

    // return () => {
    //   isMountedRef.current = false;
    //   if (globalTimeoutRef.current) {
    //     clearTimeout(globalTimeoutRef.current);
    //   }
    //   itemTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    //   abortControllersRef.current.forEach(controller => controller.abort());
    // };

    const startNextIfNeeded = () => {
      while (
        isMountedRef.current &&
        activeRequestsRef.current < concurrency &&
        currentIndexRef.current < memoItems.length
        ) {
        const index = currentIndexRef.current;
        const item = memoItems[index];
        currentIndexRef.current++;
        activeRequestsRef.current++;

        validateSingleAudio(item)
          .then((result) => {
            if (isMountedRef.current) {
              setValidated(prev => [...prev, result]);
            }
          })
          .finally(() => {
            activeRequestsRef.current--;
            startNextIfNeeded();
          });
      }

      if (
        activeRequestsRef.current === 0 &&
        currentIndexRef.current >= memoItems.length &&
        isMountedRef.current
      ) {
        cleanup();
        setIsLoading(false);
      }
    };

    for (let i = 0; i < Math.min(concurrency, memoItems.length); i++) {
      startNextIfNeeded();
    }

    return () => {
      isMountedRef.current = false;
      cleanup();
    };

  }, [memoItems, concurrency]);

  return { isLoading, validatedItems: validated };
};

function createValidResult<T extends AudioItem>(item: T, audio: HTMLAudioElement, isNeedProxy: boolean): AudioTrackData {
  const result = {
    ...item,
    isValid: true,
    audioElem: audio,
    duration: audio.duration,
    isNeedProxy: isNeedProxy,
  } as AudioTrackData;

  if ("position" in item && (typeof item.position === "number" || typeof item.position === "undefined")) {
    result.position = item.position;
  }
  return result;
}

function createInvalidResult<T extends AudioItem>(item: T): AudioTrackData {
  const result = {
    ...item,
    duration: null,
    isValid: false,
    audioElem: null,
  } as AudioTrackData;
  if ("position" in item && (typeof item.position === "number" || typeof item.position === "undefined")) {
    result.position = item.position;
  }
  return result;
}

function addProxy(url: string) {
  return PROXY_SERVER_URL + PROXY_SERVER_PART + url;
}