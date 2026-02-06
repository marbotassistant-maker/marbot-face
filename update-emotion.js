#!/usr/bin/env node
/**
 * Helper script to update emotion on the web app
 * Usage: node update-emotion.js "happy" "Dat is geweldig!"
 */

const emotion = process.argv[2] || 'neutral'
const message = process.argv[3] || ''
const url = process.env.MARBOT_FACE_URL || 'https://marbot-face-jie7ihy1t-marbots-projects-9de693f5.vercel.app'
const secret = process.env.MARBOT_SECRET || 'dev-secret-123'

async function updateEmotion() {
  try {
    const res = await fetch(`${url}/api/emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-marbot-secret': secret
      },
      body: JSON.stringify({ emotion, message })
    })
    
    const data = await res.json()
    console.log('✅ Emotion updated:', data)
  } catch (err) {
    console.error('❌ Failed to update emotion:', err.message)
    process.exit(1)
  }
}

updateEmotion()
