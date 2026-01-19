import { TRPCError } from "@trpc/server";
import { FastifyPluginAsync, FastifyReply } from "fastify";
import { prisma } from "../utils/database";

export async function authorizeUser({
	reply,
	email,
}: {
	reply: FastifyReply;
	email: string;
}): Promise<void> {
	let user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		user = await prisma.user.create({
			data: {
				email,
			},
		});
	}

	const session = await prisma.session.create({
		data: {
			userId: user.id,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		},
	});

	reply.setCookie("sessionId", session.id, {
		...(process.env.MODE === "development"
			? {}
			: {
					domain: `smetamaker.com`,
			  }),
		httpOnly: true,
		secure: process.env.MODE === "production",
		path: "/",
		maxAge: 60 * 60 * 24 * 30,
		sameSite: process.env.MODE === "development" ? "lax" : "none",
	});
}

async function googleLogin(code: string, reply: FastifyReply) {
	const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
			grant_type: "authorization_code",
		}),
	});

	const token = await tokenRes.json();
	if (!token.access_token)
		throw new TRPCError({
			code: "BAD_REQUEST",
		});

	const profileRes = await fetch(
		"https://www.googleapis.com/oauth2/v2/userinfo",
		{
			headers: { Authorization: `Bearer ${token.access_token}` },
		}
	);

	const profile = await profileRes.json();

	await authorizeUser({
		reply,
		email: profile.email,
	});
}

const authRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get<{
		Querystring: {
			code?: string;
			state?: string;
		};
	}>("/auth/google-callback", async function (req, reply) {
		const { code } = req.query;

		if (!code) {
			return reply.redirect(process.env.SITE_URL || "/");
		}

		await googleLogin(code, reply);

		reply.redirect(process.env.SITE_URL || "/");
	});
};

export default authRoutes;
