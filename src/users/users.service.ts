import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/users.signup.dto';
import { hash, compare } from  'bcrypt';
import { UserSignInDto } from './dto/users.signin.dto';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

   async signup(usersignupDto:UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(usersignupDto.email)
    if(userExists)
      throw new BadRequestException('this email already exist.');

    usersignupDto.password = await hash(usersignupDto.password,10);

    let user= this.usersRepository.create(usersignupDto);
    user=  await this.usersRepository.save(user);
    return user;

  }

  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.usersRepository
    .createQueryBuilder('users')
    .addSelect('users.password')
    .where('users.email= :email',{ email: userSignInDto.email })
    .getOne();
     if (!userExists) {
    throw new BadRequestException('Invalid email or password');
    }
    const matchpassword = await compare(userSignInDto.password, userExists.password);
    if (!matchpassword) {
      throw new BadRequestException('Invalid credientials');
    }
   return userExists;
  }


  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string){
    return await this.usersRepository.findOneBy({email});
  }
  async accessToken(user: UserEntity): Promise<string> {
  const secret =  this.configService.get('ACCESS_TOKEN_SECRET_KEY');
  const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');

  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET_KEY is not valid');
  }

  return sign({ id: user.id, email: user.email }, secret, { expiresIn });
}
}
