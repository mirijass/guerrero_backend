import { IsInt, isInt, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(350)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(550)
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(150)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    password: string;

    @IsInt()
    @IsNotEmpty()
    cveRol: number
}