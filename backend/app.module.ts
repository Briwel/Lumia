
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Property, Contract, Operation } from './entities';
import { PropertyController, OperationController, AgentPropertyController } from './property.controller';
import { AuthController } from './auth.controller';

const getDatabaseConfig = (): any => {
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };
  }
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'lumina_immo',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...getDatabaseConfig(),
      entities: [User, Property, Contract, Operation],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Property, Contract, Operation]),
  ],
  controllers: [PropertyController, OperationController, AgentPropertyController, AuthController],
})
export class AppModule {}
