import mongoose, {Schema, model, models} from "mongoose";

interface IChunks{
    content: string,
    pageNumber: number,
    chunkIndex: number
}

interface IDocument{
    userId: mongoose.Types.ObjectId,
    title: string,
    fileName: string,
    filePath: string,
    fileSize: number,
    extractedText: string,
    chunks: IChunks[],
    uploadDate: Date,
    lastAccessed: Date,
    status: 'processing' | 'ready' | 'failed',
    createdAt?: Date,
    updatedAt?: Date
}

const documentSchema = new Schema<IDocument>({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a document title'],
        trim: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true
    },
    extractedText: {
        type: String,
        default: " "
    },
    chunks: [{
        content: {
            type: String,
            required: true
        },
        pageNumber: {
            type: Number,
            default: 0
        },
        chunkIndex: {
            type: Number, 
            required: true
        },
    }],
    uploadDate: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['processing', 'ready', 'failed'],
        default: 'processing'
    }
},{ timestamps: true});

//    Index for the faster query
documentSchema.index({userId: 1, uploadDate: -1});

const Document = models?.Document || model<IDocument>('Document', documentSchema)

export default Document