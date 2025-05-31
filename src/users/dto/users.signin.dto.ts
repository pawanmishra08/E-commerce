import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserSignInDto {
        @IsNotEmpty({message: 'Email should not be empty'})
        @IsEmail({},{message: 'pease provide a valid email.'})
        email: string;


        @IsNotEmpty({message: 'password  can not be empty.'})
        @MinLength(5,{message: 'password minimum character should be 5.'})
        password: string;
}