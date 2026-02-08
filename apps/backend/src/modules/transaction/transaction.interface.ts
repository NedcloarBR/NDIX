import type { TransactionDTO, TransactionEntity } from ".";

export interface ITransactionService {
	create(data: TransactionDTO): Promise<TransactionEntity>;
}

export interface ITransactionRepository {
	create(data: TransactionDTO): Promise<TransactionEntity>;
}
