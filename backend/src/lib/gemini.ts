import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StatusCodes } from "http-status-codes";
import config from "../config";
import AppError from "../utils/AppError";

let cachedGeminiModel: ChatGoogleGenerativeAI | null = null;
let cachedGeminiApiKey: string | null = null;
let cachedModelName: string | null = null;

/**
 * Returns a cached singleton instance of ChatGoogleGenerativeAI
 * preserving HTTP keep-alive connections across requests.
 */
export const getGeminiClient = (
  apiKey?: string,
  modelName?: string,
): ChatGoogleGenerativeAI => {
  const key = apiKey || config.GOOGLE_GEMINI_API_KEY;
  const model = modelName || config.GEMINI_MODEL || "gemini-flash-lite-latest";

  if (!key || key.trim().length === 0) {
    throw new AppError(
      StatusCodes.SERVICE_UNAVAILABLE,
      "Google Gemini API key is not configured on the server. Please check your environment variables.",
    );
  }

  if (
    !cachedGeminiModel ||
    cachedGeminiApiKey !== key ||
    cachedModelName !== model
  ) {
    cachedGeminiModel = new ChatGoogleGenerativeAI({
      model,
      apiKey: key,
      temperature: 0.3,
      maxRetries: 2,
    });
    cachedGeminiApiKey = key;
    cachedModelName = model;
  }

  return cachedGeminiModel;
};
