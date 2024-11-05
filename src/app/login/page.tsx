"use client";
import { FormEvent } from "react";
import Nav from "../../../components/Nav"
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const router = useRouter()
   
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault()
   
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email')
      const password = formData.get('password')
   
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
   
      if (response.ok) {
        router.push('/authenticated/home')
      } else {
        // Handle errors
      }
    }
   
    return (
        <div>
          <Nav isLoginPage={true}/>
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      );
  }
