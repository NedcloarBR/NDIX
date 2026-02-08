import { compare, genSalt, hash } from "bcrypt";

// biome-ignore lint/complexity/noStaticOnlyClass: <Utils class>
export class PasswordUtils {
	public static async hash(password: string): Promise<string> {
		return await hash(password, await genSalt());
	}

	public static async compare(
		password: string,
		hash: string,
	): Promise<boolean> {
		return await compare(password, hash);
	}
}
