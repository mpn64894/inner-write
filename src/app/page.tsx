"use client"
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'; 
import { useRouter } from 'next/navigation';
import Nav from "../components/Nav";
import Dashboard from "../components/Dashboard";
import JournalEntry from "../components/JournalEntry";

export default function Home() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const today: Date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(today);

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const res = await fetch('/api/validate', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (res.ok) {
                        setIsAuthenticated(true); // Set authenticated state to true if token is valid
                        router.push('/authenticated/home'); // Redirect to authenticated home
                    } else {
                        setIsAuthenticated(false); // Set authenticated state to false if validation fails
                    }
                } catch (error) {
                    console.error('Token validation error:', error);
                    setIsAuthenticated(false); // Set authenticated state to false if there's an error
                }
            }
        };

        checkAuth();
    }, [router]);

    // Render the main content if not authenticated, otherwise render nothing as redirect is handled in effect
    return !isAuthenticated ? (
        <div>
            <Nav />
            <h1 style={{ textAlign: "center" }}>{formattedDate}</h1>
            <Dashboard />
            <JournalEntry />
        </div>
    ) : null;
}
