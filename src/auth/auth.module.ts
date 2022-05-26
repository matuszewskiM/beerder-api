import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SECRET } from './consts/secret.const';
import { JwtStrategy } from './jwt.strategy';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		TypeOrmModule.forFeature([AccountEntity]),
		JwtModule.register({
			secret: SECRET,
			signOptions: { expiresIn: '6000s' },
		}),
		JwtStrategy,
	],
})
export class AuthModule {}
