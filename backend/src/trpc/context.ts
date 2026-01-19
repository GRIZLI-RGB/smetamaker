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
	const locale = req.cookies?.locale || "en";

	return {
		req,
		res,
		locale,
		prisma,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
