import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from 'src/modules/auth/consts/secret.const';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/database/entities/account.entity';
import { PostsService } from 'src/modules/posts/posts.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { Comment } from '../../database/entities/comment.entity';
import { Post } from 'src/database/entities/post.entity';
import { Category } from 'src/database/entities/category.entity';

@Module({
	controllers: [CommentsController],
	imports: [
		TypeOrmModule.forFeature([Post, AccountEntity, Comment, Category]),
		JwtStrategy,
		JwtModule.register({
			secret: SECRET,
			signOptions: { expiresIn: '600000s' },
		}),
	],
	providers: [CommentsService, PostsService, AuthService],
})
export class CommentsModule { }
