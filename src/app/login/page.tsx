'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '../../components/Nav'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) throw new Error('Login failed')

      const { token } = await response.json()
      if (token) {
        document.cookie = `token=${token}; path=/`
      }
      router.push('/authenticated/home')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Nav isLoginPage={true}/>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  )
}

export default LoginPage