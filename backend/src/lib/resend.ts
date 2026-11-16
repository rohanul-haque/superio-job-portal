import { Resend } from "resend";
import config from "../config";

const resend = config.RESEND_API_KEY ? new Resend(config.RESEND_API_KEY) : null;

export default resend;
