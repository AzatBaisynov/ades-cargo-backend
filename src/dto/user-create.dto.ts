import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Фамилия не может быть пустым!' })
  fullname!: string;
  @IsNotEmpty({ message: 'Имя не может быть пустым!' })
  user_name!: string;
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым!' })
  user_password!: string;
  @IsEmail({}, { message: 'Некорректный формат почты' })
  @IsNotEmpty({ message: 'Почта не может быть пустым!' })
  user_email!: string;
}
