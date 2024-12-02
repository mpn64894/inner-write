'use client'

import styles from "./AllJournalEntries.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Nav from "@/components/Nav";

function AllJournalEntries() {
  const [journals, setJournals] = useState<any[]>([]); // State to store all journal entries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllJournals = async () => {
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
  
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching journals.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllJournals();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
        <Nav isAuthenticatedPage={true}/>
    <div className={styles.container}>
        
      <h1 className={styles.heading}>All Journal Entries</h1>
      {journals.length === 0 ? (
        <p>No journal entries available.</p>
      ) : (
        <div className={styles.entriesGrid}>
          {journals.map((journal) => (
            <div className={styles.entryCard} key={journal.id || journal._id}>
              <h2 className={styles.entryTitle}>{journal.title}</h2>
              <p className={styles.entryContent}>{journal.content}</p>
              <p className={styles.entryPrompt}>
                <strong>Prompt:</strong> {journal.prompt}
              </p>
              {journal.moodString && (
                <img
                  className={styles.entryImage}
                  src={journal.moodString}
                  alt={`Mood ${journal.moodString}`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

export default AllJournalEntries;