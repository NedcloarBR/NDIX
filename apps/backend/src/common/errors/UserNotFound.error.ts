import { NotFoundException } from "@nestjs/common";

export class UserNotFoundError extends NotFoundException {
	public constructor(message?: string) {
		super(message || "No User found with this credentials");
	}
}
