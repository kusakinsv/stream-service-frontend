import { TestWidget } from "@/pages/test/TestWidget.tsx";
import { ContentStyled } from "@/app/components/container/ContentContainer.tsx";

export const TestPage = () => {
  return (
    <>
      <ContentStyled>
        <TestWidget />
      </ContentStyled>
    </>
  );
};