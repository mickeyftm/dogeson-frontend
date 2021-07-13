import React, { useCallback, useEffect, useState } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { 
  light as lightBase,
  dark as darkBase,
  PancakeTheme
} from '@pancakeswap-libs/uikit'

const light: PancakeTheme = lightBase;
// light.colors.primary = '#F9AC61'
// light.colors.primaryBright = '#F9AC61'
// light.colors.primaryDark = '#F9AC61'

const dark: PancakeTheme = darkBase;
// dark.colors.primary = '#F9AC61'
// dark.colors.primaryBright = '#F9AC61'
// dark.colors.primaryDark = '#F9AC61'
// dark.colors.background = '#1A1A27'
// dark.colors.input = '#292929'
// dark.card.background = 'rgba(0, 0, 0 , 0.4)'
// dark.card.boxShadowActive = '#fff'
// dark.button.primary.background = '#F9AC61'

const CACHE_KEY = 'IS_DARK'

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType>({ isDark: true, toggleTheme: () => null })

const ThemeContextProvider: React.FC = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const isDarkUserSetting = localStorage.getItem(CACHE_KEY)
    return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false
  })

  const handleSetup = useCallback(event=>{
    if(event && event.data && typeof event.data === "string" && event.data.startsWith("[iFrameSizer]message:")){
      const dataStr = event.data.substring("[iFrameSizer]message:".length);
      const data = JSON.parse(dataStr);
      console.log("data.isDark", data.isDark);
      setIsDark(()=>data.isDark);
    }
  }, []);
  useEffect(()=>{
    window.addEventListener("message", handleSetup);
    return () => {
      window.removeEventListener('message', handleSetup);
    };
  }, [handleSetup]);

  const toggleTheme = () => {
    setIsDark((prevState: any) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState))
      return !prevState
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SCThemeProvider theme={isDark ? dark : light}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
