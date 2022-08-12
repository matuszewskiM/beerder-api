import { AccountEntity } from "src/database/entities/account.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(AccountEntity)
export class AccountsRepository extends Repository<AccountEntity> { }