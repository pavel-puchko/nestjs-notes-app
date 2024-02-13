import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { AccessToken } from './types/access-token.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AccessToken> {
    if (await this.userService.findByUsername(createUserDto.username)) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.login(user);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userService.findByUsername(loginUserDto.username);

    if (
      !user ||
      !(await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new BadRequestException('Username or password is incorrect');
    }

    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { username: user.username, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
