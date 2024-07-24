import mongoose from "mongoose"
import { config } from "./index"

mongoose.connection
    .once('connected', () => {
        console.log("Your db connected succesfuly")
    })
    .on('disconnected', () => {
        console.log("Your db disconnected")
    })
    .on("connecting", () => {
        console.log("Your db connecting")
    })
    .on('error', () => {
        console.log("Your db has some error")
        mongoInitialConnection()
    })

export const mongoInitialConnection = async () => {
    await mongoose.connect(config.mongoUri)
}