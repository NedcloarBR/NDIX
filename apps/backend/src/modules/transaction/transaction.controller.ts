import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Routes, Services } from "../../types/constants";
// biome-ignore lint/style/useImportType: <Cannot useImportType in DTOs>
import { type ITransactionService, TransactionDTO, TransactionEntity } from ".";

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
