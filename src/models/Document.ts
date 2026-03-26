import mongoose, {Schema, model, models} from "mongoose";

interface IDocument{
    userId: mongoose.Types.ObjectId,
    title: string,
    fileId: string,
    fileName: string,
    fileUrl: string,
    fileSize: number,
    thumbnailUrl?: string;
    lastAccessed?: Date,
    status: 'processing' | 'ready' | 'failed',
    createdAt?: Date,
    updatedAt?: Date
}

const documentSchema = new Schema<IDocument>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a document title'],
        trim: true,
    },
    fileId: {
        type: String,
        required: true,
        unique: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    thumbnailUrl: {
        type: String,
    },
    lastAccessed: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['processing', 'ready', 'failed'],
        default: 'processing'
    }
},{ timestamps: true});

//    Index for the faster query
documentSchema.index({userId: 1, createdAt: -1});

const Document = models?.Document || model<IDocument>('Document', documentSchema)

export default Document
