import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Repositories, Services } from "../../types/constants";
import type { IUserService } from "../user";
import type {
	ITransactionRepository,
	ITransactionService,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in DTOs>
	TransactionDTO,
	TransactionEntity,
} from ".";

@Injectable()
export class TransactionService implements ITransactionService {
	constructor(
		@Inject(Repositories.Transaction)
		private readonly transactionRepository: ITransactionRepository,
		@Inject(Services.User) private readonly userService: IUserService,
	) {}

	public async create(data: TransactionDTO): Promise<TransactionEntity> {
		const sender = await this.userService.findByDocument(data.senderDocument);
		const receiver = await this.userService.findByDocument(
			data.receiverDocument,
		);

		if (sender.money < data.value) {
			throw new UnauthorizedException("Sender não tem dinheiro o suficiente");
		}

		if (sender.userType === "CNPJ") {
			throw new UnauthorizedException("CNPJ não pode enviar");
		}

		if (receiver.document === sender.document) {
			throw new UnauthorizedException("Não é possível enviar para si mesmo");
		}

		const transaction = await this.transactionRepository.create(data);
		await this.userService.update(sender.document, sender.money - data.value);
		await this.userService.update(
			receiver.document,
			receiver.money + data.value,
		);

		return transaction;
	}
}
