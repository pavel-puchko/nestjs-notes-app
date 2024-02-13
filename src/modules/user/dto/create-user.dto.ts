import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsAlphanumeric,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'username1' })
  @IsString()
  @IsAlphanumeric()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @ApiProperty({ example: 'password_example' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;
}
