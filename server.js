import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
    res.status(200).json({ message: "Ok" });
});

app.post("/generate", async (req, res) => {
    try {
        const { name, description, tone, includeTestimonials, includePricing } = req.body;

        const prompt = `
            Create a full landing page using HTML and Tailwind CSS.

            Product: ${name}
            Description: ${description}
            Style / Tone: ${tone}

            Sections to include:
            1. Hero
            2. Features
            ${includeTestimonials ? '3. Testimonials' : ''}
            ${includePricing ? '4. Pricing' : ''}
            5. Footer

            Requirements:
            - Use Tailwind CDN
            - Fully responsive
            - Return ONLY pure HTML
            - Do NOT include markdown or code fences
            `;

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: prompt }],
        });

        let html = response.choices[0].message.content;

        // إزالة ```html و ```
        html = html.replace(/```html/g, "").replace(/```/g, "").trim();

        res.json({ html });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
