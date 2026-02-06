'use client'
import { useState, useEffect } from 'react'

const REQUIRED_PIN = process.env.NEXT_PUBLIC_CHAT_PIN || '1209'

const emotions = {
  neutral: { eyeScale: 1, eyeY: 0, glowIntensity: 0.3, mouthCurve: 0 },
  thinking: { eyeScale: 0.8, eyeY: -5, glowIntensity: 0.6, mouthCurve: 0 },
  happy: { eyeScale: 1.2, eyeY: 0, glowIntensity: 0.8, mouthCurve: 10 },
  surprised: { eyeScale: 1.4, eyeY: 0, glowIntensity: 0.9, mouthCurve: -5 },
  oops: { eyeScale: 0.9, eyeY: 3, glowIntensity: 0.4, mouthCurve: -8 },
  engaged: { eyeScale: 1.1, eyeY: -2, glowIntensity: 0.7, mouthCurve: 5 },
}

function TikiAvatar({ emotion = 'neutral', speaking = false }) {
  const e = emotions[emotion] || emotions.neutral
  const [blink, setBlink] = useState(false)
  const [glowPulse, setGlowPulse] = useState(0)

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBlink(true)
        setTimeout(() => setBlink(false), 150)
      }
    }, 2000)
    return () => clearInterval(blinkInterval)
  }, [])

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setGlowPulse(p => (p + 0.1) % (Math.PI * 2))
    }, 50)
    return () => clearInterval(pulseInterval)
  }, [])

  const pulseIntensity = e.glowIntensity + Math.sin(glowPulse) * 0.1

  return (
    <svg viewBox="0 0 200 250" style={{ width: '100%', height: '100%', maxHeight: '100vh' }}>
      <defs>
        <radialGradient id="tikiglow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity={pulseIntensity} />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Glow */}
      <circle cx="100" cy="80" r="80" fill="url(#tikiglow)" />
      
      {/* Left eyebrow */}
      <path 
        d={`M 50 ${50 + e.eyeY * 1.5} Q 70 ${35 + e.eyeY * 1.5} 80 ${45 + e.eyeY * 1.5}`}
        fill="none"
        stroke="#ff6b35"
        strokeWidth="4"
        strokeLinecap="round"
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Right eyebrow */}
      <path 
        d={`M 120 ${45 + e.eyeY * 1.5} Q 130 ${35 + e.eyeY * 1.5} 150 ${50 + e.eyeY * 1.5}`}
        fill="none"
        stroke="#ff6b35"
        strokeWidth="4"
        strokeLinecap="round"
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Left eye */}
      <circle 
        cx="65" 
        cy={70 + e.eyeY} 
        r={blink ? 3 : 12 * e.eyeScale}
        fill="#ff6b35"
        style={{ transition: 'all 0.2s ease' }}
      />
      <circle 
        cx="65" 
        cy={70 + e.eyeY} 
        r={blink ? 1 : 6 * e.eyeScale}
        fill="#0f0f1a"
        style={{ transition: 'all 0.2s ease' }}
      />
      
      {/* Right eye */}
      <circle 
        cx="135" 
        cy={70 + e.eyeY} 
        r={blink ? 3 : 12 * e.eyeScale}
        fill="#ff6b35"
        style={{ transition: 'all 0.2s ease' }}
      />
      <circle 
        cx="135" 
        cy={70 + e.eyeY} 
        r={blink ? 1 : 6 * e.eyeScale}
        fill="#0f0f1a"
        style={{ transition: 'all 0.2s ease' }}
      />
      
      {/* Nose (tiki style - triangle) */}
      <polygon 
        points="100,95 95,110 105,110"
        fill="#ff6b35"
      />
      
      {/* Mouth */}
      <path 
        d={`M 75 130 Q 100 ${135 + e.mouthCurve * 1.5} 125 130`}
        fill="none"
        stroke="#ff6b35"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Speaking indicator */}
      {speaking && (
        <circle cx="100" cy="160" r="4" fill="#ff6b35">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  )
}

export default function Home() {
  const [pinEntered, setPinEntered] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey! Ik ben MarBot2. Hoe kan ik je helpen?' }
  ])
  const [input, setInput] = useState('')
  const [emotion, setEmotion] = useState('neutral')
  const [isThinking, setIsThinking] = useState(false)

  const handlePinSubmit = () => {
    if (pinInput === REQUIRED_PIN) {
      setPinEntered(true)
      setPinError('')
    } else {
      setPinError('Invalid PIN')
      setPinInput('')
    }
  }

  const detectEmotion = (text) => {
    const lower = text.toLowerCase()
    if (lower.includes('sorry') || lower.includes('oeps') || lower.includes('fout')) return 'oops'
    if (lower.includes('!') || lower.includes('cool') || lower.includes('nice')) return 'happy'
    if (lower.includes('?') || lower.includes('hmm') || lower.includes('denk')) return 'thinking'
    if (lower.includes('wow') || lower.includes('whoa')) return 'surprised'
    return 'engaged'
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)
    setEmotion('thinking')

    // Simulate response (replace with actual API call)
    setTimeout(() => {
      const response = { 
        role: 'assistant', 
        content: 'Dit is een demo interface. Om mij echt te verbinden, moet Marcel de API endpoint configureren. Maar kijk - mijn gezicht reageert op emoties! 😊' 
      }
      setMessages(prev => [...prev, response])
      setEmotion(detectEmotion(response.content))
      setIsThinking(false)
      
      setTimeout(() => setEmotion('neutral'), 3000)
    }, 1500)
  }

  if (!pinEntered) {
    return (
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 20,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#fff'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: '#1a1a2e',
          padding: 40,
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)'
        }}>
          <h1 style={{ marginBottom: 30, fontSize: 24 }}>🤖 MarBot2</h1>
          <p style={{ marginBottom: 20, opacity: 0.8 }}>Enter PIN to access</p>
          <input
            type="password"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handlePinSubmit()}
            placeholder="PIN"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#0f0f1a',
              color: '#fff',
              fontSize: 18,
              textAlign: 'center',
              letterSpacing: 4,
              marginBottom: 16,
              outline: 'none'
            }}
          />
          {pinError && <p style={{ color: '#ff6b35', marginBottom: 16 }}>❌ {pinError}</p>}
          <button
            onClick={handlePinSubmit}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#ff6b35',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Enter
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Fullscreen Avatar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <TikiAvatar emotion={emotion} speaking={isThinking} />
      </div>
      
      {/* Chat box - bottom right corner */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 350,
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.2)',
        zIndex: 10
      }}>
        <div style={{
          height: 200,
          overflowY: 'auto',
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: 13
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#ff6b35' : '#2d2d44',
              padding: '10px 16px',
              borderRadius: 12,
              maxWidth: '80%'
            }}>
              {msg.content}
            </div>
          ))}
          {isThinking && (
            <div style={{
              alignSelf: 'flex-start',
              backgroundColor: '#2d2d44',
              padding: '10px 16px',
              borderRadius: 12,
              opacity: 0.7
            }}>
              <span style={{ animation: 'pulse 1s infinite' }}>●●●</span>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Typ..."
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#0f0f1a',
              color: '#fff',
              fontSize: 13,
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#ff6b35',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            →
          </button>
        </div>
      </div>
    </main>
      
    </main>
  )
}
