import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiConsumes, ApiNotFoundResponse, ApiOperation, ApiParam, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDTO } from 'src/utils/utils.types';
import { OTPUserDTO } from 'src/auth/dto/auth.dto';

@ApiTags('Users') // This tag will group your API endpoints under "Courses" in Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    description: 'Verify user with unique-code after login or signup',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post('/verification/verify-signup-or-login-code/')
  async verifyCodeAfterSignup(@Body() payload: OTPUserDTO) {
    // : Promise<BaseResponseTypeDTO>
    const { uniqueVerificationCode, userId } = payload;
    return await this.usersService.verifyCodeAfterSignuporLogin(
      uniqueVerificationCode,
      userId,
    );
  }


  @ApiOperation({ description: 'Resend OTP after login' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Get('/resend-otp-code/:userId')
  async resendOTPAfterLogin(@Param('userId') userId: string) {
    // : Promise<BaseResponseTypeDTO>
    return await this.usersService.resendOTPAfterLogin(userId);
  }

  @ApiOperation({ description: 'Initiate forgot-password flow' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post('/verification/initiate-forgot-password-flow/:email')
  async initiateForgotPasswordFlow(
    @Param('email') email: string,
  ): Promise<any> {
    return await this.usersService.initiateForgotPasswordFlow(email);
  }

  @ApiOperation({ description: 'Finalize forgot-password flow' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post('/verification/finalize-forgot-password-flow/:uniqueVerificationCode')
  async finalizeForgotPasswordFlow(
    @Param('uniqueVerificationCode') uniqueVerificationCode: string,
  ): Promise<any> {
    return await this.usersService.finalizeForgotPasswordFlow(
      uniqueVerificationCode,
    );
  }

  @ApiOperation({ description: 'Change password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  // @ApiBearerAuth('JWT')
  // @Roles(AppRole.ADMIN,AppRole.EMPLOYER)
  // @UseGuards(RolesGuard)
  @Post('/verification/change-password')
  async changePassword(@Body() payload: UpdatePasswordDTO): Promise<any> {
    return await this.usersService.changePassword(payload);
  }

  @Get('/user-id/:userId')
  @ApiParam({ name: 'userId', description: 'ID of the user to retrieve' })
  // @ApiOkResponse({ description: 'User found', type: UserResponseDTO })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findUserById(@Param('userId') userId: string): Promise<any> {
    try {
      const user = await this.usersService.findUserById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update a user' })
  @Patch('/user/:userId')
  @ApiParam({ name: 'userId', description: 'ID of the user to update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been updated successfully',
  })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<any> {
    return this.usersService.updateUser(userId, updateUser);
  }



  @Get("admin/allusers")
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getAllUsers(@Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.getAllUsers(page, limit);
  }

  @Get('admin/allusers/count-per-day')
  @ApiOperation({ summary: 'Count registered users per day within a date range' })
  @ApiQuery({ name: 'startDate', type: String, example: '2024-02-01' })
  @ApiQuery({ name: 'endDate', type: String, example: '2024-02-10' })
  async countRegisteredUsersPerDay(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.usersService.countRegisteredUsersPerDay(startDate, endDate);
  }

  @Get('admin/allusers/weekly-growth')
  @ApiOperation({ summary: 'Get percentage increase/decrease in registered users from last week' })
  async getWeeklyUserGrowth() {
    return this.usersService.getWeeklyUserGrowth();
  }

  @Get('admin/allusers/incomplete-academic')
  @ApiOperation({ summary: 'Get users with incomplete academic background (with pagination)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getUsersWithIncompleteAcademicBackground(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.usersService.getUsersWithIncompleteAcademicBackground(page, limit);
  }
}
