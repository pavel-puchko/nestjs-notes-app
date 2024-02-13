import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValueOnce({} as User);

      jest
        .spyOn(userRepository, 'create')
        .mockReturnValueOnce(createUserDto as User);

      await userService.create(createUserDto);

      expect(saveSpy).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'testuser';
      const user = { username } as User;

      const findOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(user);

      const result = await userService.findByUsername(username);

      expect(findOneSpy).toHaveBeenCalledWith({ username });
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    const userId = 1;

    it('should find a user by id with success', async () => {
      const userId = 1;
      const user = { id: userId } as User;

      const findOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(user);

      const result = await userService.findOne(userId);

      expect(findOneSpy).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const findOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(null);

      expect(userService.findOne(userId)).rejects.toThrow(NotFoundException);
      expect(findOneSpy).toHaveBeenCalledWith({ id: userId });
    });
  });
});
