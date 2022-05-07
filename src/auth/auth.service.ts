import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-auth.dto';
import { AccountEntity } from './entities/account.entity';
import { Repository, Connection } from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(AccountEntity)
		private accountsRepository: Repository<AccountEntity>,
		private connection: Connection,
	) {}

	async createAccount(createAccountDto: CreateAccountDto) {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			await queryRunner.manager.save(createAccountDto);
			await queryRunner.commitTransaction();
		} catch (err) {
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}

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
