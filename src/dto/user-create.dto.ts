import { IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Фамилия не может быть пустым!' })
  fullname!: string;
  @IsNotEmpty({ message: 'Имя не может быть пустым!' })
  user_name!: string;
  @IsNotEmpty({ message: 'Пароль не может быть пустым!' })
  user_password!: string;
  @IsNotEmpty({ message: 'Почта не может быть пустым!' })
  user_email!: string;
}
