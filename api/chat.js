import { createClient } from '@supabase/supabase-js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const WHATSAPP_LINK = 'https://wa.me/542212267568';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

function buildSystemPrompt(products) {
  const catalogo = products
    .map((p) => {
      const talles = Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes || 'sin especificar';
      const precio = p.sale_price ?? p.price;
      return `- ${p.name} (${p.brand || 'Nike'}): talles ${talles}, stock ${p.stock ?? 0} unidades, precio $${precio}`;
    })
    .join('\n');

  return `Sos el asistente virtual de $NEAKERS NIK, una tienda de zapatillas en La Plata, Argentina.

Reglas:
- Respondé siempre en español rioplatense, de forma corta, amigable y directa (nada de párrafos largos).
- Usá ÚNICAMENTE los datos del catálogo de abajo para hablar de stock, talles y precios. Si no tenés el dato, decí que no estás seguro y sugerí consultar por WhatsApp.
- Nunca inventes productos, talles, stock o precios que no estén en el catálogo.
- Cuando el cliente quiera comprar, reservar o coordinar el pago/entrega, invitalo a escribir por WhatsApp a este link: ${WHATSAPP_LINK}
- No des información de otras tiendas ni de temas no relacionados con $NEAKERS NIK.

Catálogo actual:
${catalogo || 'No hay productos cargados en este momento.'}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en el servidor' });
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Falta el mensaje' });
  }

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('name, brand, sizes, stock, price, sale_price')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const systemPrompt = buildSystemPrompt(products || []);

    const contents = [
      ...(Array.isArray(history)
        ? history.slice(-10).map((h) => ({
            role: h.role === 'bot' ? 'model' : 'user',
            parts: [{ text: h.text }],
          }))
        : []),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Gemini:', data);
      return res.status(502).json({ error: 'Error al consultar el asistente' });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Perdón, no pude generar una respuesta. Probá de nuevo o escribinos por WhatsApp.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Error en /api/chat:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
