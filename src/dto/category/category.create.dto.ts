import { IsNotEmpty, IsString } from "class-validator";
import { Schema } from "mongoose";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    userId: string;
}