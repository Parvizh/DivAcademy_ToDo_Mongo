import { Schema, model, Document } from "mongoose";

export interface INote extends Document {
    title: string;
    content: string;
    categoryId: Schema.Types.ObjectId;
    createdAt: Date;
}

const noteSchema = new Schema<INote>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Note = model<INote>('Note', noteSchema);
