import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountEntity } from './auth/entities/account.entity';

@Module({
	imports: [
		AuthModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'ec2-54-75-184-144.eu-west-1.compute.amazonaws.com',
			port: 5432,
			username: 'bxsnhzzezoemqs',
			password:
				'b4b4be6bf0a4a0330b85c805569d21a200baee3a570dccbe43986cbc83c373f3',
			database: 'd8qbmb312d5hl6',
			entities: [AccountEntity],
			synchronize: true,
			ssl: true,
			extra: {
				ssl: {
					rejectUnauthorized: false,
				},
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
