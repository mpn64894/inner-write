"use client"
import Nav from "../../../components/Nav"
import TodayPlan from "../../../components/TodayPlan";


export default function HomePage() {
    return (
        <div>
            <Nav/>
            <TodayPlan/>
            <p>This is the Home Page for unauthenticated Users </p>
        </div>
    );
}
