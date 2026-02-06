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

function Avatar({ emotion = 'neutral', speaking = false }) {
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
    <svg viewBox="0 0 200 200" style={{ width: 300, height: 300 }}>
      {/* Glow effect */}
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity={pulseIntensity} />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      
      {/* Background glow */}
      <circle cx="100" cy="100" r="90" fill="url(#glow)" filter="url(#blur)" />
      
      {/* Shell/Frame */}
      <path 
        d="M100 20 C150 20 180 50 180 100 C180 150 150 180 100 180 C50 180 20 150 20 100 C20 50 50 20 100 20"
        fill="none"
        stroke="#1a1a2e"
        strokeWidth="8"
      />
      <path 
        d="M100 25 C147 25 175 53 175 100 C175 147 147 175 100 175 C53 175 25 147 25 100 C25 53 53 25 100 25"
        fill="#0f0f1a"
        stroke="#2d2d44"
        strokeWidth="2"
      />
      
      {/* Left eye */}
      <ellipse 
        cx="70" 
        cy={95 + e.eyeY} 
        rx={18 * e.eyeScale} 
        ry={blink ? 2 : 22 * e.eyeScale}
        fill="#ff6b35"
        style={{ transition: 'all 0.2s ease' }}
      />
      <ellipse 
        cx="70" 
        cy={95 + e.eyeY} 
        rx={8 * e.eyeScale} 
        ry={blink ? 1 : 10 * e.eyeScale}
        fill="#0f0f1a"
        style={{ transition: 'all 0.2s ease' }}
      />
      
      {/* Right eye */}
      <ellipse 
        cx="130" 
        cy={95 + e.eyeY} 
        rx={18 * e.eyeScale} 
        ry={blink ? 2 : 22 * e.eyeScale}
        fill="#ff6b35"
        style={{ transition: 'all 0.2s ease' }}
      />
      <ellipse 
        cx="130" 
        cy={95 + e.eyeY} 
        rx={8 * e.eyeScale} 
        ry={blink ? 1 : 10 * e.eyeScale}
        fill="#0f0f1a"
        style={{ transition: 'all 0.2s ease' }}
      />
      
      {/* Mouth */}
      <path 
        d={`M 70 140 Q 100 ${140 + e.mouthCurve} 130 140`}
        fill="none"
        stroke="#ff6b35"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Speaking indicator */}
      {speaking && (
        <circle cx="100" cy="160" r="5" fill="#ff6b35">
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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 20,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff'
    }}>
      <Avatar emotion={emotion} speaking={isThinking} />
      
      <div style={{
        width: '100%',
        maxWidth: 500,
        marginTop: 20,
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.1)'
      }}>
        <div style={{
          height: 300,
          overflowY: 'auto',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
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
        
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Typ een bericht..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#0f0f1a',
              color: '#fff',
              fontSize: 16,
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            style={{
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
            →
          </button>
        </div>
      </div>
      
      {/* Emotion test buttons */}
      <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.keys(emotions).map(e => (
          <button
            key={e}
            onClick={() => setEmotion(e)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: emotion === e ? '2px solid #ff6b35' : '2px solid #2d2d44',
              backgroundColor: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            {e}
          </button>
        ))}
      </div>
    </main>
  )
}
