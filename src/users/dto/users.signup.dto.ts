import { IsEmail, IsNotEmpty, IsString,MinLength } from "class-validator";

export class UserSignUpDto {
    @IsNotEmpty({message: 'Name should not be null'})
    @IsString({message: 'Name should be string'})
    name: string;

    @IsNotEmpty({message: 'Email should not be empty'})
    @IsEmail({},{message: 'pease provide a valid email.'})
    email: string;

    @IsNotEmpty({message: 'password  can not be empty.'})
    @MinLength(5,{message: 'password minimum character should be 5.'})
    password: string;
}