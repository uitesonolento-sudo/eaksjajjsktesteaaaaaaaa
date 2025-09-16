// arquivo: netlify/functions/translate.js

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método inválido" }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (!prompt || !prompt.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt não fornecido" }),
      };
    }

    const data = {
      prompt,
      context: [
        {
          role: "user",
          content:
            "Você é uma API de tradução especializada em converter frases escritas em português para inglês.\n" +
            "Regras:\n" +
            "1. Sempre traduza do português para o inglês.\n" +
            "2. Use gírias, expressões informais e linguagem do dia a dia.\n" +
            "3. Nunca traduza de forma literal ou formal. Prefira termos de conversas casuais, internet slang, expressões de rua.\n" +
            "4. Não explique, apenas retorne o resultado final.\n" +
            "5. Preserve o tom original (engraçado, debochado, triste, etc.).\n" +
            "6. Se já houver gírias em português, adapte para gíria equivalente no inglês.\n\n" +
            "Exemplo:\nEntrada: \"mano, eu tô muito cansado hoje\"\nSaída: \"bro, I'm mad tired today\"\n\n" +
            "Entrada: \"essa festa vai ser muito louca\"\nSaída: \"this party's gonna be lit as hell\"",
        },
        {
          role: "assistant",
          content:
            "Claro! Pode mandar as frases que eu faço a tradução.",
        },
      ],
    };

    const response = await fetch("https://chat.alma.tatar/api/context", {
      method: "POST",
      headers: {
        "Host": "chat.alma.tatar",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip",
        "User-Agent": "node-fetch/3.x",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno", details: error.message }),
    };
  }
}
