import Nav from "../../../../components/Nav"


export default function AuthHomePage() {
    return (
        <div>
            <Nav isAuthenticatedPage={true}/>
            <p>This is the Home Page for authenticated Users </p>
        </div>
    );
}
