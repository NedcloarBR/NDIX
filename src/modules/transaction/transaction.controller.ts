import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Routes, Services } from "src/types/constants";
import { type ITransactionService, TransactionEntity } from ".";
import { TransactionDTO } from "./transaction.dto";

@Controller(Routes.Transaction)
export class TransactionController {
	constructor(
		@Inject(Services.Transaction)
		private readonly transactionService: ITransactionService,
	) {}

	@Get()
	public get(): { message: string } {
		return { message: "TransactionModule Controller" };
	}

	@Post()
	public async create(
		@Body() data: TransactionDTO,
	): Promise<{ data: TransactionEntity }> {
		const transaction = await this.transactionService.create(data);
		console.log(transaction);
		return {
			data: plainToClass(TransactionEntity, transaction),
		};
	}
}
