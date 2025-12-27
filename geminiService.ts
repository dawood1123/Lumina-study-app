
import { GoogleGenAI, Type } from "@google/genai";
import { StudyLevel, StudyMode, QuizQuestion } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStudyContent = async (
  topic: string,
  level: StudyLevel,
  mode: StudyMode,
  context?: string,
  sourceContent?: string
): Promise<{ text: string; quiz?: QuizQuestion[] }> => {
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstructions = `You are a world-class study assistant. Your goal is to help students understand topics efficiently.
    Tone: Educational, encouraging, and clear.
    Current Level: ${level}.
    Target Audience: Students and teachers.
    Formatting rules: Use markdown for structure. Use '###' for section headings and '**' for bold terms.`;

  const contextPart = context ? `\nSpecial instructions: ${context}` : '';

  if (mode === StudyMode.QUIZ) {
    // If sourceContent is provided, generate a quiz strictly based on that text
    const quizPrompt = sourceContent 
      ? `Generate a 5-question multiple choice quiz strictly based on the following text: "${sourceContent}". Ensure the questions test the key points mentioned in this specific text for a ${level} level student.`
      : `Generate a 5-question multiple choice quiz about "${topic}" for a ${level} level student.${contextPart} Include explanations for the correct answers.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: quizPrompt,
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of 4 possible answers"
              },
              correctIndex: { type: Type.INTEGER, description: "Index (0-3) of the correct answer" },
              explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    try {
      const quiz = JSON.parse(response.text);
      return { text: "Quiz Generated", quiz };
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
      throw new Error("Failed to generate quiz format.");
    }
  }

  const prompt = mode === StudyMode.EXPLAIN 
    ? `Explain the topic "${topic}" in simple, clear language suitable for a ${level} learner. ${contextPart} Use analogies if helpful. Avoid jargon unless you explain it.`
    : `Provide a short summary of "${topic}" in bullet points. ${contextPart} Focus on the 5 most important concepts a ${level} learner should know.`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: { systemInstruction: systemInstructions }
  });

  return { text: response.text || "No content generated." };
};
