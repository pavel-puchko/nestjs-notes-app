import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'Title example' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  title: string;

  @ApiProperty({ example: 'Description example' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  description: string;
}
