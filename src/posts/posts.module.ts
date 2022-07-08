import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { AccountEntity } from 'src/auth/entities/account.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from 'src/auth/consts/secret.const';
import { Post } from './entities/post.entity';
import { Category } from 'src/shared/entities/category.entity';

@Module({
	controllers: [PostsController],
	imports: [
		TypeOrmModule.forFeature([Post, AccountEntity, Category]),
		JwtStrategy,
		JwtModule.register({
			secret: SECRET,
			signOptions: { expiresIn: '600000s' },
		}),
	],
	providers: [PostsService, AuthService],
})
export class PostsModule {}
