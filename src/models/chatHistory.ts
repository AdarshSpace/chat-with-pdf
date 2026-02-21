import mongoose, {Schema, model, models} from "mongoose";

interface Imessage{
    role: 'user' | 'assistant',
    content: string,
    timestamp: Date,
    relevantChunks: number[]
}

interface IChatHistory{
    userId: mongoose.Types.ObjectId,
    documentId: mongoose.Types.ObjectId,
    messages: Imessage[],
    createdAt?: Date,
    updatedAt?: Date  
}

const chatHistorySchema = new Schema<IChatHistory>({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    documentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Document',
        required: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        relevantChunks: {
            type: [Number],
            default: []
        }
    }]
}, {timestamps: true});


chatHistorySchema.index({userId: 1, documentId: 1});

const ChatHistory = models?.ChatHistory || model<IChatHistory>('ChatHistory', chatHistorySchema);

export default ChatHistory