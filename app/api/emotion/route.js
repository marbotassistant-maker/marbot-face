// Simple emotion API - stores current emotion
// GET: returns current emotion
// POST: sets emotion (requires secret)

let currentEmotion = { emotion: 'neutral', message: '', timestamp: Date.now() }

export async function GET() {
  return Response.json(currentEmotion)
}

export async function POST(request) {
  const secret = request.headers.get('x-marbot-secret')
  
  // Simple auth - must match env var
  if (secret !== process.env.MARBOT_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  currentEmotion = {
    emotion: body.emotion || 'neutral',
    message: body.message || '',
    timestamp: Date.now()
  }
  
  return Response.json({ success: true, ...currentEmotion })
}
