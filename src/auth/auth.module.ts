import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [TypeOrmModule.forFeature([AccountEntity])],
})
export class AuthModule {}
