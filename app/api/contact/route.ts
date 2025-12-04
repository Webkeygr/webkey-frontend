import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      lang,
      interests,
      firstName,
      lastName,
      email,
      message,
      newsletter,
      privacyConsent,
    } = body as {
      lang: "en" | "el";
      interests: string[];
      firstName: string;
      lastName: string;
      email: string;
      message: string;
      newsletter: boolean;
      privacyConsent: boolean;
    };

    if (!firstName || !lastName || !email || !message || !privacyConsent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject =
      lang === "en"
        ? "New contact from Webkey website"
        : "Νέα φόρμα επικοινωνίας από το Webkey website";

    const interestLabel =
      interests && interests.length > 0 ? interests.join(", ") : "—";

    const html = `
      <h2>${subject}</h2>
      <p><strong>Language:</strong> ${lang}</p>
      <p><strong>Interests:</strong> ${interestLabel}</p>
      <p><strong>First name:</strong> ${firstName}</p>
      <p><strong>Last name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Newsletter:</strong> ${newsletter ? "Yes" : "No"}</p>
      <p><strong>Privacy consent:</strong> ${privacyConsent ? "Yes" : "No"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    `;

    await transporter.sendMail({
      from: process.env.CONTACT_FROM ?? process.env.SMTP_USER,
      to: process.env.CONTACT_TO ?? process.env.SMTP_USER,
      replyTo: email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
