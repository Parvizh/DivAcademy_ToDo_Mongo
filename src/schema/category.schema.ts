import { Document, Schema, model } from "mongoose"

export interface ICategory extends Document {
    title: string
    userId: Schema.Types.ObjectId
}

const categorySchema = new Schema<ICategory>({
    title: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })


export const Category = model<ICategory>('Category', categorySchema)