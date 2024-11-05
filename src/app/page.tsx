"use client"
import Nav from "../../components/Nav"
import AuthHomePage from "./authenticated/home/page";
import HomePage from "./home/page"
import { useState } from "react";


export default function Home() {
  const [token, setToken] = useState();
  if(!token) {
    return <HomePage/>
  }
  return (
    
    <div>
      <AuthHomePage/>
    </div>
  );
}
