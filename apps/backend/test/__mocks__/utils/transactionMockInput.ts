import { $Enums } from "@prisma/client";
import type { UserEntity } from "src/modules/user";

export async function transactionMockInput() {
	const cpfUser1: UserEntity = {
		publicId: "0a8ee1f5-1373-4767-9389-f76abf22bf4f",
		money: 100,
		firstName: "Miguel",
		lastName: "Alexandre Uhlein1",
		email: "nedcloar1_cpf1@hotmail.com",
		userType: $Enums.UserType.CPF,
		document: "79148189090",
	};

	const cpfUser2: UserEntity = {
		publicId: "5bf57a8b-1db0-4999-868d-4d34b04f3f23",
		money: 100,
		firstName: "Miguel",
		lastName: "Alexandre Uhlein2",
		email: "nedcloar1_cpf2@hotmail.com",
		userType: $Enums.UserType.CPF,
		document: "98772856068",
	};

	const cnpjUser1: UserEntity = {
		publicId: "d39af869-4b78-4c36-8081-123846f41b9d",
		money: 100,
		firstName: "Miguel",
		lastName: "Alexandre Uhlein3",
		email: "nedcloar1_cnpj1@hotmail.com",
		userType: $Enums.UserType.CNPJ,
		document: "30347915000139",
	};

	const cnpjUser2: UserEntity = {
		publicId: "d39af869-4b78-4c36-8081-123846f41b9d",
		money: 100,
		firstName: "Miguel",
		lastName: "Alexandre Uhlein4",
		email: "nedcloar1_cnpj2@hotmail.com",
		userType: $Enums.UserType.CNPJ,
		document: "52736388000197",
	};

	return { cpfUser1, cpfUser2, cnpjUser1, cnpjUser2 };
}
