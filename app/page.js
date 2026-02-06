'use client'
import { useState, useEffect } from 'react'

const REQUIRED_PIN = process.env.NEXT_PUBLIC_CHAT_PIN || '1209'

const emotions = {
  neutral: { eyeScale: 1, eyeY: 0, browY: 0, glowIntensity: 0.3, mouthCurve: 0 },
  thinking: { eyeScale: 0.8, eyeY: -3, browY: -8, glowIntensity: 0.6, mouthCurve: 0 },
  happy: { eyeScale: 1.2, eyeY: 0, browY: 5, glowIntensity: 0.8, mouthCurve: 15 },
  surprised: { eyeScale: 1.4, eyeY: 0, browY: -10, glowIntensity: 0.9, mouthCurve: -8 },
  oops: { eyeScale: 0.9, eyeY: 3, browY: 5, glowIntensity: 0.4, mouthCurve: -10 },
  engaged: { eyeScale: 1.1, eyeY: -2, browY: -3, glowIntensity: 0.7, mouthCurve: 5 },
}

function TikiFace({ emotion = 'neutral', speaking = false }) {
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

  const pulseIntensity = e.glowIntensity + Math.sin(glowPulse) * 0.15

  return (
    <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" style={{ width: '100vw', height: '100vh' }}>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity={pulseIntensity * 0.3} />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Background glow */}
      <rect x="0" y="0" width="100" height="80" fill="url(#glow)" />
      
      {/* Left eyebrow */}
      <path 
        d={`M 18 ${18 + e.browY} Q 28 ${10 + e.browY} 38 ${16 + e.browY}`}
        fill="none"
        stroke="#ff6b35"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Right eyebrow */}
      <path 
        d={`M 62 ${16 + e.browY} Q 72 ${10 + e.browY} 82 ${18 + e.browY}`}
        fill="none"
        stroke="#ff6b35"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Left eye */}
      <ellipse 
        cx="28" 
        cy={30 + e.eyeY} 
        rx={8 * e.eyeScale} 
        ry={blink ? 1 : 10 * e.eyeScale}
        fill="#ff6b35"
        style={{ transition: 'all 0.2s ease' }}
      />
      <ellipse 
        cx="28" 
        cy={30 + e.eyeY} 
        rx={4 * e.eyeScale} 
        ry={blink ? 0.5 : 5 * e.eyeScale}
        fill="#0a0a0f"
        style={{ transition: 'all 0.2s ease' }}
      />
      
      {/* Right eye */}
      <ellipse 
        cx="72" 
        cy={30 + e.eyeY} 
        rx={8 * e.eyeScale} 
        ry={blink ? 1 : 10 * e.eyeScale}
        fill="#ff6b35"
        style={{ transition: 'all 0.2s ease' }}
      />
      <ellipse 
        cx="72" 
        cy={30 + e.eyeY} 
        rx={4 * e.eyeScale} 
        ry={blink ? 0.5 : 5 * e.eyeScale}
        fill="#0a0a0f"
        style={{ transition: 'all 0.2s ease' }}
      />
      
      {/* Nose - tiki triangle */}
      <polygon 
        points="50,42 46,52 54,52"
        fill="#ff6b35"
      />
      
      {/* Mouth */}
      <path 
        d={`M 35 62 Q 50 ${62 + e.mouthCurve} 65 62`}
        fill="none"
        stroke="#ff6b35"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Speaking dots */}
      {speaking && (
        <g>
          <circle cx="42" cy="72" r="2" fill="#ff6b35">
            <animate attributeName="opacity" values="1;0.3;1" dur="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="72" r="2" fill="#ff6b35">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="58" cy="72" r="2" fill="#ff6b35">
            <animate attributeName="opacity" values="1;0.3;1" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
          </circle>
        </g>
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
    if (lower.includes('sorry') || lower.includes('oeps') || lower.includes('fout') || lower.includes('error')) return 'oops'
    if (lower.includes('!') || lower.includes('cool') || lower.includes('nice') || lower.includes('great') || lower.includes('love')) return 'happy'
    if (lower.includes('?') || lower.includes('hmm') || lower.includes('denk') || lower.includes('maybe')) return 'thinking'
    if (lower.includes('wow') || lower.includes('whoa') || lower.includes('amazing')) return 'surprised'
    return 'engaged'
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)
    setEmotion('thinking')

    // Demo response - replace with real API call later
    setTimeout(() => {
      const response = { 
        role: 'assistant', 
        content: 'Dit is een demo. Binnenkort word ik echt geconnect! 🚀' 
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
        backgroundColor: '#0a0a0f',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#fff'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: '#1a1a2e',
          padding: 40,
          borderRadius: 16,
          boxShadow: '0 4px 30px rgba(255, 107, 53, 0.15)'
        }}>
          <h1 style={{ marginBottom: 30, fontSize: 28 }}>🤖 MarBot2</h1>
          <p style={{ marginBottom: 20, opacity: 0.7 }}>Enter PIN</p>
          <input
            type="password"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handlePinSubmit()}
            placeholder="●●●●"
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#0a0a0f',
              color: '#fff',
              fontSize: 20,
              textAlign: 'center',
              letterSpacing: 8,
              marginBottom: 16,
              outline: 'none'
            }}
          />
          {pinError && <p style={{ color: '#ff6b35', marginBottom: 16 }}>❌ {pinError}</p>}
          <button
            onClick={handlePinSubmit}
            style={{
              width: '100%',
              padding: '14px 24px',
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
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0a0a0f',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Fullscreen Face - NO HEAD, just features */}
      <TikiFace emotion={emotion} speaking={isThinking} />
      
      {/* Small chat box - bottom right */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 320,
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        borderRadius: 12,
        padding: 14,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: 100
      }}>
        <div style={{
          height: 150,
          overflowY: 'auto',
          marginBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: 12
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#ff6b35' : '#2d2d44',
              padding: '8px 12px',
              borderRadius: 10,
              maxWidth: '85%'
            }}>
              {msg.content}
            </div>
          ))}
          {isThinking && (
            <div style={{
              alignSelf: 'flex-start',
              backgroundColor: '#2d2d44',
              padding: '8px 12px',
              borderRadius: 10,
              opacity: 0.7
            }}>
              ●●●
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
              padding: '10px 12px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#0a0a0f',
              color: '#fff',
              fontSize: 13,
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: '10px 16px',
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
  )
}
