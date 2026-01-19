import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import path from "path";
import fs from "fs";

import { protectedProcedure, publicProcedure, router } from "./procedures";
import { authSendMagicLinkInput, authVerifyMagicLinkInput } from "./inputs";
import { authorizeUser } from "../routes/auth";
import { sendMail } from "../services/mail/nodemailer";
import { getTranslations } from "../translations";
import OpenAI from "openai";
import { config } from "../config";

export const appRouter = router({
	user: {
		me: protectedProcedure.query(async ({ ctx }) => {
			const sessionId = ctx.req.cookies?.sessionId;

			if (!sessionId) {
				throw new TRPCError({ code: "UNAUTHORIZED" });
			}

			const session = await ctx.prisma.session.findUnique({
				where: { id: sessionId },
				include: { user: true },
			});

			if (!session) {
				throw new TRPCError({ code: "UNAUTHORIZED" });
			}

			return session.user;
		}),
	},

	auth: {
		sendMagicLink: publicProcedure
			.input(authSendMagicLinkInput)
			.mutation(async ({ ctx, input }) => {
				if (!process.env.SITE_URL) {
					throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
				}

				const { email } = input;
				const token = crypto.randomBytes(32).toString("hex");
				const tokenHash = crypto
					.createHash("sha256")
					.update(token)
					.digest("hex");

				const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

				await ctx.prisma.magicLinkToken.create({
					data: {
						tokenHash,
						email,
						expiresAt,
					},
				});

				const t = getTranslations(ctx.locale);

				const magicLink = `${process.env.SITE_URL}/auth/verify?token=${token}`;
				const baseUrl = process.env.SITE_URL;

				const htmlPath = path.join(
					__dirname,
					`../../mail/templates/enter-magic-link-${ctx.locale}.html`
				);

				let html = fs.readFileSync(htmlPath, "utf-8");
				html = html
					.replace(/{{magicLink}}/g, magicLink)
					.replace(/{{baseUrl}}/g, baseUrl);

				await sendMail({
					to: email,
					subject: t.auth.magicLinkSubject,
					html,
				});

				return { success: true };
			}),

		verifyMagicLink: publicProcedure
			.input(authVerifyMagicLinkInput)
			.mutation(async ({ ctx, input }) => {
				const tokenHash = crypto
					.createHash("sha256")
					.update(input.token)
					.digest("hex");

				const dbToken = await ctx.prisma.magicLinkToken.findUnique({
					where: { tokenHash },
				});

				if (!dbToken || dbToken.used || dbToken.expiresAt < new Date())
					throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

				await authorizeUser({
					reply: ctx.res,
					email: dbToken.email,
				});

				await ctx.prisma.magicLinkToken.update({
					where: { tokenHash },
					data: { used: true },
				});

				return { success: true };
			}),

		getGoogleAuthUrl: publicProcedure.mutation(() => {
			const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

			if (
				!process.env.GOOGLE_CLIENT_ID ||
				!process.env.GOOGLE_REDIRECT_URL
			) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
				});
			}

			url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
			url.searchParams.set(
				"redirect_uri",
				process.env.GOOGLE_REDIRECT_URL
			);
			url.searchParams.set("response_type", "code");
			url.searchParams.set("scope", "openid email profile");
			url.searchParams.set("access_type", "offline");

			return { url: url.toString() };
		}),

		logout: publicProcedure.mutation(async ({ ctx }) => {
			const sessionId = ctx.req.cookies.sessionId;

			if (!sessionId) throw new TRPCError({ code: "UNAUTHORIZED" });

			await ctx.prisma.session.deleteMany({
				where: { id: sessionId },
			});

			ctx.res.clearCookie("sessionId", {
				...(process.env.MODE === "development"
					? {}
					: {
							domain: `smetamaker.com`,
					  }),
				path: "/",
				httpOnly: true,
				secure: process.env.MODE !== "development",
				sameSite: process.env.MODE === "development" ? "lax" : "none",
			});

			return { success: true };
		}),
	},

	ai: {
		estimate: protectedProcedure.query(async () => {
			const ai = new OpenAI({
				baseURL: config.deepseek.baseURL,
				apiKey: process.env.DEEPSEEK_API_KEY,
			});

			const result = ai.chat.completions.create({
				model: "deepseek-chat",
				messages: [
					{
						role: "system",
						content:
							"TODO: промпт системы наш с JSON-необходимостью вывода",
					},
					{
						role: "user",
						content: "TODO: текст ТЗ",
					},
				],
			});

			return { result };
		}),
	},
});
