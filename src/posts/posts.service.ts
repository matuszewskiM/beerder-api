import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Category } from 'src/shared/entities/category.entity';
import { Repository } from 'typeorm';
import { fileURLToPath } from 'url';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,
		private readonly authService: AuthService,
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
	) {}

	async create(createPostDto: CreatePostDto, authorId: number, image: File) {
		try {
			const author = await this.authService.findById(authorId);
			const post = new Post();
			const categories = await this.categoryRepository
				.createQueryBuilder()
				.where('id IN (:...ids)', {
					ids: createPostDto.categoryIds,
				})
				.getMany();

			post.title = createPostDto.title;
			post.author = author;
			post.imagePath = 'http://127.0.0.1/' + image.name;
			post.date = new Date();
			post.categories = categories;
			return await this.postRepository.save(post);
		} catch (error) {
			console.log(error);
			return new NotFoundException();
		}
	}

	async findAll(params: {
		categoryId?: number;
		page: number;
		pageSize: number;
	}) {
		const query = this.postRepository
			.createQueryBuilder('post')
			.orderBy('post.date', 'DESC')
			.leftJoinAndSelect('post.author', 'author')
			.leftJoinAndSelect('post.categories', 'category')
			.loadRelationCountAndMap('post.commentsCount', 'post.comments')
			.loadRelationCountAndMap('post.rating', 'post.upvoters');

		const results = params.categoryId
			? await query
					.where('category.id = :id', { id: params.categoryId })
					.skip(params.pageSize * (params.page - 1))
					.take(params.pageSize)
					.getManyAndCount()
			: await query
					.skip(params.pageSize * (params.page - 1))
					.take(params.pageSize)
					.getManyAndCount();

		return { posts: results[0], results: results[1] };

		// return await this.postRepository.find({
		// 	order: { date: 'DESC' },
		// 	relations: ['author', 'comments', 'categories'],
		// });
	}

	async findOne(id: number) {
		console.log(id);
		return await this.postRepository
			.createQueryBuilder('post')
			.where('post.id = :id', { id: id })
			.leftJoinAndSelect('post.comments', 'comment')
			.leftJoinAndSelect('comment.author', 'commentAuthor')
			.loadRelationCountAndMap('comment.rating', 'comment.upvoters')
			.leftJoinAndSelect('post.author', 'author')
			.leftJoinAndSelect('post.categories', 'category')
			.loadRelationCountAndMap('post.commentsCount', 'post.comments')
			.loadRelationCountAndMap('post.rating', 'post.upvoters')
			.getOne();
	}

	async rate(id: number, userId: number) {
		const post = await this.postRepository
			.createQueryBuilder('post')
			.where('post.id = :id', { id: id })
			.leftJoinAndSelect('post.upvoters', 'upvoter')
			.getOne();
		const user = await this.authService.findById(userId);
		if (post.upvoters.includes(user)) {
			const upvoters = post.upvoters.filter(
				(upvoter) => upvoter !== user,
			);
			post.upvoters = upvoters;
			await this.postRepository.save(post);
		}
		post.upvoters.push(user);
		await this.postRepository.save(post);
		return await this.findOne(id);
	}

	findAllCategories() {
		return this.categoryRepository.find();
	}

	update(id: number, updatePostDto: UpdatePostDto) {
		return `This action updates a #${id} post`;
	}

	remove(id: number) {
		return `This action removes a #${id} post`;
	}
}
