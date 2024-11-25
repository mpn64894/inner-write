'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from './Nav'
import styles from './Login.module.css'
import { doCredentialLogin } from '@/app/api/login/route'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission

    try {
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password,
      //   }),
      // })

      const response = await doCredentialLogin(formData);
      if (!response.ok) {
        alert("Email or Password is incorrect")
      }

      // const { token } = await response.json()
      // if (token) {
      //   document.cookie = `token=${token}; path=/`
      // }
      router.push('/authenticated/home')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    
    <div>
        <Nav isLoginPage={true}/>
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                 <p className={styles.title}>Login</p>
                <form onSubmit={handleLogin}>
                <label className={styles.formLabel}>
                    Email:
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.formInput}
                />
                </label>
                <br />
                <label className={styles.formLabel}>
                Password:
                <input
                 type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.formInput}
                />
                </label>
            <br />
            <p className={styles.loginText}>
                Don't have an account? <a href="./signup" className={styles.loginLink}>Register!</a>
            </p>
            <button type="submit" className={styles.loginButton}>Log In</button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage