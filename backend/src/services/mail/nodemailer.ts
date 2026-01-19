import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: 465,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

export async function sendMail(options: {
	to: string;
	subject: string;
	html: string;
	text?: string;
}) {
	await transporter.sendMail({
		from: `"Smetamaker" <${process.env.MAIL_USER}>`,
		...options,
	});
}
