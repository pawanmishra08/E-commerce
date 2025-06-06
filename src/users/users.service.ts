import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async onModuleInit() {
    const defaultEmail = 'xyz@gmail.com';
    const defaultPassword = '12345';

    const userExists = await this.findUserByEmail(defaultEmail);
    if (!userExists) {
      const hashedPassword = await hash(defaultPassword, 10);
      const defaultUser = this.usersRepository.create({
        email: defaultEmail,
        password: hashedPassword,
        name: 'Default User',
      });
      await this.usersRepository.save(defaultUser);
      console.log(`✅ Default user created: ${defaultEmail}`);
    } else {
      console.log(`ℹ️ Default user already exists: ${defaultEmail}`);
    }
  }

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

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user=  await this.usersRepository.findOneBy({id});
    if(!user) {
      throw new NotFoundException('user not found');
    }
    return user;
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
