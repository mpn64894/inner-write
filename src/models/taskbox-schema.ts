import mongoose, {Schema, Document, Model } from "mongoose";

export interface ITaskBox extends Document {
    user: mongoose.Schema.Types.ObjectId;
    dateStart: Date;
    title: string;
    date: Date;
    start: string;
    end: string;
    image: string;
    color: string;
    daysLeft: number;
}

const taskBoxSchema: Schema = new Schema<ITaskBox> ({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    dateStart: {
        type: Date,
        default: Date.now
    },  
    title: {
        type: String,
        required: true,
        trim: true 
    },
    date: {
        type: Date,
        required: true,
        trim: true 
    },
    start: {
        type: String,
        required: true,
        trim: true 
    },
    end: {
        type: String,
        required: true,
        trim: true 
    },
    image: {
        type: String,
        required: true,
        trim: true 
    },
    color: {
        type: String,
        required: false,
        trim: true 
    },
    daysLeft: {
        type: Number,
        required: true,
        trim: true 
    },
});

const TaskBox: Model<ITaskBox> = mongoose.models.TaskBox || mongoose.model<ITaskBox> ("TaskBox", taskBoxSchema);
export default TaskBox;