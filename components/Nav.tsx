"use client"; 
import styles from "./Nav.module.css";
import { CiCalendar } from 'react-icons/ci';
import { useRouter } from 'next/navigation';

interface NavProps {
    isSignUpPage?: boolean; 
    isLoginPage?: boolean; 
    isAuthenticatedPage?: boolean; 
}

function Nav(props: NavProps) {
    const router = useRouter();
    console.log(props)
    const handleLogin = () => {
       router.push('/login')
    };

    const handleLogout = () => {
        //
    };

    const handleSignUp = () => {
        router.push('/signup');
    };

    let buttons;

    if (!props.isAuthenticatedPage) {
        if (props.isSignUpPage) {
            buttons = (
                <button onClick={handleLogin} className={styles.loginBtn}>Login</button>
            );
        } else {
            buttons = (
                <>
                    <button onClick={handleSignUp} className={styles.signUpBtn}>Sign Up</button>
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
                <h1>InnerwRite</h1>
            </div>
            
            <div className={styles.authButton}>
                {buttons}
            </div>
        </nav>
    );
};

export default Nav;
