import { createTheme } from "@mui/material/styles";

import { getColors } from "@/app/theme/colors.ts";

export const theme = createTheme({
  // Глобальное скругление углов
  shape: {
    borderRadius: 8,
  },

  // Типографика для белого текста по умолчанию
  typography: {
    body1: {
      color: getColors().white.main,
    },
    allVariants: {
      color: getColors().white.main,
    },
    body2: {
      color: '#b5bac1', // чуть темнее для второстепенного текста
    },
  },

  palette: {
    mode: 'dark', // Включаем темный режим для текста и фонов по умолчанию

    // Разделители и границы
    divider: '#3a3d41',      // цвет линий и границ

    secondary: {
      main: '#4e34f7',
      dark: '#3a28c4',
      light: '#7a63f8', // дополнительный фиолетовый
      contrastText: getColors().white.main,
    },

    // Основной фон и поверхностные элементы
    background: {
      paper: getColors().grey.panelsDark,      // фон карточек, модальных окон, меню
      default: getColors().grey.background,   // основной фон страницы
    },

    // Текст
    text: {
      disabled: '#6d6f78',   // неактивный текст
      // primary: getColors().white.main,    // основной белый текст
      primary: getColors().white.main,    // основной белый текст
      secondary: getColors().grey.textSecondary// второстепенный текст (сероватый)
    },

    // Дополнительные цвета для состояний
    action: {
      active: '#6862fd',          // активные элементы
      hover: 'rgba(104, 98, 253, 0.08)',  // hover эффект
      selected: 'rgba(104, 98, 253, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },

    // Основные цвета
    primary: {
      dark: getColors().blue.dark,       // темный оттенок для нажатых кнопок
      main: getColors().blue.main,       // основной цвет кнопок и акцентов
      light: getColors().blue.light,      // более светлый оттенок для hover/активных состояний
      contrastText: getColors().white.main, // белый текст на primary кнопках
    },
  },

  components: {
    // Настройка выпадающих списков
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: getColors().white.main,
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#6862fd',
        },
      },
    },

    // Настройка карточек
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: '#2b2d31',
        },
      },
    },

    // Настройка AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#2b2d31',
        },
      },
    },

    // Настройка вкладок
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#b5bac1',
          '&.Mui-selected': {
            color: '#6862fd',
          },
        },
      },
    },

    // Настройка чекбоксов и переключателей
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#3a3d41',
          '&.Mui-checked': {
            color: '#6862fd',
          },
        },
      },
    },

    // Настройка иконок
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: getColors().white.main,
          '&:hover': {
            backgroundColor: 'rgba(104, 98, 253, 0.08)',
          },
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        track: {
          backgroundColor: '#3a3d41',
        },
        switchBase: {
          color: '#3a3d41',
          '&.Mui-checked': {
            color: '#6862fd',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#6862fd',
          },
        },
      },
    },

    // Настройка полей ввода
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: getColors().grey.panelsDark,
            '& fieldset': {
              borderColor: '#3a3d41',
            },
            '&:hover fieldset': {
              borderColor: '#6862fd',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6862fd',
            },
          },
        },
      },
    },

    // Настройка кнопок
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#6862fd',
            '&:hover': {
              backgroundColor: '#4e34f7',
            },
        },
        outlined: {
            color: '#ffffff',
            borderColor: '#6862fd',
            '&:hover': {
              borderColor: '#4e34f7',
              backgroundColor: 'rgba(104, 98, 253, 0.08)',
            },
        },
        root: {
          fontWeight: 600,
          color: "#ffffff",
          borderRadius: '8px',
          textTransform: 'none',     // убираем заглавные буквы
          backgroundColor: '#4e34f7',
          '&:hover': {
            borderColor: '#4e34f7',
            backgroundColor: '#6862fd',
          },
          '&.Mui-disabled': {
            color: '#c3c2c2',
            backgroundColor: '#a1a1a1',
          },
        }
      },
    },
  },
});