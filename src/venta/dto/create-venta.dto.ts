import { IsArray, IsDate, IsInt, isInt, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { DetalleVentaDto } from "./create-detalle-venta.dto";

export class CreateVentaDto {

    @IsNumber()
    @IsNotEmpty()
    totalVenta: number;

    @IsNumber()
    cveUsuario: number;

    @IsArray()
    detalleVenta: DetalleVentaDto[]
}