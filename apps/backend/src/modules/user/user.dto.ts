import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import {
	IsAlphanumeric,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	Length,
} from "class-validator";
import { IsCPFOrCNPJ } from "../../common/decorators/IsCPFOrCNPJ.decorator";

export class UserDTO {
	@ApiProperty({
		description: "The first name of a people",
		example: "Miguel",
		type: "string",
	})
	@IsString()
	@IsNotEmpty()
	@Length(5, 50)
	public readonly firstName: string;

	@ApiProperty({
		description: "The last name of a people",
		example: "Alexandre Uhlein",
		type: "string",
	})
	@IsString()
	@IsNotEmpty()
	@Length(5, 100)
	public readonly lastName: string;

	@ApiProperty({
		description: "An email address",
		example: "nedcloar1@hotmail.com",
		type: "string",
	})
	@IsEmail()
	@IsNotEmpty()
	@Length(7, 255)
	public readonly email: string;

	@ApiProperty({
		description: "An ultra secret password",
		example: "ultrasecretpassword123",
		type: "string",
	})
	@IsString()
	@IsNotEmpty()
	@Length(4, 50)
	public readonly password: string;

	@ApiProperty({
		description: "The type of user begin created",
		examples: ["CPF", "CNPJ"],
		enum: $Enums.UserType,
		type: "string",
	})
	@IsEnum($Enums.UserType)
	@IsNotEmpty()
	public readonly userType: $Enums.UserType;

	@ApiProperty({
		description: "A valid CPF or CNPJ document without points",
		example: "79148189090",
		// examples: ["79148189090", "30347915000139"],
		type: "string",
	})
	@IsAlphanumeric()
	@IsNotEmpty()
	@IsCPFOrCNPJ()
	public readonly document: string;
}

export class UserPartialDTO extends PartialType(UserDTO) {}

export class UserDocumentDTO extends PickType(UserDTO, ["document"] as const) {}

export class UserEmailDTO extends PickType(UserDTO, ["email"] as const) {}

export class UserLoginDTO extends PickType(UserDTO, [
	"password",
	"document",
] as const) {}
