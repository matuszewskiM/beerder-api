import { Post } from "src/database/entities/post.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Post)
export class PostsRepository extends Repository<Post> { }