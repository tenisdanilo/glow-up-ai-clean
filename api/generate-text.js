generate-text.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { prompt } = req.body;
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'ERROR CRÍTICO: La variable OPENAI_API_KEY no está configurada en las Environment Variables de Vercel.' });
        }

        if (!prompt) {
            return res.status(400).json({ error: 'El prompt está vacío.' });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey.trim()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: `Error de OpenAI (${response.status}): ${data.error?.message || JSON.stringify(data)}` });
        }

        const textResponse = data.choices[0].message.content;
        return res.status(200).json({ text: textResponse });

    } catch (error) {
        return res.status(500).json({ error: `Excepción en servidor: ${error.message}` });
    }
}