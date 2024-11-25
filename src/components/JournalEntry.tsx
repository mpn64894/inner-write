import { useState } from "react";
import { useEffect } from "react";
import styles from './JournalEntry.module.css';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";


interface JournalEntryType {
    id?: string;
    user?: string;
    title: string;
    dateAdded?: string;
    content: string;
    prompt: string;
    moodString: string;
  }
  
const MOODS = [
"/moods/smug.png" ,
"/moods/angry.png" ,
"/moods/drained.png",
"/moods/happy.png" ,
"/moods/overit.png" ,
"/moods/sad.png"
]

const JournalEntry = () => {
    const [entries, setEntries] = useState<JournalEntryType[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [prompt, setPrompt] = useState('');
    const [moodString, setMoodString] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const authToken = Cookies.get('token');
        
        if (authToken) {
            setIsAuthenticated(true);
          }
        }, []);

    const handleAddEntry = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content || !moodString) {
            alert('Please fill in all required fields');
            return;
          }
          const token = Cookies.get('token'); // Assuming the user ID is stored in a cookie
          const decoded = jwtDecode<{ userId: string }>(token as string);
          const userId = decoded.userId;
          if (!userId) {
              alert("User not authenticated.");
              return;
          }
          
        const newEntry : JournalEntryType = {
            user: userId,
            title,
            content,
            prompt,
            moodString,
            
        };
        try {
                const response = await fetch('/api/journal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newEntry),
                });

                if (!response.ok) {
                    throw new Error('Failed to add entry');
                }

                const result = await response.json();
                alert(result.message);
                
                // Optionally refresh entries or clear the form
                setEntries([newEntry, ...entries]);
                setTitle('');
                setContent('');
                setPrompt('');
                setMoodString('');
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        }
    }

    return (
        <div className={styles.journalContainer}>
            <div className={styles.entryWrapper}>
                <div className={styles.formContainer}>
                    <h1>Today's Thoughts</h1>
                    <form onSubmit={handleAddEntry} className={styles.form}>
                        <div className={styles.inputWrapper}>
                             <input
                                type="text"
                                className={styles.titleInput}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title of your entry..."
                                required
                             />
                        </div>
                        <div className={styles.textareaWrapper}>
                            <textarea
                                className={styles.journalInput}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Spill the beans..."
                            />
                        </div>
                        <div className={styles.textareaWrapper}>
                            <textarea
                                className={styles.promptInput}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="What made you happy today?"
                            />
                        </div>
                        </form>
                </div>
                
                <div className={styles.moodWrapper}>
                    <h1>Mood</h1>
                    <div className={styles.moodGrid}>
                    {MOODS.map((mood, index) => (
                        <img
                            key={index}
                            src={mood}
                            alt={`Mood ${index + 1}`}
                            className={`${styles.mood} ${
                                moodString === mood ? styles.selectedMood : ""
                            }`}
                            onClick={() => setMoodString(moodString === mood ? "" : mood)} 
                        />
                    ))}
                    </div>
                </div>
            </div>
            
            
            <button 
            type="submit" 
            onClick={handleAddEntry} 
            className={`${styles.journalButton} ${isAuthenticated ? styles.enabled : styles.disabled}`}
            disabled={!isAuthenticated}>Add Entry
            {/* disabled={token} */}
            </button>   
        </div>
    );
};

   
export default JournalEntry;