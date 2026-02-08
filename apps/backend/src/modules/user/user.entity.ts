import type { $Enums, User } from "@prisma/client";
import { Exclude } from "class-transformer";
import type { TransactionEntity } from "../transaction";

export class UserEntity implements User {
	@Exclude()
	public readonly id: number;

	public readonly publicId: string;

	public readonly firstName: string;

	public readonly lastName: string;

	public readonly document: string;

	public readonly email: string;

	@Exclude()
	public readonly password: string;

	public readonly userType: $Enums.UserType;

	public readonly money: number;

	public readonly receivedTransactions: TransactionEntity[];

	public readonly sentTransactions: TransactionEntity[];

	public constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
