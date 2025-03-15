import { IsInt, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUsuarioDto {
    
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


    @IsInt()
    @IsNotEmpty()
    cveRol: number
}