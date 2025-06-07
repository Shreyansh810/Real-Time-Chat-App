import mongoose from "mongoose"; // mongoose is a ODM which helps to bridge gap between App(express) and MongoDB

const messageSchema = new mongoose.Schema(
    {
        // what does this sender and reciever object means This document (e.g., a Message) will reference two users — one who sent the message (senderId) and one who received it (receiverId).
        senderId: {
            type: mongoose.Schema.Types.ObjectId, // This stores a reference ID
            ref: "User", // It points to the "User" model
            required: true, // It's mandatory
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        }

        // senderId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User"
        //  } // This field (senderId) will store the _id of a document from the User model.
        // "Hey Mongoose, this field (senderId) will store a MongoDB _id, and that _id belongs to a document in the User collection."
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;








/* 
1. MongoDB:
   - Each User document has a unique `_id`.

2. Mongoose:
   - `ObjectId` in another model (e.g., Message) can store this `_id`.

3. `ref: "User"`:
   - Tells Mongoose which collection/model to fetch from when using `.populate()`.

4. `.populate("senderId")`:
   - Replaces the ObjectId with full user data in the result. 
*/