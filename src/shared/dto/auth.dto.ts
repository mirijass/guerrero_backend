import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {



@IsString()
@IsNotEmpty()
@MinLength(3)
@MaxLength(150)
    username:string;

@IsString()
@IsNotEmpty()
@MinLength(3)
@MaxLength(20)
    password:string;
}