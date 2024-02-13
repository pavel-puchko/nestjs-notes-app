import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Note } from './entities/note.entity';
import { NoteService } from './note.service';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtTokenUser } from '../auth/types/access-token.types';

@ApiTags('notes')
@ApiBearerAuth()
@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all user notes',
    description:
      'Retrieve a list of notes belonging to the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user notes',
    type: Note,
    isArray: true,
  })
  findAll(@AuthUser() user: JwtTokenUser) {
    return this.noteService.findAllByUserId(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single user note',
    description:
      'Retrieve a single note by ID belonging to the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'The found user note', type: Note })
  @ApiResponse({ status: 404, description: 'Note not found' })
  findOne(@Param('id') id: string, @AuthUser() user: JwtTokenUser) {
    return this.noteService.findOneByUserId(+id, user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user note',
    description:
      'Create a new note with the provided data for the authenticated user.',
  })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({
    status: 201,
    description: 'The created user note',
    type: Note,
  })
  create(@Body() createNoteDto: CreateNoteDto, @AuthUser() user: JwtTokenUser) {
    return this.noteService.createByUserId(createNoteDto, user.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a user note',
    description:
      'Update a note with the provided data for the authenticated user.',
  })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({
    status: 200,
    description: 'The updated user note',
    type: Note,
  })
  @ApiResponse({ status: 404, description: 'Note not found' })
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @AuthUser() user: JwtTokenUser,
  ) {
    return this.noteService.updateByUserId(+id, updateNoteDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user note',
    description: 'Delete a note by ID for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'Note successfully deleted' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  remove(@Param('id') id: string, @AuthUser() user: JwtTokenUser) {
    return this.noteService.removeByUserId(+id, user.id);
  }
}
