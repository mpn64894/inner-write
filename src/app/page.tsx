"use client"
import Nav from "../../components/Nav"
import AuthHomePage from "./authenticated/home/page";
import HomePage from "./home/page"
import { useState } from "react";


export default function Home() {
  const [token, setToken] = useState();
  console.log(token)
  return <HomePage/>
  
  return (
    
    <div>
      <AuthHomePage/>
    </div>
  );
}
