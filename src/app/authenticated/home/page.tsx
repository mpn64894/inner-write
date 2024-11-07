'use client'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '../../../components/Nav'

function AuthHomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')

    if (!token) {
      router.replace('/') // If no token is found, redirect to home page
      return
    }

    // Validate the token by making an API call
    const validateToken = async () => {
      try {
        const res = await fetch('/api/validate', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (!res.ok) throw new Error('Token validation failed')
      } catch (error) {
        console.error(error)
        router.replace('/login') // Redirect to login if token validation fails
      }
    }

    validateToken()
  }, [router])

  return (
    <div>
        <Nav isAuthenticatedPage={true}/>
        AUTHENTICATED WEB CONTENT
    </div>
    )
}

export default AuthHomePage