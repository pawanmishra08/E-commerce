import { IsEmail, IsNotEmpty, IsString,MinLength } from "class-validator";
import { UserSignInDto } from "./users.signin.dto";

export class UserSignUpDto extends UserSignInDto{
    @IsNotEmpty({message: 'Name should not be null'})
    @IsString({message: 'Name should be string'})
    name: string;

}