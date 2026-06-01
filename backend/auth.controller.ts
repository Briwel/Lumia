
import { Controller, Post, Body, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  @Post('register')
  async register(@Body() data: any) {
    const existingUser = await this.userRepo.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const user = this.userRepo.create({
      name: data.name,
      email: data.email,
      password: data.password, // À hasher en prod
      agencyName: data.agencyName,
      role: 'agent'
    });

    const savedUser = await this.userRepo.save(user);
    
    return {
      access_token: `real_jwt_sim_${savedUser.id}`,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        agencyName: savedUser.agencyName
      }
    };
  }

  @Post('login')
  async login(@Body() data: any) {
    const user = await this.userRepo.findOne({ 
      where: { email: data.email, password: data.password } 
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return {
      access_token: `real_jwt_sim_${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        agencyName: user.agencyName
      }
    };
  }
}
