import { Router } from "@/app/routes/router.tsx";

export const App = () => {
  // useEffect(() => {
  //   mediaSessionService.init();
  //
  //   // Очистка при размонтировании
  //   return () => {
  //     mediaSessionService.destroy();
  //   };
  // }, []);

  return  <Router />;

};

