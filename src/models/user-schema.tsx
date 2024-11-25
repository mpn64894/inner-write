import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    email: string;
    password: string;
}

const userSchema: Schema<IUser> = new Schema ({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }

});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema, "users");
  //export default User;