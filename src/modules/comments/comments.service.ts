import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/modules/auth/auth.service';
import { PostsService } from 'src/modules/posts/posts.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '../../database/entities/comment.entity';
import { CommentsRepository } from 'src/repositories';

@Injectable()
export class CommentsService {
	constructor(
		private readonly commentRepository: CommentsRepository,
		private readonly postService: PostsService,
		private readonly authService: AuthService,
	) { }

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

	async rate(commentId: number,
		authorId: number,) {
		try {
			const comment = await this.commentRepository
				.createQueryBuilder('comment')
				.where('comment.id = :id', { id: commentId })
				.leftJoinAndSelect('comment.upvoters', 'upvoter')
				.getOne();

			const author = await this.authService.findById(authorId);
			console.log(comment, author)
			if (comment && author) {
				if (comment.upvoters.map(el => el.id).includes(author.id)) {
					console.log('zawiera')
					const upvoters = comment.upvoters.filter(
						(upvoter) => upvoter.id !== author.id,
					);
					comment.upvoters = upvoters;
					await this.commentRepository.save(comment);
				} else {
					console.log('nie zawiera')
					// comment.upvoters = [...comment.upvoters, author]
					comment.upvoters.push(author);
					await this.commentRepository.save(comment);
				}

				return await this.commentRepository
					.createQueryBuilder('comment')
					.where('comment.id = :id', { id: commentId })
					.loadRelationCountAndMap('comment.rating', 'comment.upvoters')
					.leftJoinAndSelect('comment.author', 'author')
					.leftJoinAndMapOne("comment.isLiked", "comment.upvoters", "user", "user.id = :authorId", { authorId })
					.getOne();
			}
			console.log('dsds')
			return null;
		} catch (err) {
			console.log(err)
			return null;
		}
	}
}
