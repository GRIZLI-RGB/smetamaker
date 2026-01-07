import Fastify from "fastify";
import path from "path";
import fastifyAutoload from "@fastify/autoload";
import fastifyCookie from "@fastify/cookie";
import type { FastifyRequest, FastifyReply } from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastifyCors from "@fastify/cors";

import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/routes";
import "dotenv/config";

async function startServer() {
	const fastify = Fastify();

	await fastify.register(fastifyCors, {
		origin:
			process.env.MODE === "development"
				? [/^http:\/\/localhost(:\d+)?$/]
				: [/^https?:\/\/([a-zA-Z0-9-]+\.)?smetamaker\.com$/],
		credentials: true,
	});

	await fastify.register(fastifyCookie);

	await fastify.register(fastifyAutoload, {
		dir: path.join(__dirname, "routes"),
		options: { prefix: "/api" },
	});

	await fastify.register(fastifyTRPCPlugin, {
		prefix: "/api/trpc",
		trpcOptions: {
			router: appRouter,
			createContext: ({
				req,
				res,
			}: {
				req: FastifyRequest;
				res: FastifyReply;
			}) => createContext({ req, res }),
		},
	});

	await fastify.listen({ port: +(process.env.SERVER_PORT || 8000) });
}

startServer();
