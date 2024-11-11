'use client'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '../../../components/Nav'
import Dashboard from '@/components/Dashboard'
import JournalEntry from '@/components/JournalEntry'

function AuthHomePage() {
  const router = useRouter()
  const today: Date = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(today);

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
        <h1 style={{ textAlign: "center" }}>{formattedDate}</h1>
        <Dashboard/>
        <JournalEntry />
    </div>
    )
}

export default AuthHomePage;
