import fetch from "node-fetch";

const HF_API_KEY = process.env.HF_API_KEY;

const predefinedIdeas = {
  "Father's Day": "1. Home-cooked breakfast for Dad\n2. Handmade card\n3. Short family picnic",
  "Birthday": "1. Personalized photo album\n2. Favorite meal at home\n3. Fun experience or outing",
  "Mother's Day": "1. Homemade spa day\n2. Handwritten letter\n3. Cook her favorite dinner",
  "Anniversary": "1. Romantic dinner at home\n2. Photo collage of memories\n3. Recreate your first date",
  "Valentine's Day": "1. DIY chocolate gift box\n2. Handmade card with love notes\n3. Romantic home movie night",
  "Christmas": "1. Handmade ornaments\n2. Baked goods basket\n3. Family game night package",
  "Graduation": "1. Personalized journal\n2. Memory book from friends\n3. Career starter kit",
  "Wedding": "1. Custom photo frame\n2. Recipe book from family\n3. Date night coupon book"
};

export default async function handler(req, res) {
  const { eventType, budget, preferences } = req.body;

  if (predefinedIdeas[eventType]) {
    return res.status(200).json({ answer: predefinedIdeas[eventType] });
  }

  const prompt = `Suggest 3 creative gift ideas for ${eventType} with budget ${budget} and time available: ${preferences}. Keep it short.`;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false
        },
        options: {
          wait_for_model: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API Error:", response.status, errorText);
      
      return res.status(200).json({ 
        answer: `Unable to generate AI suggestions. Try these popular occasions:\n• Father's Day\n• Mother's Day\n• Birthday\n• Anniversary\n• Christmas\n\nOr check your Hugging Face API key permissions at: huggingface.co/settings/tokens` 
      });
    }

    const data = await response.json();
    
    let answer;
    if (Array.isArray(data) && data[0]?.generated_text) {
      answer = data[0].generated_text;
    } else if (data.generated_text) {
      answer = data.generated_text;
    } else {
      answer = `Try these occasions instead:\n• Father's Day\n• Mother's Day\n• Birthday\n• Anniversary\n• Christmas`;
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error("HF API Error:", error);
    res.status(200).json({ 
      answer: `Pre-defined suggestions available for:\n• Father's Day\n• Mother's Day\n• Birthday\n• Anniversary\n• Valentine's Day\n• Christmas\n• Graduation\n• Wedding` 
    });
  }
}
