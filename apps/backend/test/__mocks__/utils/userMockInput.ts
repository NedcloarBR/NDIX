import { $Enums } from "@prisma/client";
import type { UserDTO } from "src/modules/user/user.dto";
import { formatInput } from "./formatInput";

export async function userMockInput(input?: string) {
	const rawInput: UserDTO = {
		firstName: "Miguel",
		lastName: "Alexandre Uhlein",
		email: "nedcloar1@hotmail.com",
		password: "ultrasecretpassword123",
		userType: $Enums.UserType.CPF,
		document: input || "79148189090",
	};

	const formattedInput = await formatInput(rawInput);
	const mockInput = {
		id: 1,
		publicId: "0a8ee1f5-1373-4767-9389-f76abf22bf4f",
		...formattedInput,
		money: 100,
	};
	const { id, password, ...data } = mockInput;
	const expected = {
		data,
	};

	return { expected, mockInput, rawInput };
}
