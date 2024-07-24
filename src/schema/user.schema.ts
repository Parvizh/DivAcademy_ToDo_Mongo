import { Schema, model } from "mongoose"
import * as bcrypt from "bcryptjs"
import { config } from "../config"

interface IUser {
    name: string
    surname: string
    password: string
    age: number
}


const userSchema = new Schema<IUser>({
    name: String,
    surname: String,
    password: String,
    age: Number
})

userSchema.pre('save', function () {
    if (this.password) {
        this.password = bcrypt.hashSync(this.password, config.password_salt)
    }
    // next()
})

userSchema.virtual('fullname').get(function () {
    if (this.name && this.surname) return `${this.name} ${this.surname}`
})

userSchema.set('toJSON', { virtuals: true })

export const User = model<IUser>('User', userSchema)