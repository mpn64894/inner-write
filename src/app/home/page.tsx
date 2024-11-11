"use client"
import Nav from "../../components/Nav"
import Dashboard from "../../components/Dashboard";
import JournalEntry from "../../components/JournalEntry";

export default function HomePage() {
    const today: Date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(today);
    
    return (
        <div>
            <Nav/>
            <h1 style={{ textAlign: "center" }}>{formattedDate}</h1>
            <Dashboard/>
            <JournalEntry />
        </div>
    );
}
