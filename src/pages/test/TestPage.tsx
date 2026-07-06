import { TestWidget } from "@/pages/test/TestWidget.tsx";
import { Content } from "@/app/components/container/ContentContainer.tsx";

export const TestPage = () => {
  return (
    <>
      <Content>
        <TestWidget />
      </Content>
    </>
  );
};