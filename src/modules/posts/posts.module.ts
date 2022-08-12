import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/modules/auth/auth.service';
import { AccountEntity } from 'src/database/entities/account.entity';
import { AnonymousStrategy, JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from 'src/modules/auth/consts/secret.const';
import { Post } from '../../database/entities/post.entity';
import { Category } from 'src/database/entities/category.entity';

@Module({
	controllers: [PostsController],
	imports: [
		JwtStrategy,
		AnonymousStrategy,
		JwtModule.register({
			secret: SECRET,
			signOptions: { expiresIn: '600000s' },
		}),
	],
	providers: [PostsService, AuthService],
})
export class PostsModule { }
