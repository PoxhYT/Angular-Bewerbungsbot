import mongoose, { Schema } from 'mongoose';
  
const UserSchema = new Schema({
    userName: {type: String, required: true},    
    profilePicture: {type: String, required: true},
    documents: {type: Array<Object>()}
});

const user = mongoose.model('Users', UserSchema)
export default user;