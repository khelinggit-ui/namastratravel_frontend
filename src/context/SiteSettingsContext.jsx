import { createContext, useContext, useEffect, useState } from 'react'
import { getSiteSettings } from '../api'
import { siteSettings as defaults } from '../data/mockData'

const SiteSettingsContext = createContext(defaults)

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults)

  useEffect(() => {
    let active = true
    getSiteSettings()
      .then((s) => {
        if (active) setSettings({ ...defaults, ...s })
      })
      .catch(() => {}) // fallback ke default bila API belum tersedia
    return () => {
      active = false
    }
  }, [])

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}

export const useSiteSettings = () => useContext(SiteSettingsContext)