import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { SORT_TYPE } from "../enums/sort.enum";
import { Transform } from "class-transformer";


export class QueryDto {
    @IsOptional()
    @Transform(({ value }) => (value === 'null' || value == '' ? 1 : Number(value)))
    @IsNumber()
    page: number;

    @IsOptional()
    @Transform(({ value }) => (value === 'null' || value == '' ? 10 : Number(value)))
    @IsNumber()
    limit: number;

    @IsOptional()
    @IsString()
    sort: string

    @IsOptional()
    @IsEnum(SORT_TYPE)
    order: SORT_TYPE

    @IsOptional()
    @IsString()
    searchText: string;
}