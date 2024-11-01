"use client";
import styles from "./Nav.module.css";
import { useState } from "react";
import { CiCalendar } from 'react-icons/ci';

export const Nav = () => {
    // Simulate authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Handlers for login and logout
    const handleLogin = () => {
        // Perform login actions here (e.g., redirect, fetch user data)
    };

    const handleLogout = () => {
        // Perform logout actions here (e.g., clear user session)
    };

    const handleSignUp = () => {

    }

    return (
        <nav className={styles.navBar}>
            <div className={styles.logo}>
                <span className={styles.logo}>
                        <CiCalendar />
                </span>
            </div>

            <div className={styles.companyName}>
                <h1>InnerwRite</h1>
            </div>
            
            <div className={styles.authButton}>
                {!isAuthenticated ? (
                    <div>
                        <button onClick={handleSignUp} className={styles.signUpBtn}>Sign Up</button>
                        <button onClick={handleLogin} className={styles.loginBtn}>Login</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Nav;
