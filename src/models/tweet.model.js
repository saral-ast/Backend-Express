import mongoose, { Schema } from "mongoose";


const tweetSchema = new Schema({
    content: { type: String, required: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export const Tweet = mongoose.model("Tweet", tweetSchema);