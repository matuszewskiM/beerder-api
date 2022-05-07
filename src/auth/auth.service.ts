import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-auth.dto';
import { AccountEntity } from './entities/account.entity';
import { Repository, Connection } from 'typeorm';
import { IV } from './consts/iv.const';
import { promisify } from 'util';
import { createCipheriv, scrypt } from 'crypto';
import { SALT } from './consts/salt.const';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(AccountEntity)
		private accountsRepository: Repository<AccountEntity>,
	) {}

	async createAccount(
		createAccountDto: CreateAccountDto,
	): Promise<AccountEntity> {
		const account = new AccountEntity();
		account.alcohols = createAccountDto.alcohols;
		account.description = createAccountDto.description;
		account.hobbies = createAccountDto.hobbies;
		account.login = createAccountDto.login;
		account.name = createAccountDto.name;
		account.password = await this.encryptPassword(
			createAccountDto.password,
		);

		return this.accountsRepository.save(account);
	}

	findOne(login: string) {
		return this.accountsRepository.findOne({ login: login });
	}

	async findAll(): Promise<AccountEntity[]> {
		return this.accountsRepository.find();
	}

	private async encryptPassword(password: string): Promise<string> {
		const iv = IV;
		const salt = SALT;
		const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;
		const cipher = createCipheriv('aes-256-ctr', key, iv);

		const encrypted = Buffer.concat([
			cipher.update(password),
			cipher.final(),
		]).toString('hex');

		return encrypted;
	}

	// private decryptPassword(password: string): string {}

	// update(id: number, updateAccountDto: UpdateAccountDto) {
	// 	return `This action updates a #${id} auth`;
	// }

	// remove(id: number) {
	// 	return `This action removes a #${id} auth`;
	// }
}
