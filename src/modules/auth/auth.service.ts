import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountEntity } from '../../database/entities/account.entity';
import { Repository, Connection } from 'typeorm';
import { IV } from './consts/iv.const';
import { promisify } from 'util';
import { createCipheriv, scrypt } from 'crypto';
import { SALT } from './consts/salt.const';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AccountsRepository } from 'src/repositories';

@Injectable()
export class AuthService {
	constructor(
		private accountsRepository: AccountsRepository,
		private readonly jwtSercice: JwtService,
	) { }

	async createAccount(
		createAccountDto: CreateAccountDto,
	) {
		try {
			const account = new AccountEntity();
			account.nickname = createAccountDto.nickname;
			account.password = await this.encryptPassword(
				createAccountDto.password,
			);

			return this.accountsRepository.save(account);
		}
		catch (err) {
			return new BadRequestException()
		}
	}

	async findOne(nickname: string) {
		try {
			const user = await this.accountsRepository.findOne({
				nickname: nickname,
			});

			return user;
		}
		catch (err) {
			return new BadRequestException()
		}
	}

	async findById(id: number) {
		return await this.accountsRepository.findOne(id);
	}

	async login(loginDto: LoginDto) {
		try {
			const encryptedPassword = await this.encryptPassword(loginDto.password);
			const user = await this.accountsRepository.findOne({
				nickname: loginDto.nickname,
				password: encryptedPassword,
			});

			if (user) {
				const payload = { nickname: user.nickname, id: user.id };
				const accessToken = this.jwtSercice.sign(payload);
				return { ...payload, accessToken };
			} else {
				return null;
			}
		}
		catch (err) {
			return new BadRequestException()
		}
	}

	async validateUser(nickname: string, id: number) {
		try {
			const user = await this.findOne(nickname);
			if (user instanceof AccountEntity) {
				return user.id === id ? { nickname: user.nickname, id: user.id } : null;
			}
		}
		catch (err) {
			return new BadRequestException()
		}

	}

	async findAll(): Promise<AccountEntity[]> {
		return this.accountsRepository.find();
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
}
