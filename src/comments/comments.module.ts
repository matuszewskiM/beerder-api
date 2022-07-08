import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from 'src/auth/consts/secret.const';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/auth/entities/account.entity';
import { PostsService } from 'src/posts/posts.service';
import { AuthService } from 'src/auth/auth.service';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Category } from 'src/shared/entities/category.entity';

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
export class CommentsModule {}
