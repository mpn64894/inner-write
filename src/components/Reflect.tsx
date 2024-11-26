import styles from "./Reflect.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken"; // If you need to decode the JWT to get the userId

function Reflect() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journals, setJournals] = useState<any[]>([]); // State to store journal entries
  const [displayedJournal, setDisplayedJournal] = useState<any | null>(null); // State for the journal to display

  useEffect(() => {
    // Check for authentication cookie
    const authToken = Cookies.get("token");
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchJournalList = async () => {
        try {
          const authToken = Cookies.get("token"); // Retrieve token from cookies
          if (!authToken) {
            throw new Error("No authentication token found");
          }

          const decodedToken = jwt.decode(authToken); // Decode the JWT to get userId
          let userEmail: string | undefined = undefined;
          if (decodedToken && typeof decodedToken !== "string") {
            userEmail = decodedToken.userId; // Assuming the JWT payload contains userId
          }
          const response = await fetch(`/api/journal/userJournal/${userEmail}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, 
            },
          });

          if (!response.ok) {
            const errorDetails = await response.text(); // Get the response body (if any)
            throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
          }

          const journalResponse = await fetch(`/api/journal`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, 
            },
          });

          if (!journalResponse.ok) {
            const errorDetails = await journalResponse.text(); // Get the response body (if any)
            throw new Error(`HTTP error! Status: ${journalResponse.status}. Details: ${errorDetails}`);
          }

          const user = await response.json();
          const data = await journalResponse.json();
          const userId = user.userId;

          // Filter the journal entries to only show those belonging to the authenticated user
          const filteredJournals = data.entries?.filter(
            (entry: any) => entry.user === userId
          ) || [];


          setJournals(filteredJournals); // Store the filtered journal entries

            const randomIndex = Math.floor(Math.random() * filteredJournals.length);
            setDisplayedJournal(filteredJournals[randomIndex] || null);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchJournalList();
    }
  }, [isAuthenticated]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <h1>Reflection</h1>
      {displayedJournal ? (
        <div>
          <h2>Title: {displayedJournal.title}</h2> 
          <p>{displayedJournal.content}</p> 
          <p>{displayedJournal.prompt   }</p> 
          <p>{displayedJournal.moodString   }</p>
        </div>
      ) : (
        <p>No journal entries found for you!</p>
      )}
    </div>
  );
}

export default Reflect;
