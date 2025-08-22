'use client'

import CookieBanner from './CookieBanner'
import CookieSettings from './CookieSettings'

export default function CookieConsentWrapper() {
  return (
    <>
      <CookieBanner />
      <CookieSettings />
    </>
  )
}