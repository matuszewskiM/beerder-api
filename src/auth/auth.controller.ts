import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpException,
	HttpStatus,
	ConflictException,
	Res,
	UseFilters,
	Catch,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-auth.dto';

@Controller('account')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('create')
	async create(
		@Body() createAccountDto: CreateAccountDto,
		@Res() res: Response,
	) {
		const result = await this.authService.findOne(createAccountDto.login);
		if (result) {
			const exception = new ConflictException();
			throw exception;
		}

		try {
			await this.authService.createAccount(createAccountDto).then();
			return;
		} catch (err) {
			return err;
		}
	}

	// @Get(':id')
	// findOne(@Param('id') id: string) {
	//   return this.authService.findOne(+id);
	// }

	@Get('all')
	findAll() {
		return this.authService.findAll();
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
