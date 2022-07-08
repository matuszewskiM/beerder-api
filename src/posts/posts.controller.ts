import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
	Query,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/shared/entities/category.entity';
import { Repository } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	@UseInterceptors(
		FileInterceptor('image', {
			storage: {
				destination: './files',
				filename: Math.floor(Math.random() * 10000) + '#' + Date.now,
			},
		}),
	)
	create(
		@Req() req,
		@Body() createPostDto: CreatePostDto,
		@UploadedFile() image,
	) {
		return this.postsService.create(createPostDto, req.user.id, image);
	}

	@UseGuards(JwtAuthGuard)
	@Post('rate/:id')
	async rate(@Param('id') id: number, @Req() req) {
		return await this.postsService.rate(id, req.user.id);
	}

	@Get('categories')
	findAllCategories() {
		return this.postsService.findAllCategories();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.postsService.findOne(id);
	}

	@Get()
	findAll(
		@Query('categoryId') categoryId?: number,
		@Query('page') page?: number,
		@Query('pageSize') pageSize?: number,
	) {
		return this.postsService.findAll({ categoryId, page, pageSize });
	}
}
