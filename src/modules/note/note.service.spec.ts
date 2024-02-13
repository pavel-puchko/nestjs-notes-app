// src/note/note.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from './note.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotFoundException } from '@nestjs/common';
import { Note } from './entities/note.entity';

describe('NoteService', () => {
  const testUserId = 1;

  let noteService: NoteService;
  let noteRepository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: getRepositoryToken(Note),
          useClass: Repository,
        },
      ],
    }).compile();

    noteService = module.get<NoteService>(NoteService);
    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  it('should be defined', () => {
    expect(noteService).toBeDefined();
  });

  describe('findAllByUserId', () => {
    it('should return an array of notes', async () => {
      const notes: Note[] = [
        {
          id: 1,
          title: 'Note 1',
          description: 'Description 1',
          timestamp: new Date(),
        },
        {
          id: 2,
          title: 'Note 2',
          description: 'Description 2',
          timestamp: new Date(),
        },
      ];

      jest.spyOn(noteRepository, 'find').mockResolvedValueOnce(notes);

      const result = await noteService.findAllByUserId(testUserId);

      expect(result).toEqual(notes);
    });
  });

  describe('findOneByUserId', () => {
    it('should return a single note by ID', async () => {
      const noteId = 1;
      const note: Note = {
        id: noteId,
        title: 'Note 1',
        description: 'Description 1',
        timestamp: new Date(),
      };

      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(note);

      const result = await noteService.findOneByUserId(noteId, testUserId);

      expect(result).toEqual(note);
    });

    it('should throw NotFoundException if note is not found', async () => {
      const noteId = 1;

      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        noteService.findOneByUserId(noteId, testUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'New Note',
        description: 'New Description',
      };
      const createdNote: Note = {
        id: 1,
        timestamp: new Date(),
        ...createNoteDto,
      };

      jest.spyOn(noteRepository, 'create').mockReturnValueOnce(createdNote);
      jest.spyOn(noteRepository, 'save').mockResolvedValueOnce(createdNote);

      const result = await noteService.createByUserId(
        createNoteDto,
        testUserId,
      );

      expect(result).toEqual(createdNote);
    });
  });

  describe('updateByUserId', () => {
    it('should update an existing note', async () => {
      const noteId = 1;
      const updateNoteDto: UpdateNoteDto = {
        id: 1,
        title: 'Updated Note',
        description: 'Updated Description',
      };
      const existingNote: Note = {
        id: noteId,
        timestamp: new Date(),
        title: 'Original Note',
        description: 'Original Description',
      };
      const updatedNote: Note = {
        id: noteId,
        timestamp: new Date(),
        ...updateNoteDto,
      };

      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(existingNote);
      jest.spyOn(noteRepository, 'merge').mockReturnValueOnce(updatedNote);
      jest.spyOn(noteRepository, 'save').mockResolvedValueOnce(updatedNote);

      const result = await noteService.updateByUserId(
        noteId,
        updateNoteDto,
        testUserId,
      );

      expect(result).toEqual(updatedNote);
    });

    it('should throw NotFoundException if note is not found', async () => {
      const noteId = 1;
      const updateNoteDto: UpdateNoteDto = {
        id: 1,
        title: 'Updated Note',
        description: 'Updated Description',
      };

      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        noteService.updateByUserId(noteId, updateNoteDto, testUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeByUserId', () => {
    it('should remove an existing note', async () => {
      const noteId = 1;
      const existingNote: Note = {
        id: noteId,
        timestamp: new Date(),
        title: 'Original Note',
        description: 'Original Description',
      };

      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(existingNote);
      jest.spyOn(noteRepository, 'remove').mockResolvedValueOnce(undefined);

      await noteService.removeByUserId(noteId, testUserId);

      expect(noteRepository.remove).toHaveBeenCalledWith(existingNote);
    });

    it('should throw NotFoundException if note is not found', async () => {
      const noteId = 1;

      jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        noteService.removeByUserId(noteId, testUserId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
