import mongoose, {Schema, Document, Model } from "mongoose";

export interface ITodaysPlan extends Document {
    user: mongoose.Schema.Types.ObjectId;
    selectedHour: string;
    task: string;
}

const todaysPlansSchema: Schema = new Schema<ITodaysPlan> ({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    selectedHour: {
        type: String,
        required: true,
        trim: true 
    },  
    task: {
        type: String,
        required: true,
        trim: true
    },
});

const TodaysPlan: Model<ITodaysPlan> = mongoose.models.TodaysPlan || mongoose.model<ITodaysPlan> ("TodaysPlan", todaysPlansSchema);
export default TodaysPlan;