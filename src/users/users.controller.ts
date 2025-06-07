import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/users.signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/users.signin.dto';
import { CurrentUser } from 'src/utility/common/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/common/guards/authentication.guard';
import { AuthorizeRoles } from 'src/utility/common/decorators/authorization.roles.decorators';
import { AuthorizeGuard } from 'src/utility/common/guards/authorization.guard';
import { Roles } from 'src/utility/common/user.roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
   async signup(@Body() usersignupDto:UserSignUpDto): Promise<{user:UserEntity}> {
    return {user:await this.usersService.signup(usersignupDto)}
  }

  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto): Promise< {
    accesstoken: string;
    user: UserEntity;
  }>
  {
    const user = await this.usersService.signin(userSignInDto);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const accesstoken = await this.usersService.accessToken(user);
    return {accesstoken, user};
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string) : Promise<UserEntity>{
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser()  currentUser: UserEntity){
    return currentUser;
  }
}
