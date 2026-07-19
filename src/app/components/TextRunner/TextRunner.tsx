import { Box, styled } from "@mui/material";
import { useRef, useState, useEffect } from "react";

interface TextRunnerProps {
  children: React.ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  align?: 'left' | 'right' | 'center';
  gap?: number;
}

const Container = styled(Box)({
  overflow: "hidden",
  width: "100%",
  position: 'relative',
});

const Track = styled(Box)<{ $shouldAnimate: boolean; $speed: number; $pauseOnHover: boolean, $align: 'left' | 'right' | 'center' }>(
  ({ $shouldAnimate, $speed, $pauseOnHover, $align}) => ({
    display: "flex",
    whiteSpace: "nowrap",
    willChange: "transform",
    width: 'fit-content',
    minWidth: '100%',
    ...(!$shouldAnimate && {
      justifyContent: $align === 'left' ? 'flex-start' :
        $align === 'right' ? 'flex-end' :
          'center',
      width: '100%',
    }),
    ...($shouldAnimate && {
      animation: `marquee ${$speed}s linear infinite`,
    }),
    ...($pauseOnHover && $shouldAnimate && {
      "&:hover": {
        animationPlayState: "paused",
      },
    }),
    "@keyframes marquee": {
      "0%": { transform: "translateX(0%)" },
      "100%": { transform: "translateX(-50%)" },
    },
  }),
);

const Item = styled(Box)<{ $shouldAnimate: boolean; $gap: number }>(
  ({ $shouldAnimate, $gap }) => ({
    flexShrink: 0,
    // paddingRight применяется только когда анимация активна
    ...($shouldAnimate && {
      paddingRight: $gap,
    }),
    // Когда анимация выключена - padding отсутствует
  })
);

export const TextRunner: React.FC<TextRunnerProps> = (
  {
    children,
    speed = 10,
    pauseOnHover = true,
    align = 'left',
    gap = 50
  }: TextRunnerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;
        setShouldAnimate(contentWidth > containerWidth);
      }
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
      resizeObserver.disconnect();
    };
  }, [children]);

  return (
    <Container ref={containerRef}>
      <Track
        $align={align}
        $shouldAnimate={shouldAnimate}
        $speed={speed}
        $pauseOnHover={pauseOnHover}
      >
        <Item ref={contentRef} $shouldAnimate={shouldAnimate} $gap={gap}>
          {children}
        </Item>
        {shouldAnimate && (
          <Item $shouldAnimate={shouldAnimate} $gap={gap}>
            {children}
          </Item>
        )}
      </Track>
    </Container>
  );
};