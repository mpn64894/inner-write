"use client"
import Nav from "../../components/Nav"
import TodayPlan from "../../components/TodayPlan";
import JournalEntry from "../../components/JournalEntry";

export default function HomePage() {
    const today: Date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(today);
    
    return (
        <div>
            <Nav/>
            <h1>{formattedDate}</h1>
            <TodayPlan/>
            <JournalEntry />
        </div>
    );
}
