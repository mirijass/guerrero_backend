import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolService } from './rol.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/shared/guard/auth/auth.guard';

@Controller('api/rol')
@ApiTags('Roles')
@UseGuards(AuthGuard)
export class RolController {

    constructor(private rolSvc: RolService){}

    @Get('/')
    async listarRoles(){
        return await this.rolSvc.listar();
    }
}
