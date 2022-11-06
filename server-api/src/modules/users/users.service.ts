import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
  ) {}
  async createOne(user: User) {
    const newUser = await this.userRepository.save(user);
    return newUser;
  }
  async findMany(): Promise<User[]> {
    return await this.userRepository.find()
  }
  async findOne(query: {}): Promise<User> {
    return await this.userRepository.findOne({ where: query });
  }
  async updateOne(id: number, user: { username: string; image: string }) {
    return await this.userRepository.update(id, {
      username: user.username,
      image: user.image,
    });
  }
  async deleteOne(id: number): Promise<any> {
    const deletedUser = await this.userRepository.delete(id);
    console.log(deletedUser);
    return deletedUser;
  }
  async updateToken(id: number, refreshTokens: string[]) {
    return await this.userRepository.update(id, { refreshTokens });
  }
}
