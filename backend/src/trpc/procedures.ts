import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { Context } from "./context";
import { appRouter } from "./routes";

export const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	const sessionId = ctx.req.cookies?.sessionId;

	if (!sessionId)
		throw new TRPCError({
			code: "UNAUTHORIZED",
		});

	const session = await ctx.prisma.session.findUnique({
		where: { id: sessionId },
	});

	if (!session)
		throw new TRPCError({
			code: "UNAUTHORIZED",
		});

	return next({
		ctx: {
			...ctx,
			session,
		},
	});
});

export type AppRouter = typeof appRouter;
