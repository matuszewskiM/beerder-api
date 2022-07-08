import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SECRET } from './auth/consts/secret.const';
import { AccountEntity } from './auth/entities/account.entity';
import { JwtStrategy } from './auth/jwt.strategy';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { Comment } from './comments/entities/comment.entity';
import { Post } from './posts/entities/post.entity';
import { Category } from './shared/entities/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';

@Module({
	imports: [
		AuthModule,
		JwtModule.register({
			secret: SECRET,
			signOptions: { expiresIn: '6000000s' },
		}),
		JwtStrategy,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: '127.0.0.1',
			port: 5432,
			username: 'postgres',
			password: 'mikolaj00',
			database: 'meme-site-db',
			entities: [AccountEntity, Comment, Post, Category],
			synchronize: true,
		}),
		MulterModule.register({
			dest: './images',
		}),
		CommentsModule,
		PostsModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'images'),
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
