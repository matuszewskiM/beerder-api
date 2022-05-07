import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-auth.dto';

@Controller('account')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('create')
	create(@Body() createAccountDto: CreateAccountDto) {
		return this.authService.createAccount(createAccountDto);
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
