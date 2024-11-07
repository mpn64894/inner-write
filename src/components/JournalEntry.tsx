import React, { useState} from "react";
import styles from './JournalEntry.module.css';


interface JournalEntryType {
    id: number;
    content: string;
    moodString: string;
  }
  const MOODS = [
    "./moods/smug.png" ,
    "./moods/angry.png" ,
    "./moods/drained.png",
    "./moods/happy.png" ,
    "./moods/overit.png" ,
    "./moods/sad.png"

  ]

    const JournalEntry = () => {
            const [entries, setEntries] = useState<JournalEntryType[]>([]);
            const [content, setContent] = useState('');
            const [prompt, setPrompt] = useState('');
            const [moodString, setMoodString] = useState('');
        
            const handleAddEntry = (e: React.FormEvent) => {
            e.preventDefault();
        
            if (!content || !moodString) {
                alert('Please fill in all fields');
                return;
            }
        
            const newEntry : JournalEntryType = {
                id: Date.now(),
                content,
                moodString,
                
            };
        
            setEntries([newEntry, ...entries]);
            setContent('');
            setPrompt('');
            setMoodString('');
          

        }

        return (
            <div className={styles.journalContainer}>
                <div className={styles.entryWrapper}>
                    <div className={styles.formContainer}>
                        <h1>Today's Thoughts</h1>
                        <form onSubmit={handleAddEntry} className={styles.form}>
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
                <button type="submit" onClick={handleAddEntry} className={styles.journalButton}>Add Entry</button>   
            </div>
        );
    };
    
   
export default JournalEntry;