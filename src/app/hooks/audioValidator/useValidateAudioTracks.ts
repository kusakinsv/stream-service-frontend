import { useRef, useMemo, useState, useEffect, useCallback } from "react";

import type { AudioItem, AudioTrackData } from "@/app/types.ts";

import { PROXY_SERVER_URL } from "@/app/constants.ts";
import { removeDuplicates } from "@/app/utils/utils.ts";

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
  const [validated, setValidated] = useState<AudioTrackData[]>([]);
  const duplicatesRemoved = useMemo(() => removeDuplicates(validated), [validated]);

  const [isLoading, setIsLoading] = useState(true);

  const activeRequestsRef = useRef(0);
  const currentIndexRef = useRef(0);
  const isMountedRef = useRef(true);
  const globalTimeoutRef = useRef<number | undefined>();
  const itemTimeoutsRef = useRef<Set<number>>(new Set());
  const abortControllersRef = useRef<Set<AbortController>>(new Set());

  const startValidation = useCallback(async () => {
    if (!items.length) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setValidated([]);
    currentIndexRef.current = 0;
    activeRequestsRef.current = 0;

    const urlCache = new Map<string, AudioTrackData>();
    const pendingUrls = new Map<string, Promise<AudioTrackData>>();
    const addedUrls = new Set<string>();

    // Глобальный таймаут
    globalTimeoutRef.current = window.setTimeout(() => {
      cleanup();
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }, globalTimeout);

    const validateSingleAudio = (item: AudioItem): Promise<AudioTrackData> => {
      if (urlCache.has(item.url)) {
        console.log(item.url + " Уже проверялся");
        return Promise.resolve(urlCache.get(item.url)!);
      }

      if (pendingUrls.has(item.url)) {
        console.log(item.url + " Сейчас проверяется");
        return pendingUrls.get(item.url)!;
      }

      const validationPromise = new Promise<AudioTrackData>((resolve) => {
        const controller = new AbortController();
        abortControllersRef.current.add(controller);

        const timeoutId = window.setTimeout(() => {
          controller.abort();
          cleanupAudio();
          pendingUrls.delete(item.url);
          const invalidAudio = createInvalidResult(item);
          urlCache.set(item.url, invalidAudio);
          resolve(invalidAudio);
        }, itemTimeout);

        itemTimeoutsRef.current.add(timeoutId);

        let audio = new Audio();

        const cleanupAudio = () => {
          if (audio) {
            // audio.removeEventListener("canplay", handleSuccess);
            // audio.removeEventListener("error", retryWithProxy);
            audio.removeEventListener("canplay", handleSuccessWithProxy);
            audio.removeEventListener("error", handleError);
          }
        };

        const handleSuccess = () => {
          const url = item.url
          console.log(item.title + " : " + url);
          clearTimeout(timeoutId);
          itemTimeoutsRef.current.delete(timeoutId);
          abortControllersRef.current.delete(controller);
          pendingUrls.delete(item.url);
          cleanupAudio();
          const validAudio = createValidResult(item, audio, false);
          urlCache.set(item.url, validAudio);
          if (validAudio.duration !== null && !isNaN(validAudio.duration)) {
            urlCache.set(item.url, validAudio);
            resolve(validAudio);
          }
        };

        const retryWithProxy = () => {
          clearTimeout(timeoutId);
          itemTimeoutsRef.current.delete(timeoutId);
          abortControllersRef.current.delete(controller);
          audio.removeEventListener("canplay", handleSuccess);
          audio.removeEventListener("error", retryWithProxy);

          // console.log("err2");
          cleanupAudio();
          audio.addEventListener("canplay", handleSuccessWithProxy);
          audio.addEventListener("error", handleError);
          const url = addProxy(item.url)
          // console.log(item.title + " : " + url);
          audio.src = url;
          // console.log("proxyUrl: " + item.url);
          try {
            audio.load();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) { /* empty */
          }

        };

        const handleSuccessWithProxy = () => {
          clearTimeout(timeoutId);
          itemTimeoutsRef.current.delete(timeoutId);
          abortControllersRef.current.delete(controller);
          pendingUrls.delete(item.url);
          cleanupAudio();
          const validAudio = createValidResult(item, audio, true);
          urlCache.set(item.url, validAudio);
          if (validAudio.duration !== null && !isNaN(validAudio.duration)) {
            urlCache.set(item.url, validAudio);
            resolve(validAudio);
          }
        };

        const handleError = () => {
          // console.log("err3");
          clearTimeout(timeoutId);
          itemTimeoutsRef.current.delete(timeoutId);
          abortControllersRef.current.delete(controller);
          pendingUrls.delete(item.url);
          cleanupAudio();
          const invalidAudio = createInvalidResult(item);
          urlCache.set(item.url, invalidAudio);
          resolve(invalidAudio);
        };

        audio = new Audio();
        audio.addEventListener("canplay", handleSuccess);
        audio.addEventListener("error", retryWithProxy);
        const url = item.url
        audio.src = url;
        try {
          audio.load();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { /* empty */
          // console.log("err1");
        }
      });

      pendingUrls.set(item.url, validationPromise);
      validationPromise.finally(() => {
        pendingUrls.delete(item.url);
      });

      return validationPromise;
    };

    const cleanup = () => {
      if (globalTimeoutRef.current) {
        clearTimeout(globalTimeoutRef.current);
        globalTimeoutRef.current = undefined;
      }
      itemTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      itemTimeoutsRef.current.clear();
      abortControllersRef.current.forEach(controller => controller.abort());
      abortControllersRef.current.clear();
      activeRequestsRef.current = 0;
    };

    const startNextIfNeeded = async () => {
      while (
        isMountedRef.current &&
        activeRequestsRef.current < concurrency &&
        currentIndexRef.current < items.length
        ) {
        const index = currentIndexRef.current;
        const item = items[index];
        currentIndexRef.current++;
        activeRequestsRef.current++;

        validateSingleAudio(item)
          .then((result) => {
            if (isMountedRef.current && !addedUrls.has(item.url)) {
              addedUrls.add(item.url);
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
        currentIndexRef.current >= items.length &&
        isMountedRef.current
      ) {
        cleanup();
        setIsLoading(false);
      }
    };

    for (let i = 0; i < Math.min(concurrency, items.length); i++) {
      startNextIfNeeded();
    }
  }, [items, concurrency, itemTimeout, globalTimeout]);

  useEffect(() => {
    isMountedRef.current = true;
    startValidation();

    return () => {
      isMountedRef.current = false;
      if (globalTimeoutRef.current) {
        clearTimeout(globalTimeoutRef.current);
      }
      itemTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      abortControllersRef.current.forEach(controller => controller.abort());
    };
  }, [items, startValidation]);

  return { isLoading, validatedItems: duplicatesRemoved };
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