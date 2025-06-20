// api/resolver.js

export default async function handler(request, response) {
  // Solo permitir peticiones POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Obtenemos el problema matemático que el usuario envió desde el frontend.
    const { problema } = request.body;

    if (!problema) {
      return response.status(400).json({ error: 'No se proporcionó ningún problema.' });
    }

    // 2. Usamos la clave de API guardada de forma segura en Vercel.
    const apiKey = process.env.WOLFRAM_API_KEY;

    // 3. Construimos la URL para la API de Wolfram|Alpha.
    const url = `https://api.wolframalpha.com/v2/query?input=<span class="math-inline">\{encodeURIComponent\(problema\)\}&appid\=</span>{apiKey}&output=JSON&includepodid=Result&includepodid=Step-by-step+solution`;

    // 4. Hacemos la llamada desde el servidor de Vercel a Wolfram|Alpha.
    const wolframResponse = await fetch(url);
    const data = await wolframResponse.json();

    // 5. Devolvemos la respuesta al frontend (a tu index.html).
    response.status(200).json(data);

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Hubo un error al contactar la API de WolframAlpha.' });
  }
}