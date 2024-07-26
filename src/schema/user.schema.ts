import { Document, Schema, model } from "mongoose"
import * as bcrypt from "bcryptjs"
import { config } from "../config"

export interface IUser extends Document {
    name: string
    surname: string
    password: string
    age: number
}

const userSchema = new Schema<IUser>({
    name: String,
    surname: String,
    password: { type: String, select: false },
    age: Number
}, { timestamps: true })

userSchema.pre('save', function () {
    if (this.password) {
        this.password = bcrypt.hashSync(this.password, Number(config.password_salt))
    }
})

userSchema.virtual('fullname').get(function () {
    if (this.name && this.surname) return `${this.name} ${this.surname}`
})

userSchema.set('toJSON', { virtuals: true })

export const User = model<IUser>('User', userSchema)