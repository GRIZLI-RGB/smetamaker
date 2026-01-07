import "@fastify/cookie";
import type { FastifyRequest, FastifyReply } from "fastify";

import { prisma } from "../utils/database";

export async function createContext({
	req,
	res,
}: {
	req: FastifyRequest;
	res: FastifyReply;
}) {
	return {
		req,
		res,
		prisma,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
