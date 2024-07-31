import { Document, Schema, model } from "mongoose"
import { config } from "../config"

export interface ICategory extends Document {
    title: string
    userId: Schema.Types.ObjectId
    image: string
}

const categorySchema = new Schema({
    title: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    image: { type: String, require: false }
}, { timestamps: true })

categorySchema.virtual('imageUrl').get(function () {
    return `${config.domain_name}/public/${this.image}`
})
categorySchema.set('toJSON', { virtuals: true })

export const Category = model<ICategory>('Category', categorySchema)