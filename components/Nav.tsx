"use client";
import styles from "./Nav.module.css";
import { CiCalendar } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import Cookies from 'js-cookie';

interface NavProps {
    isSignUpPage?: boolean; 
    isLoginPage?: boolean; 
    isAuthenticatedPage?: boolean; 
}

function Nav(props: NavProps) {
    const router = useRouter();

    // Handle login
    const handleLogin = () => {
       router.push('/login');
    };

    // Handle logout
    const handleLogout = () => {
        Cookies.remove("token")
        router.push("/")
    };

    // Handle signup
    const handleSignUp = () => {
        router.push('/signup');
    };

    // Handle going to home page when clicking on the company name
    const handleHomeClick = async () => {
        const token = Cookies.get('token');

        if (token) {
            try {
                const res = await fetch('/api/validate', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    router.push('/authenticated/home'); // Go to authenticated home if token is valid
                } else {
                    router.push('/'); // Go to the regular home if validation fails
                }
            } catch (error) {
                console.error('Token validation error:', error);
                router.push('/');
            }
        } else {
            router.push('/'); // Go to the regular home if no token
        }
    };

    let buttons;
    if (!props.isAuthenticatedPage) {
        if (props.isSignUpPage) {
            buttons = <button onClick={handleLogin} className={styles.loginBtn}>Login</button>;
        } else if (props.isLoginPage) {
            buttons = <button onClick={handleSignUp} className={styles.signUpBtn}>Sign Up</button>;
        } else {
            buttons = (
                <>
                    <button onClick={handleSignUp} className={styles.signUpBtn}>Sign Up</button>
                    <button onClick={handleLogin} className={styles.loginBtn}>Login</button>
                </>
            );
        }
    } else {
        buttons = <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>;
    }

    return (
        <nav className={styles.navBar}>
            <div className={styles.logo}>
                <CiCalendar size={40} />
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
}

export default Nav;
