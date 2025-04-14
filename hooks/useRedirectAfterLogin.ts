"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useRedirectAfterLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Check if there's a redirect parameter in the URL
    const redirectUrl = searchParams.get('redirect')
    
    if (redirectUrl) {
      // Store it in localStorage for later use
      localStorage.setItem('redirectAfterLogin', redirectUrl)
    }
  }, [searchParams])
  
  const redirectToSavedLocation = () => {
    const savedRedirect = localStorage.getItem('redirectAfterLogin')
    
    if (savedRedirect) {
      localStorage.removeItem('redirectAfterLogin') // Clear it after use
      router.push(savedRedirect)
      return true
    }
    
    return false
  }
  
  return { redirectToSavedLocation }
}