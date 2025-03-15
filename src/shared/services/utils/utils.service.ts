import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from 'src/constants/jwt.constants';

@Injectable()
export class UtilsService {

    constructor (private jwtSvc: JwtService){}

    async hashPasword(password:string){
        return await bcrypt.hash(password, 10);
    }

    async checkPassword(password:string, encryptedPassword:string){
        return await bcrypt.compareSync(password, encryptedPassword);
    }

    async generateJWT (payload: any){
        var token = await this.jwtSvc.signAsync(payload, {secret: jwtConstants.secret });
        return token;
    }

    async getPayload (jwt: string){
        var payload = await this.jwtSvc.verifyAsync(jwt, { secret:jwtConstants.secret });
        const { iat, exp, ... data} = payload;

        return data;
    }
}
