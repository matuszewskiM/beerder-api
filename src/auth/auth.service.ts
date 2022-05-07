import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-auth.dto';
import { AccountEntity } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(AccountEntity)
		private accountsRepository: Repository<AccountEntity>,
	) {}

	// create(createAccountDto: CreateAccountDto) {
	// 	return this.accountsRepository.create(createAccountDto);
	// }

	findOne(id: number) {
		return `This action returns a #${id} auth`;
	}

	findAll() {
		return this.accountsRepository.find();
	}

	// update(id: number, updateAccountDto: UpdateAccountDto) {
	// 	return `This action updates a #${id} auth`;
	// }

	// remove(id: number) {
	// 	return `This action removes a #${id} auth`;
	// }
}
