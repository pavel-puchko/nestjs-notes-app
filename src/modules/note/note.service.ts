import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './entities/note.entity';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async findAllByUserId(userId: number): Promise<Note[]> {
    return this.noteRepository.find({ where: { user: { id: userId } } });
  }

  async findOneByUserId(id: number, userId: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async createByUserId(
    createNoteDto: CreateNoteDto,
    userId: number,
  ): Promise<Note> {
    const createdNote = this.noteRepository.create({
      ...createNoteDto,
      user: { id: userId },
    });

    return await this.noteRepository.save(createdNote);
  }

  async updateByUserId(
    id: number,
    updateNoteDto: UpdateNoteDto,
    userId: number,
  ): Promise<Note> {
    const existingNote = await this.findOneByUserId(id, userId);
    const updatedNote = this.noteRepository.merge(existingNote, updateNoteDto);

    return await this.noteRepository.save(updatedNote);
  }

  async removeByUserId(id: number, userId: number): Promise<void> {
    const noteToRemove = await this.findOneByUserId(id, userId);

    await this.noteRepository.remove(noteToRemove);
  }
}
