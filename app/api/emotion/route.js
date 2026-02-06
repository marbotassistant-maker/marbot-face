// Simple emotion API - stores current emotion
// GET: returns current emotion
// POST: sets emotion (requires secret)

let currentEmotion = { emotion: 'neutral', message: '', timestamp: Date.now() }

export async function GET() {
  return Response.json(currentEmotion)
}

export async function POST(request) {
  const body = await request.json()
  currentEmotion = {
    emotion: body.emotion || 'neutral',
    message: body.message || '',
    timestamp: Date.now()
  }
  
  return Response.json({ success: true, ...currentEmotion })
}
