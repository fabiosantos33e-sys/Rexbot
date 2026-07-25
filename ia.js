const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = async function(pergunta){

    const resposta = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages:[
            {
                role:"system",
                content:"Você é o Mostrinho, um bot do Discord."
            },
            {
                role:"user",
                content: pergunta
            }
        ]
    });

    return resposta.choices[0].message.content;
};
