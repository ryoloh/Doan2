import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    CardInfo: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

const Card = mongoose.model('Card', userSchema)

export default Card;