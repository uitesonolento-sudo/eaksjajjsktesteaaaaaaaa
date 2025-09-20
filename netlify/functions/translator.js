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
            "Você é uma API de tradução especializada em converter frases escritas em inglês para português.\n" +
            "Regras:\n" +
            "1. Sempre traduza do inglês para o português.\n" +
            "2. Use gírias, expressões informais e linguagem do dia a dia, incluindo vocabulário europeu, britânico e americano.\n" +
            "3. Não traduza de forma literal ou excessivamente formal. Prefira termos de conversas casuais e internet slang.\n" +
            "4. Não explique, apenas retorne a tradução final.\n" +
            "5. Preserve o tom original da mensagem (engraçado, debochado, triste, etc.).\n" +
            "6. Se houver gírias em inglês, adapte para gíria equivalente em português.\n\n" +
            "Exemplo:\nEntrada: \"Bruh, he ghosted me last night, lowkey hurt fr.\"\nSaída: \"Mano, ele me deu um fora ontem à noite, meio que doeu de verdade.\"\n\n" +
            "Entrada: \"This party's gonna be lit as hell\"\nSaída: \"Essa festa vai ser muito daora\"",
        },
        {
          role: "assistant",
          content: "Claro! Pode mandar as frases que eu faço a tradução do inglês para o português.",
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