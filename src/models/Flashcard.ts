import mongoose, {model, models, Schema} from "mongoose";

interface ICard{
    question: string,
    answer: string,
    difficulty: 'easy' | 'medium' | 'hard',
    lastReviewed: Date | null,
    reviewCount: number,
    isStarred: boolean,
}

interface IFlashcard {
    userId: mongoose.Types.ObjectId,
    documentId: mongoose.Types.ObjectId,
    cards: ICard[],
    createdAt?: Date,
    updatedAt?: Date,
}

const flashCardSchema = new Schema<IFlashcard>({
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
    cards: [
        {
            question: {type: String, required: true},
            answer: {type: String, required: true},
            difficulty: {
                type: String, 
                enum: ['easy', 'medium', 'hard'],
                default: 'medium'
            },
            lastReviewed: {
                type: Date,
                default: null
            },
            reviewCount: {
                type: Number, 
                default: 0
            },
            isStarred: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true });

flashCardSchema.index({userId: 1, documentId: 1});

const Flashcard = models?.Flashcard || model<IFlashcard>('Flashcard', flashCardSchema);

export default Flashcard