import { IsInt } from 'class-validator';
import { CreateNoteDto } from './create-note.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto extends CreateNoteDto {
  @ApiProperty({ example: 33 })
  @IsInt()
  id: number;
}
