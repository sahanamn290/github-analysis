
import { GoogleGenAI } from "@google/genai";
import { GitHubUser, GitHubRepo } from '../types';

export const generateAIInsight = async (user: GitHubUser, repos: GitHubRepo[]): Promise<string> => {
  // Always use process.env.API_KEY directly for initialization as per @google/genai best practices
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const repoSummary = repos.map(r => `${r.name} (${r.language}): ${r.description || 'No description'}`).join('\n');
  const prompt = `
    Analyze this GitHub developer profile and provide a professional, creative "Developer Persona" summary.
    
    User: ${user.name || user.login}
    Bio: ${user.bio || 'N/A'}
    Public Repos: ${user.public_repos}
    Followers: ${user.followers}
    Top Repositories:
    ${repoSummary}

    Instructions:
    1. Categorize them (e.g., "Full-Stack Architect", "Frontend Specialist", "Open Source Enthusiast").
    2. Highlight their key strengths based on their repository languages and descriptions.
    3. Provide a short "Elevator Pitch" for their professional profile.
    4. Estimate their primary tech stack.
    
    Output in clean Markdown. Use bullet points and headers. Keep it concise but insightful.
  `;

  try {
    // Upgraded to gemini-3-pro-preview for complex text analysis and persona generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Use the .text property to retrieve results from the response object
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI insight. Please ensure your API key is valid.";
  }
};
