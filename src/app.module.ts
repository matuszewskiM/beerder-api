import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SECRET } from './modules/auth/consts/secret.const';
import { AccountEntity } from './database/entities/account.entity';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { CommentsModule } from './modules/comments/comments.module';
import { PostsModule } from './modules/posts/posts.module';
import { Comment } from './database/entities/comment.entity';
import { Post } from './database/entities/post.entity';
import { Category } from './database/entities/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';

@Module({
	imports: [
		AuthModule,
		JwtModule.register({
			secret: SECRET,
			signOptions: { expiresIn: '6000000s' },
		}),
		JwtStrategy,
		DatabaseModule,
		MulterModule.register({
			dest: './images',
		}),
		CommentsModule,
		PostsModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'uploads'),
			serveRoot: '/uploads'
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
