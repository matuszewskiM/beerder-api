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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@UseGuards(JwtAuthGuard)
	@Post(':id')
	create(
		@Param('id') commentId: number,
		@Req() req,
		@Body() createCommentDto: CreateCommentDto,
	) {
		return this.commentsService.create(
			createCommentDto,
			commentId,
			req.user.id,
		);
	}
}
