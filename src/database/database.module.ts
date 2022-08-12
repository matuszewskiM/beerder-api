import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as repositories from '../repositories'
import { AccountEntity } from "./entities/account.entity";
import { Category } from "./entities/category.entity";
import { Comment } from "./entities/comment.entity";
import { Post } from "./entities/post.entity"

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature(Object.values(repositories)),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: '127.0.0.1',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'test',
            entities: [AccountEntity, Comment, Post, Category],
            synchronize: true,
        }),
    ],
    exports: [TypeOrmModule]
})
export class DatabaseModule { }