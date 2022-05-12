import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-auth.dto';
import { AccountEntity } from './entities/account.entity';
import { Repository, Connection, Not } from 'typeorm';
import { IV } from './consts/iv.const';
import { promisify } from 'util';
import { createCipheriv, scrypt } from 'crypto';
import { SALT } from './consts/salt.const';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { skip } from 'rxjs';
import { City } from './enums/city.enum';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(AccountEntity)
		private accountsRepository: Repository<AccountEntity>,
		private readonly jwtSercice: JwtService,
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
		account.city = createAccountDto.city;
		account.blacklist = [1, 2, 3];

		return this.accountsRepository.save(account);
	}

	async findOne(login: string) {
		const user = await this.accountsRepository.findOne({
			login: login,
		});

		return user;
	}

	async login(loginDto: LoginDto) {
		const encryptedPassword = await this.encryptPassword(loginDto.password);
		const user = await this.accountsRepository.findOne({
			login: loginDto.login,
			password: encryptedPassword,
		});

		if (user) {
			const payload = { login: user.login, id: user.id };
			const access_token = this.jwtSercice.sign(payload);
			return { access_token };
		} else {
			return null;
		}
	}

	async validateUser(login: string, id: number) {
		const user = await this.findOne(login);
		return user.id === id ? { login: user.login, id: user.id } : null;
	}

	async findAll(): Promise<AccountEntity[]> {
		return this.accountsRepository.find();
	}

	async findRandom(searcherId: number) {
		const searcher = await this.accountsRepository.findOne(searcherId);
		if (!searcher) return null;
		const matchingUser = await this.accountsRepository.findOne({
			where: {
				id: Not(searcher.id),
				city: searcher.city,
				whitelist: [searcher.id],
			},
		});

		if (matchingUser) {
			return matchingUser;
		}

		const randomUser = await this.accountsRepository.findOne({
			where: {
				id: Not(searcher.id),
				city: searcher.id,
				blacklist: Not([searcher.id]),
			},
		});

		if (randomUser) {
			return randomUser;
		}

		return null;
	}

	public async encryptPassword(password: string): Promise<string> {
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

	public async rejectUser(rejectorId: number, rejectedId: number) {
		if (rejectorId === rejectedId) return false;
		const rejector = await this.accountsRepository.findOne(rejectorId);
		const rejectedUser = await this.accountsRepository.findOne(rejectedId);

		if (rejectedUser) {
			rejector.whitelist = rejector.whitelist.filter(
				(id) => id !== rejectedId,
			);
			console.log(rejector.blacklist);
			console.log(rejectedId),
				console.log([...rejector.blacklist, rejectedId]);
			rejector.blacklist = [...rejector.blacklist, rejectedId];

			return this.accountsRepository
				.update(rejector.id, rejector)
				.then(() => true)
				.catch((err) => {
					// console.log(err);
					return false;
				});
		}
	}

	// private decryptPassword(password: string): string {}

	// update(id: number, updateAccountDto: UpdateAccountDto) {
	// 	return `This action updates a #${id} auth`;
	// }

	// remove(id: number) {
	// 	return `This action removes a #${id} auth`;
	// }
}
