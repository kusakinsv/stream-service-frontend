import { type PropsWithChildren } from "react";

import { LayoutBoxStyled } from "@/app/components/page/LayoutBoxStyled.ts";
//todo доделать скролл в версии для компьютера
export const Layout = ({ children }: PropsWithChildren) => {
  // const scrollContainerRef = useRef<HTMLDivElement>(null);
  // const contentRef = useRef<HTMLDivElement>(null);

  // const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  //   if (contentRef.current) {
  //     contentRef.current.scrollTop = e.currentTarget.scrollTop;
  //   }
  // };

  return (
    <>
    <LayoutBoxStyled id="main-layout">
      {children}
      {/* ВИРТУАЛЬНЫЙ СКРОЛЛ - находится справа от родителя */}
      {/*<div*/}
      {/*  ref={scrollTrackRef}*/}
      {/*  onScroll={handleScroll}*/}
      {/*  */}
      {/*  style={{*/}
      {/*    position: 'absolute',*/}
      {/*    right: 0,*/}
      {/*    top: 0,*/}
      {/*    width: '14px',*/}
      {/*    height: '100%',*/}
      {/*    overflow: 'auto',*/}
      {/*    backgroundColor: 'transparent',*/}
      {/*    zIndex: 10,*/}
      {/*    // Стили для скролла*/}
      {/*    scrollbarWidth: 'thin',*/}
      {/*    scrollbarColor: '#95a5a6 #ecf0f1',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <div style={{*/}
      {/*    height: `500%`, // Высота контента*/}
      {/*    width: '1px',*/}
      {/*    pointerEvents: 'none'*/}
      {/*  }} />*/}
      {/*</div>*/}
    </LayoutBoxStyled>
</>
)
  ;
};