import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { UserModule } from '../user/user.module';
import { Note } from './entities/note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UserModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
