import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/modules/auth/auth.service';
import { Category } from 'src/database/entities/category.entity';
import { Repository } from 'typeorm';
import { fileURLToPath } from 'url';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../../database/entities/post.entity';
import { CategoriesRepository, PostsRepository } from 'src/repositories';
import * as fs from 'fs';
import { Sorting } from './types/sorting.enum';
import { AccountEntity } from 'src/database/entities/account.entity';


@Injectable()
export class PostsService {
	constructor(
		private readonly postRepository: PostsRepository,
		private readonly authService: AuthService,
		private readonly categoryRepository: CategoriesRepository,
	) { }

	async create(createPostDto: CreatePostDto, authorId: number, image: Express.Multer.File) {
		try {
			const filePath = image.path
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
			post.date = new Date();
			post.imagePath = filePath
			post.categories = categories;
			return await this.postRepository.save(post);
		} catch (error) {
			fs.unlink(image.path, (err) => {
				if (err) {
					throw err;
				}
				console.log("File is deleted.");
			});
			return new BadRequestException();
		}
	}

	async findAll(params: {
		categoryId?: number;
		page: number;
		pageSize: number;
		sorting: Sorting;
		id?: number
	}) {
		try {
			const query = this.postRepository
				.createQueryBuilder('post')
				.leftJoinAndSelect('post.author', 'author')
				.leftJoinAndSelect('post.categories', 'category')
				.leftJoinAndMapOne("post.isLiked", "post.upvoters", "user", "user.id = :id", { id: params.id })
				.loadRelationCountAndMap('post.commentsCount', 'post.comments')
				.loadRelationCountAndMap('post.rating', 'post.upvoters')

			const queryWithCategory = params.categoryId
				? query
					.where('category.id = :id', { id: params.categoryId })
				: query;

			if (params.sorting === Sorting.daily) {
				const results = await queryWithCategory.where('post.date > :yesterday', { yesterday: new Date(Date.now() - 86400000) })
					.orderBy('post.date', 'DESC')
					.skip(params.pageSize * (params.page - 1))
					.take(params.pageSize)
					.getManyAndCount();

				return { posts: results[0], results: results[1] };
			}

			if (params.sorting === Sorting.top) {
				const results = await queryWithCategory


					// .skip(params.pageSize * (params.page - 1))
					// .take(params.pageSize)
					.getManyAndCount();

				return {
					results: results[1],
					posts: results[0].sort((a, b) => b['rating'] - a['rating']).splice(((params.page - 1) * params.pageSize), params.pageSize)
				}

				console.log(results)

				return { posts: results[0], results: results[1] };
			}


			if (params.sorting === Sorting.newest) {
				const results = await queryWithCategory
					.orderBy('post.date', 'DESC')
					.skip(params.pageSize * (params.page - 1))
					.take(params.pageSize)
					.getManyAndCount();

				return { posts: results[0], results: results[1] };
			}

			console.log(params)

			throw new BadRequestException()


			// const results = params.categoryId
			// 	? await query
			// 		.where('category.id = :id', { id: params.categoryId })
			// 		.skip(params.pageSize * (params.page - 1))
			// 		.take(params.pageSize)
			// 		.getManyAndCount()
			// 	: await query
			// 		.skip(params.pageSize * (params.page - 1))
			// 		.take(params.pageSize)
			// 		.getManyAndCount();

			// return { posts: results[0], results: results[1] };
		}
		catch (err) {
			console.log(err)
			return new BadRequestException()
		}

		// return await this.postRepository.find({
		// 	order: { date: 'DESC' },
		// 	relations: ['author', 'comments', 'categories'],
		// });
	}

	async findOne(id: number, searcherId?: number) {

		try {
			const post = await this.postRepository
				.createQueryBuilder('post')
				.where('post.id = :id', { id: id })
				.leftJoinAndMapOne("post.isLiked", "post.upvoters", "user", "user.id = :searcherId", { searcherId })
				.leftJoinAndSelect('post.comments', 'comment')
				.leftJoinAndMapOne("comment.isLiked", "comment.upvoters", "liker", "liker.id = :searcherId", { searcherId })
				.leftJoinAndSelect('comment.author', 'commentAuthor')
				.loadRelationCountAndMap('comment.rating', 'comment.upvoters')
				.leftJoinAndSelect('post.categories', 'category')
				.loadRelationCountAndMap('post.commentsCount', 'post.comments')
				.loadRelationCountAndMap('post.rating', 'post.upvoters')
				.loadRelationCountAndMap('comment.rating', 'comment.upvoters')
				.leftJoinAndSelect('post.author', 'author')
				.getOne();

			return {
				...post, isLiked: Boolean(post['isLiked']), comments: post.comments.map(comment => {
					return { ...comment, isLiked: Boolean(comment['isLiked']) }
				})
			}
		}
		catch (err) {
			return new BadRequestException()
		}
	}

	async rate(id: number, userId: number) {
		try {
			const post = await this.postRepository
				.createQueryBuilder('post')
				.where('post.id = :id', { id: id })
				.leftJoinAndSelect('post.upvoters', 'upvoter')
				.getOne();
			const user = await this.authService.findById(userId);

			if (post.upvoters.map(el => el.id).includes(user.id)) {
				console.log('zawiera')
				const upvoters = post.upvoters.filter(
					(upvoter) => upvoter.id !== user.id,
				);
				post.upvoters = upvoters;
				await this.postRepository.save(post);
			} else {
				post.upvoters.push(user);
				await this.postRepository.save(post);
			}

			return await this.findOne(id, user.id);
		}
		catch (err) {
			return new BadRequestException()
		}

	}

	findAllCategories() {
		try {
			const categories = this.categoryRepository.find();
			return categories
		}
		catch (err) {
			return new BadRequestException()
		}
	}

	createCategories(names: string[]) {
		try {
			return names.forEach(name => {
				const category = new Category()
				category.name = name
				this.categoryRepository.save(category)
			})
		}
		catch (err) {
			return new BadRequestException()
		}
	}

	update(id: number, updatePostDto: UpdatePostDto) {
		return `This action updates a #${id} post`;
	}

	remove(id: number) {
		return `This action removes a #${id} post`;
	}
}
