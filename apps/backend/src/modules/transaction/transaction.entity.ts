import type { Transaction } from "@prisma/client";
import { Exclude } from "class-transformer";

export class TransactionEntity implements Transaction {
	public readonly id: string;

	public readonly value: number;

	@Exclude()
	public readonly timestamp: Date;

	public readonly senderId: string;

	public readonly receiverId: string;
}
