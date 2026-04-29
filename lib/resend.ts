import { Resend } from "resend";
import { requireEnv } from "./env";

export const resend = new Resend(requireEnv("RESEND_API_KEY"));
