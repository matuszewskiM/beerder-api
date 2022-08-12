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
	Header,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/category.entity';
import { Repository } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) { }

	@UseGuards(JwtAuthGuard)
	@Post('create')
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads'
				, filename: (req, file, cb) => {
					// Generating a 32 random chars long string
					const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
					//Calling the callback passing the random name generated with the original extension name
					cb(null, `${randomName}${file.originalname}`)
				}
			})
			// storage: {
			// 	destination: '../../files',
			// 	filename: () => Math.floor(Math.random() * 10000) + '#' + Date.now,

			// },
		}),
	)
	create(
		@UploadedFile() image: Express.Multer.File,
		@Req() req,
		@Body() createPostDto: CreatePostDto,

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


	@UseGuards(AuthGuard(['jwt', 'anonymous']))
	@Get(':id')
	findOne(@Param('id') id: number, @Req() req) {
		return this.postsService.findOne(id, req?.user?.id);
	}

	@UseGuards(AuthGuard(['jwt', 'anonymous']))
	@Get()
	findAll(
		@Req() req,
		@Query('categoryId') categoryId?: number,
		@Query('page') page?: number,
		@Query('pageSize') pageSize?: number,
		@Query('id') id?: number
	) {
		return this.postsService.findAll({ categoryId, page, pageSize, id: req?.user?.id });
	}

	@Post('create-categories')
	createCategories(@Body() body: { names: string[] }) {
		const result = this.postsService.createCategories(body.names)
		console.log(result)
		return result
	}
}
