import mongoose, { Schema, model, models } from "mongoose";

 interface IQuizQuestion{
    question: string,
    options: string[],
    correctAnswer: string,
    explanation: string,
    difficulty: 'easy' | 'medium' | 'hard'
}

 interface IUserAnswer{
    questionIndex: number,
    selectedAnswer: string,
    isCorrect: boolean,
    answeredAt: Date
 }

export interface IQuiz{
    userId: mongoose.Types.ObjectId,
    documentId: mongoose.Types.ObjectId,
    title: string,
    question: IQuizQuestion[],
    userAnswer: IUserAnswer[],
    score: number,
    totalQuestion: number,
    completedAt: Date | null,
    createdAt?: Date,
    updatedAt?: Date
}

const quizSchema = new Schema<IQuiz>({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    documentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Document',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    question: [{
        question: {
            type: String,
            required: true
        },
        options: {
            type: [String],
            required: true,
            validate: {
                validator: (arr: string[]) => arr.length === 4,
                message: 'Must have exactly 4 options'
                }
        },
        correctAnswer: {
            type: String,
            required: true
        },
        explanation: {
            type: String,
            default: " "
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        }
    }],
    userAnswer: [{
        questionIndex: {
            type: Number,
            required: true,
        },
        selectedAnswer: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        },
        answeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    score: {
        type: Number,
        default: 0
    },
    totalQuestion: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: null
    }
},
 {  timestamps: true  });


//    Index for the faster Query
quizSchema.index({userId: 1, documentId: 1});

const Quiz = models?.Quiz || model<IQuiz>("Quiz", quizSchema);

export default Quiz
