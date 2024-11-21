

import mongoose, {Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    email: string;
    password: string;
}

const userSchema: Schema = new Schema<IUser> ({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }

});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;