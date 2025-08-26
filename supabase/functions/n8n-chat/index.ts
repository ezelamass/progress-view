import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL');
    if (!N8N_WEBHOOK_URL) {
      throw new Error('N8N_WEBHOOK_URL is not set');
    }

    const { conversationId, message, userId, userEmail, userProfile } = await req.json();

    console.log('Received chat request:', { conversationId, message, userId, userEmail });

    // Prepare the payload for n8n
    const n8nPayload = {
      headers: {
        host: req.headers.get('host') || 'localhost',
        'user-agent': req.headers.get('user-agent') || 'Client Hub',
        'content-length': req.headers.get('content-length') || '0',
        accept: req.headers.get('accept') || '*/*',
        'accept-encoding': req.headers.get('accept-encoding') || 'gzip, deflate, br',
        'accept-language': req.headers.get('accept-language') || 'en-US,en;q=0.9',
        'content-type': 'application/json',
        origin: req.headers.get('origin') || 'http://localhost:8080',
        referer: req.headers.get('referer') || 'http://localhost:8080/',
        'x-forwarded-for': req.headers.get('x-forwarded-for') || '127.0.0.1',
        'x-real-ip': req.headers.get('x-real-ip') || '127.0.0.1'
      },
      params: {},
      query: {},
      body: {
        conversationId,
        message,
        userId,
        userEmail,
        userProfile: userProfile || {}
      }
    };

    console.log('Sending to n8n:', N8N_WEBHOOK_URL);

    // Send to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!response.ok) {
      console.error('n8n webhook error:', response.status, response.statusText);
      throw new Error(`n8n webhook failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('n8n response:', responseData);

    // Extract content from n8n response - handle different response formats
    let content = '';
    if (responseData.output) {
      content = responseData.output;
    } else if (responseData['output.respuesta']) {
      content = responseData['output.respuesta'];
    } else if (typeof responseData === 'string') {
      content = responseData;
    } else {
      content = 'Respuesta recibida de n8n';
    }

    // Always return as an array with proper content extraction
    const responses = [{ content, sender: 'ai', timestamp: new Date().toISOString() }];

    return new Response(JSON.stringify({ responses }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in n8n-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      responses: [{
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta nuevamente.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      }]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});