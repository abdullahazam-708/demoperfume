const OpenAI = require('openai');
const Settings = require('../models/Settings');

// @desc    Generate product content using AI
// @route   POST /api/ai/generate
// @access  Private/Admin
const generateContent = async (req, res) => {
    try {
        const { productName, brand, category, keywords } = req.body;

        // 1. Get API Key from Settings
        const settings = await Settings.findOne();
        if (!settings || !settings.openAiApiKey) {
            return res.status(400).json({ message: 'OpenAI API Key not configured in settings.' });
        }

        const openai = new OpenAI({
            apiKey: settings.openAiApiKey,
        });

        // 2. Construct Prompt
        const prompt = `
        You are an expert copywriter for a luxury perfume brand called "${settings.shopName}".
        Write a compelling, SEO-friendly product description and SEO metadata for the following product:
        
        Product Name: ${productName}
        Brand: ${brand}
        Category: ${category}
        Keywords: ${keywords || 'luxury, fragrance, long-lasting'}

        Return the response in strictly valid JSON format with the following structure:
        {
            "description": "HTML formatted description (use <p>, <br>). Focus on sensory details, notes, and luxury appeal. Approx 150-200 words.",
            "seoTitle": "SEO optimized title (max 60 chars)",
            "seoDescription": "SEO meta description (max 160 chars)",
            "seoKeywords": "comma separated keywords"
        }
        `;

        // 3. Call OpenAI
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant that outputs JSON." }, { role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        const content = JSON.parse(completion.choices[0].message.content);

        res.json(content);

    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate content. Check API Key or try again.' });
    }
};

module.exports = { generateContent };
