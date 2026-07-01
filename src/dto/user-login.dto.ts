import { IsNotEmpty } from 'class-validator';

export class UserLoginDTO {
  @IsNotEmpty({ message: 'Имя не может быть пустым!' })
  user_name!: string;
  @IsNotEmpty({ message: 'Имя не может быть пустым!' })
  user_password!: string;
}
