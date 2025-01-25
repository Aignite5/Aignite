import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserDTO,
  SignUpDTO,
  ThirdPartyAuthResponseDTO,
  ThirdPartyLoginDTO,
} from './dto/auth.dto';
import {
  ApiOperation,
  ApiProduces,
  ApiConsumes,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CreateAccountDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly UserSrv: UsersService,
  ) {}

  @ApiOperation({ description: 'Sign Up with email and password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  // @ApiResponse({ type: AuthResponseDTO })
  @Post('users/UserSignup')
  async GlobalLeveluserUsersignUp(@Body() payload: CreateAccountDto) {
    return await this.authService.GlobalLevelUsersignUp(payload);
  }

  @ApiOperation({ description: 'Login with email and password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  // @ApiResponse({ type: AuthResponseDTO })
  @Post('/Userlogin')
  async userlogin(@Body() payload: LoginUserDTO) {
    return await this.authService.Userlogin(payload);
  }
}
