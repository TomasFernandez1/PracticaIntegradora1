import {Schema, model} from 'mongoose';

const messageCollection = 'messages'

// Message Model
const messageSchema = new Schema({
    user: String,
    correoDelUsuario: String,
    message: String
});

export default model(messageCollection, messageSchema)
