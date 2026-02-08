import { configureApp } from "./app";
import { configureFastify } from "./fastify";
import { configureGlobals } from "./global";
import { configureSwagger } from "./swagger";

export const Configure = {
	App: configureApp,
	Fastify: configureFastify,
	Globals: configureGlobals,
	Swagger: configureSwagger,
};
