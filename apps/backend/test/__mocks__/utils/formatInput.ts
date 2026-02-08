import { hash } from "bcrypt";
import { UserDTO } from "src/modules/user/user.dto";

export async function formatInput(data: UserDTO): Promise<UserDTO> {
	const { password, ...rest } = data;
	return {
		password: await hash(password, 10),
		...rest,
	};
}
