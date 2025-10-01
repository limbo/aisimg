
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateJokeFromImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "Analyze this image and tell me a short, witty, and family-friendly joke about it. Make it clever and directly related to the visual content.",
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    if (!response.text) {
        throw new Error("The API returned an empty response.");
    }
    
    return response.text;
  } catch (error) {
    console.error("Error generating joke from Gemini API:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
