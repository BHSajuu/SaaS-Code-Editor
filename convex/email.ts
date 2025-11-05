"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";

export const sendInvite = internalAction({
  args: {
    sessionUrl: v.string(), 
    toEmail: v.string(),
    fromName: v.string(),
  },
  handler: async (ctx, args) => {
    const {
      EMAIL_SERVER_USER,
      EMAIL_SERVER_PASS,
    } = process.env;

    if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASS) {
      console.error("Email environment variables are not set.");
      throw new Error("Email service is not configured.");
    }
    
   
    const fullSessionUrl = `${process.env.NEXT_PUBLIC_APP_URL}/editor/${args.sessionUrl}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"${args.fromName} via CodeNexta" <${EMAIL_SERVER_USER}>`,
        to: args.toEmail,
        subject: `You're invited to a coding session on CodeNexta`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>You're Invited!</h2>
            <p>
              <b>${args.fromName}</b> has invited you to join a live coding session.
            </p>
            <a 
              href="${fullSessionUrl}" 
              style="display: inline-block; padding: 12px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;"
            >
              Join Session
            </a>
            <p style="margin-top: 20px; font-size: 12px; color: #888;">
              Or copy this link into your browser:<br>
              ${fullSessionUrl}
            </p>
          </div>
        `,
      });
      console.log("Email sent successfully to:", args.toEmail);
      return { success: true };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send email.");
    }
  },
});