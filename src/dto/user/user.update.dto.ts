import { IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: "Name have to be string type" })
    name: string;

    @IsOptional()
    @IsString()
    surname: string;

    @IsOptional()
    @IsNumber()
    age: number
}