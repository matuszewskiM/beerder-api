import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { PostsService } from 'src/posts/posts.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(Comment)
		private readonly commentRepository: Repository<Comment>,
		private readonly postService: PostsService,
		private readonly authService: AuthService,
	) {}

	async create(
		createCommentDto: CreateCommentDto,
		postId: number,
		authorId: number,
	) {
		try {
			const post = await this.postService.findOne(postId);
			const author = await this.authService.findById(authorId);
			if (post && author) {
				const comment = new Comment();
				comment.author = author;
				comment.post = post;
				comment.body = createCommentDto.body;
				comment.date = new Date();
				return await this.commentRepository.save(comment);
			}
			return null;
		} catch {
			return null;
		}
	}
}
