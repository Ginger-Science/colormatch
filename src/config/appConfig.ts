// src/config/appConfig.ts

export const APP_CONFIG = {
  theme: process.env.NEXT_PUBLIC_THEME || 'desert', // , ocean, desert, mountain
  title: process.env.NEXT_PUBLIC_APP_TITLE || "Ginger Science",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Sightings of Redheads in the Wild",
  location: process.env.NEXT_PUBLIC_APP_LOCATION || "",
  recordEnv: process.env.NEXT_PUBLIC_RECORD_ENV || 'production'
}

export const getThemeColors = (theme: string) => {
  const themes = {
    
    ocean: {
      gradient: 'from-blue-950 via-cyan-900 to-blue-950',
      primary: 'blue',
      secondary: 'cyan',
      text: 'blue'
    },
    desert: {
      gradient: 'from-amber-950 via-orange-400 to-amber-950',
      primary: 'amber',
      secondary: 'orange',
      text: 'white'
    },
    mountain: {
      gradient: 'from-slate-950 via-gray-900 to-slate-950',
      primary: 'slate',
      secondary: 'gray',
      text: 'slate'
    }
  }
  return themes[theme as keyof typeof themes] || themes.desert
}
