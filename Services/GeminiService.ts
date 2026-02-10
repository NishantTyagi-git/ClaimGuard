

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ClaimInputs, Message } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey});

export const analyzeClaimRisk = async (inputs: ClaimInputs, prediction: number): Promise<string> => {
  const isFraud = prediction > 0.5;
  const prompt = `
    Act as a Senior Insurance Forensic Investigator. 
    Analyze the following insurance claim data:
    - Customer Tenure: ${inputs.months_as_customer} months
    - Deductible: $${inputs.policy_deductable}
    - Umbrella Limit: $${inputs.umbrella_limit}
    - Annual Premium: $${inputs.policy_annual_premium}
    - Incident Hour: ${inputs.incident_hour_of_the_day}:00
    - Vehicle Claim Amount: $${inputs.vehicle_claim}
    - Incident Severity: ${inputs.incident_severity}

    Our local ML model predicts a ${Math.round(prediction * 100)}% probability of fraud (Decision: ${isFraud ? 'FRAUDULENT' : 'LEGITIMATE'}).

    Provide a professional, concise forensic summary (max 150 words) explaining why this claim might be flagged or cleared. Mention specific insurance industry red flags or green flags found in this data.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Forensic analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating AI analysis.";
  }
};

export const chatWithForensics = async (history: Message[], currentClaim: ClaimInputs): Promise<string> => {
  const systemInstruction = `
    You are Sentinel AI, a specialized insurance fraud analyst. 
    You are discussing a specific claim with these parameters:
    ${JSON.stringify(currentClaim, null, 2)}
    
    Answer questions clearly and professionally. If the user asks for details about the claim or why it might be fraudulent, use your knowledge of insurance investigative techniques.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { text: history[history.length - 1].text }
      ],
      config: {
        systemInstruction
      }
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "The forensic neural network is currently offline. Please try again.";
  }
};
