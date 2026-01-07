import { publicProcedure, router } from "./procedures";

export const appRouter = router({
	test: publicProcedure.query(() => {
		return { message: "ALL GOOD, no good!" };
	}),
});
