import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UtilsService } from 'src/shared/services/utils/utils.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from 'src/shared/guard/auth/auth.guard';

@Controller('api/usuario')
@ApiTags('Usuarios')
// @UseGuards(AuthGuard)
export class UsuarioController {

    constructor(private usuarioSvc: UsuarioService,
        private utilSvc: UtilsService){}

    @UseGuards(AuthGuard)
    @Get()
    async ListarUsuario(){
        return await this.usuarioSvc.listarUsuarios();
     }

    @Post ()
    async insertarUsuario(@Body() usuario: CreateUsuarioDto) {
        //TODO: Verificar que el rol exista
        const roles = await this.usuarioSvc.verificarRol(usuario.cveRol);
        if (roles.length <= 0){
            throw new BadRequestException('El rol no existe');
        }

        //TODO:Si el username existe
        const usernames = await this.usuarioSvc.verificarUsername(usuario.username);
        if(usernames.length > 0){
            throw new BadRequestException ('El nombre de usuario ya existe');
        }

        // ecriptar la contraseña
        var encryptedText = await this.utilSvc.hashPasword(usuario.password);
        usuario.password = encryptedText;

        // Insertar usuario y devolver el usuario insertado
        return await this.usuarioSvc.insertar(usuario);

     }

    @UseGuards(AuthGuard)
    @Patch (':cveUsuario')
    async actualizarUsuario(@Param('cveUsuario', ParseIntPipe) cveUsuario: number, @Body() usuario:UpdateUsuarioDto){
        
        //TODO: Verificar que el usuario existe
        const verifyUser = await this.usuarioSvc.verificarClave(cveUsuario);
        if (verifyUser.length <= 0){
            throw new BadRequestException('El usuario no existe');
        }

        //TODO: Verificar el rol
        const rol = await this.usuarioSvc.verificarRol(usuario.cveRol);
        if (rol.length <= 0){
            throw new BadRequestException('El rol no existe');
        }

        //Actualizar la informacion y devolver el usuario actualizado
        return await this.usuarioSvc.actualizar(cveUsuario, usuario);
     }

    @UseGuards(AuthGuard)
    @Delete(':cveUsuario')
    async eliminarUsuario(@Param ('cveUsuario', ParseIntPipe) cveUsuario: number){

    //verificar que el usuario existe
    const verifyUser = await this.usuarioSvc.verificarClave(cveUsuario);
    if (verifyUser.length <= 0) {
        throw new BadRequestException('El usuario no existe');
    }
        //Eliminar el usuario
        return await this.usuarioSvc.eliminar(cveUsuario);
        
    }

}

