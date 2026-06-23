import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes
  app.post("/api/analyze-dna", async (req, res) => {
    try {
      const { image, prompt } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Отсутствует изображение" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

      const defaultPrompt = "Проанализируй предоставленное изображение. Извлеки STYLE_DNA (ключевые визуальные элементы, цветовую палитру), нарратив (смысл и сообщение) и параметры для маркетинга (целевая аудитория, эмоции). Верни ответ в структурированном Markdown формате на русском языке под заголовками: 🧬 STYLE DNA, 👁 НАРРАТИВ, 📊 МАРКЕТИНГОВЫЕ ПАРАМЕТРЫ.";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            parts: [
              { text: prompt || defaultPrompt },
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
            ]
          }
        ]
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("DNA Analysis error:", error);
      let errorMessage = String(error);
      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = "Ошибка 429 (Resource Exhausted): Исчерпаны кредиты Gemini API. Пожалуйста, перейдите на https://ai.studio/projects для управления биллингом.";
      }
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post("/api/manifesto", async (req, res) => {
    try {
      const { context } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `Автоматически сгенерируй стратегический манифест (Manifesto) проекта на основе предоставленной информации:\n\n${context}\n\nВключи позиционирование, tone of voice и ключевые каналы трансляции. Оформи красиво с использованием Markdown, используй High-Tech и Cyberpunk стилистику в подаче (текст должен звучать уверенно, профессионально и инновационно).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
       console.error("Manifesto error:", error);
       let errorMessage = String(error);
       if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
         errorMessage = "Ошибка 429 (Resource Exhausted): Исчерпаны кредиты Gemini API. Пожалуйста, перейдите на https://ai.studio/projects для управления биллингом.";
       }
       res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
