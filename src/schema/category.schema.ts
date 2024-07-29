import { Document, Schema, model } from "mongoose"

export interface ICategory extends Document {
    title: string
}

const categorySchema = new Schema<ICategory>({
    title:String
}, { timestamps: true })


export const Category = model<ICategory>('Category', categorySchema)