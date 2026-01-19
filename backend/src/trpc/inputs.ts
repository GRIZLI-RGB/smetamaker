import z from "zod";

export const authSendMagicLinkInput = z.object({
	email: z.email(),
});

export const authVerifyMagicLinkInput = z.object({ token: z.string() });
