import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ConflictException,
	Res,
	NotFoundException,
	UseGuards,
	Req,
	Request,
	UnprocessableEntityException,
} from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAccountDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('account')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('create')
	@ApiCreatedResponse({ description: 'Created' })
	@ApiConflictResponse({ description: 'Conflict' })
	@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
	async create(@Body() createAccountDto: CreateAccountDto) {
		const user = await this.authService.findOne(createAccountDto.login);
		if (user) {
			const exception = new ConflictException();
			throw exception;
		}

		try {
			await this.authService.createAccount(createAccountDto);
			return;
		} catch (err) {
			console.log(err);
			throw new UnprocessableEntityException();
		}
	}

	@Post('login')
	async login(@Body() loginDto: LoginDto) {
		const token = await this.authService.login(loginDto);
		if (token) {
			return token;
		} else {
			throw new NotFoundException();
		}
	}

	@Get('all')
	findAll() {
		return this.authService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('user/random')
	async find(@Request() req) {
		const randomUser = await this.authService.findRandom(req.user.id);
		return { user: randomUser };
	}

	@UseGuards(JwtAuthGuard)
	@Post('user/reject/:id')
	async reject(@Request() req, @Param('id') id: number) {
		const rejectionStatus = await this.authService.rejectUser(
			req.user.id,
			id,
		);
		if (rejectionStatus) {
			return;
		} else {
			throw new UnprocessableEntityException();
		}
	}

	@UseGuards(JwtAuthGuard)
	@Post('user/accept/:id')
	async accept(@Request() req, @Param('id') id: number) {
		const acceptionStatus = await this.authService.acceptUser(
			req.user.id,
			id,
		);
		if (acceptionStatus) {
			return;
		} else {
			throw new UnprocessableEntityException();
		}
	}

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
	//   return this.authService.update(+id, updateAccountDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	//   return this.authService.remove(+id);
	// }
}
