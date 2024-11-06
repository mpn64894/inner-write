"use client"; 
import styles from "./Nav.module.css";
import { CiCalendar } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";

interface NavProps {
    isSignUpPage?: boolean; 
    isLoginPage?: boolean; 
    isAuthenticatedPage?: boolean; 
}

function Nav(props: NavProps) {
    const router = useRouter();

    // handles login
    const handleLogin = () => {
       router.push('/login')
    };


    // handles logout
    const handleLogout = () => {
        //
    };

    // handles signup
    const handleSignUp = () => {
        router.push('/signup');
    };

    // Handle going back to home when click on company name
    const handleHomeClick = () => {
        router.push('/'); // Change this to your home route if different
    };


    let buttons;

    if (!props.isAuthenticatedPage) {
        if (props.isSignUpPage) {
            buttons = (
                <>
                    <button onClick={handleLogin} className={styles.loginBtn}>Login</button>
                </>
            );
        } else if (props.isLoginPage){
            buttons = (
                <>
                    <button onClick={handleSignUp} className={styles.signUpBtn}>Sign Up</button>
                </>
            );
        } else {
        buttons = (
            <>
                <button onClick={handleSignUp} className={styles.signUpBtn}>Sign Up</button>
                <button onClick={handleLogin} className={styles.loginBtn}>Login</button>
            </>
            );
        }
    } else {
        buttons = (
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        );
    }

    return (
        <nav className={styles.navBar}>
            <div className={styles.logo}>
                <span className={styles.logo}>
                    <CiCalendar size={40} />
                </span>
            </div>

            <div className={styles.companyName}>
                <button onClick={handleHomeClick} className={styles.companyButton}>
                        <h1>InnerwRite</h1>
                </button>
            </div>
            
            <div className={styles.authButton}>
                {buttons}
            </div>
        </nav>
    );
};

export default Nav;
