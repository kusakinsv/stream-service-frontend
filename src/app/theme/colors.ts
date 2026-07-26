export const getColors = () => {
  return {
    grey: {
      panelsMain: "#3a3d41",
      background: "#222222",
      panelsDark: "#2b2d31",
      panelsDark2: "#222222",
      textSecondary: "#b5bac1",
      light: "#cfd6dc"
    },
    blue: {
      dark: '#4e34f7',       // темный оттенок для нажатых кнопок
      main: '#6862fd',       // основной цвет кнопок и акцентов
      light: '#8a85fe',      // более светлый оттенок для hover/активных состояний
    },
    white: {
      main: "#FFF",
      secondary: "#ECEDEE",
      opacity: {
        5: "#FFFFFF0D",
        60: "#FFFFFF99",
        50: "#ffffff80",
        20: "#FFFFFF33",
        13: "#FFFFFF21",
        10: "#FFFFFF1A",
        80: "#FFFFFFCC",
      },
    },
    border: {
      main: "#FFFFFF33"
    },
    red: {
      main: "#E33F2A",
      text: "#FB3C3C",
      error: "#E34F4F",
      blur: "drop-shadow(0 0 4px #E33F2A)",
      gradient: "linear-gradient(90deg, #D52B20 0%, #FB3C3C 67.04%)",
      gradientChart: "linear-gradient(90deg, rgba(213, 43, 32, 0) 0%, #FB3C3C 99.89%)",
    },
  }
}