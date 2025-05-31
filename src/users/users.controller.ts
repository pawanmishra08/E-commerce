import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/users.signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/users.signin.dto';
import { instanceToPlain } from 'class-transformer';

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
      // You can throw an exception or return a specific error response
      throw new Error('Invalid credentials');
    }
    const accesstoken = await this.usersService.accessToken(user);
    return {accesstoken, user};
    // return {user: instanceToPlain(user)}; // Convert to plain object to avoid exposing sensitive data
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
