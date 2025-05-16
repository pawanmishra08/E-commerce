import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/users.signup.dto';
import { hash } from  'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

   async signup(usersignupDto:UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.finduserByEmail(usersignupDto.email)
    if(userExists)
      throw new BadRequestException('this email already exist.');

    usersignupDto.password = await hash(usersignupDto.password,10);

    const user  = this.usersRepository.create(usersignupDto);
    return await this.usersRepository.save(user);
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

  async finduserByEmail(email: string){
    return await this.usersRepository.findOneBy({email});
  }
}
