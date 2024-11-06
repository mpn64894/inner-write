"use client"
import { useEffect } from "react";
import Cookies from 'js-cookie'; 
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('token');
            // check if there is already token when user is at root
            if (token) {
                try {
                    const res = await fetch('/api/validate', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (res.ok) {
                        router.push('/authenticated/home'); // Redirect to authenticated home if token is valid
                    } else {
                        router.push('/'); // Redirect to regular home if validation fails
                    }
                } catch (error) {
                    console.error('Token validation error:', error);
                    router.push('/'); // Redirect to regular home if there's an error
                }
            } else {
                router.push('/home'); // Redirect to regular home if no token exists
            }
        };

        checkAuth();
    }, [router]); // Run on component mount

    return null; // Render nothing while redirecting
}
