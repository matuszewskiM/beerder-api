import {
	Controller,
	Get,
	Post,
	Body,
	ConflictException,
	NotFoundException,
	UseGuards,
	Request,
	UnprocessableEntityException,
} from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('account')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getInfo(@Request() req) {
		return this.authService.findById(req.user.id);
	}

	@Post('create')
	@ApiCreatedResponse({ description: 'Created' })
	@ApiConflictResponse({ description: 'Conflict' })
	@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
	async create(@Body() createAccountDto: CreateAccountDto) {
		const user = await this.authService.findOne(createAccountDto.nickname);
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
}
