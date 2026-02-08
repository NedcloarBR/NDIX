import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class TransactionDTO {
	@IsNumber()
	@Min(0.01)
	@IsNotEmpty()
	public readonly value: number;

	@IsString()
	@IsNotEmpty()
	public readonly senderDocument: string;

	@IsString()
	@IsNotEmpty()
	public readonly receiverDocument: string;
}
