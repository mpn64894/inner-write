import mongoose, {Schema, Document, Model } from "mongoose";



export interface IJournalEntry extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    dateAdded: Date;
    content: string;
    prompt: string;
    moodString: string;
}

const journalEntrySchema: Schema = new Schema<IJournalEntry> ({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: {
        type: String,
        required: true,
        trim: true 
    },
    dateAdded: {
        type: Date,
        default: Date.now 
    },
    content: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: false,
        default: ' ',
    }, 
    moodString: {
        type: String,
        required: true,
    }
});

const JournalEntry: Model<IJournalEntry> = mongoose.models.JournalEntry || mongoose.model<IJournalEntry> ("JournalEntry", journalEntrySchema);
export default JournalEntry;