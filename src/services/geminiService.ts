import { GoogleGenAI, Type } from "@google/genai";
import { Product, Sale, AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAIInsights(products: Product[], sales: Sale[]): Promise<AIInsight[]> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found. AI insights will be limited.");
    return [];
  }

  const salesData = sales.map(s => ({
    product: s.product_name,
    qty: s.quantity,
    date: s.sale_date
  }));

  const inventoryData = products.map(p => ({
    id: p.id,
    name: p.name,
    stock: p.current_stock,
    min: p.min_stock
  }));

  const prompt = `Analyze the following sales history and current inventory to predict demand for the next 30 days and suggest restock quantities.
  
  Sales History (last 30 days): ${JSON.stringify(salesData)}
  Current Inventory: ${JSON.stringify(inventoryData)}
  
  Return a JSON array of insights.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              productId: { type: Type.INTEGER },
              productName: { type: Type.STRING },
              predictedDemand: { type: Type.NUMBER, description: "Expected sales in next 30 days" },
              suggestedRestock: { type: Type.NUMBER, description: "Recommended order quantity" },
              reason: { type: Type.STRING, description: "Brief explanation for the suggestion" }
            },
            required: ["productId", "productName", "predictedDemand", "suggestedRestock", "reason"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Insight Error:", error);
    return [];
  }
}
