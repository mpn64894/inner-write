'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from "./Signup.module.css"
import Nav from "./Nav"

function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setfirstName] = useState('')

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password != confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const response = await fetch ('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    email,
                    password,
                }),
            });
            if (!response.ok) throw new Error ('Signup failed') 
        } catch (error) {
            console.error('Error during signup!', error);
        }
    }
    return (
        <div>
            <Nav isSignUpPage={true}></Nav>
        <div className={styles.container}>
        <div className={styles.signUpContainer}>
        <p className={styles.title}>Sign Up</p>
        <form onSubmit={handleSignup}>
            <label className={styles.formLabel}>
              First Name
              <input
                type="text"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                required
                className={styles.formInput}
              />
            </label>
          <label className={styles.formLabel}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.formInput}
            />
          </label>
          <label className={styles.formLabel}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.formInput}
            />
          </label>
          <label className={styles.formLabel}>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.formInput}
            />
          </label>
          <p className={styles.loginText}>
            Already have an account? <a href="./login" className={styles.loginLink}>Login!</a>
          </p>
          <button type="submit" className={styles.signUpButton}>Sign Up</button>
        </form>
      </div>
    </div>
    </div>
    )
}

export default SignUp
