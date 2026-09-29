import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  HttpException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class AiClientService {
  private readonly logger = new Logger(AiClientService.name);
  private readonly genAI?: GoogleGenerativeAI;

  constructor(private readonly config: ConfigService) {
    const key = config.get<string>("GEMINI_API_KEY");
    if (key) this.genAI = new GoogleGenerativeAI(key);
  }

  async generateText(prompt: string): Promise<string> {
    if (!this.genAI)
      throw new ServiceUnavailableException(
        "AI features are unavailable. Ask the administrator to configure Gemini.",
      );
    try {
      const model = this.genAI.getGenerativeModel(
        {
          model: this.config.get<string>("GEMINI_MODEL", "gemini-2.5-flash"),
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        },
        { timeout: 90000 },
      );
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) throw new Error("Empty response");
      return text;
    } catch (error) {
      const status =
        typeof error === "object" && error !== null && "status" in error
          ? Number(error.status)
          : 0;
      this.logger.warn("Gemini request failed (status " + status + ")");
      if (status === 429)
        throw new HttpException(
          "AI quota or rate limit reached. Try later or ask the administrator to review the Gemini quota and billing.",
          429,
        );
      if (status === 400 || status === 403 || status === 404) {
        throw new ServiceUnavailableException(
          "AI is unavailable. Ask the administrator to check the API key, model access and supported region.",
        );
      }
      throw new ServiceUnavailableException(
        "AI could not complete the request. Please try again later.",
      );
    }
  }
}
