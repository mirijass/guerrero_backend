import { IsBoolean, IsCurrency, IsInt, isInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductoDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(350)
    descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    @Max(99999)
    @Min(1)
    precio: number;


    @IsInt()
    @IsNotEmpty()
    @Max(99999)
    @Min(0)
    cantidad: number;

    @IsInt()
    @IsNotEmpty()
    cveCategoria: number;

    @IsBoolean()
    activo: boolean;
}