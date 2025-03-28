import { IsNumber } from "class-validator";

export class CreateCarritoDto {
  @IsNumber()
  cveUsuario: number;
  // Puedes agregar más propiedades si es necesario
      @IsNumber()
      cantidad:number;
      @IsNumber()
      cveProducto:number;
}