import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  content: String,
  timestamp: {type: Date, default: Date.now},
  roomId: {type: mongoose.Schema.Types.ObjectId, ref: 'room'},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
});

const Message = mongoose.model('Message', messageSchema);

export default Message;