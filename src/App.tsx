
import React, { useEffect, useState } from 'react'

type Card = {
  id: number
  symbol: string
  matched: boolean
}

const symbols = ['🍎','🚀','🎧','🎲','🌟','🎯','🎵','🧠','🧩','📚'] as const

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function useTimer(isRunning: boolean) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!isRunning) return
    const t = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [isRunning])
  return [elapsed, setElapsed] as const
}

export default function App() {
  const [size, setSize] = useState<4 | 6 | 8>(4)
  const [deck, setDeck] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [best, setBest] = useState<number | null>(() => {
    const key = `best_${size}`
    const v = localStorage.getItem(key)
    return v ? Number(v) : null
  })
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useTimer(running)
  const [won, setWon] = useState(false)

  React.useEffect(() => { newGame(size) }, [size])

  function newGame(grid: 4|6|8 = size) {
    const pick = symbols.slice(0, (grid*grid)/2)
    const cards: Card[] = shuffle([...pick, ...pick]).map((s, idx) => ({
      id: idx, symbol: s, matched: false
    }))
    setDeck(cards)
    setFlipped([])
    setMoves(0)
    setRunning(false)
    setElapsed(0)
    setWon(false)
    setBest(() => {
      const key = `best_${grid}`
      const v = localStorage.getItem(key)
      return v ? Number(v) : null
    })
  }

  function onCardClick(idx: number) {
    if (won) return
    if (!running) setRunning(true)
    if (flipped.includes(idx) || deck[idx].matched) return
    const next = [...flipped, idx]
    setFlipped(next)
    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [a,b] = next
      if (deck[a].symbol === deck[b].symbol) {
        setTimeout(() => {
          setDeck((d) => d.map((c,i) => i===a || i===b ? {...c, matched: true} : c))
          setFlipped([])
        }, 350)
      } else {
        setTimeout(() => setFlipped([]), 650)
      }
    } else if (next.length > 2) {
      setFlipped([idx])
    }
  }

  useEffect(() => {
    const allMatched = deck.length>0 && deck.every(c => c.matched)
    if (allMatched) {
      setRunning(false)
      setWon(true)
      const key = `best_${size}`
      if (best === null || moves < best) {
        localStorage.setItem(key, String(moves))
        setBest(moves)
      }
    }
  }, [deck, moves, best, size])

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="title">Flip &amp; Match</h1>
        <div className="stats">
          <span>步數：{moves}</span>
          <span>時間：{elapsed}s</span>
          <span>最佳：{best ?? '-'}</span>
        </div>
      </header>

      <section className="controls">
        <label>棋盤：
          <select value={size} onChange={(e)=> setSize(Number(e.target.value) as 4|6|8)}>
            <option value={4}>4×4（新手）</option>
            <option value={6}>6×6（進階）</option>
            <option value={8}>8×8（高手）</option>
          </select>
        </label>
        <button onClick={()=>newGame()}>重新開始</button>
        <button onClick={()=>{localStorage.clear(); newGame()}}>重置紀錄</button>
      </section>

      <main className="board" style={{gridTemplateColumns:`repeat(${size}, 1fr)`}}>
        {deck.map((card, idx) => {
          const isFaceUp = flipped.includes(idx) || card.matched
          return (
            <button
              key={card.id}
              className={`card ${isFaceUp ? 'up' : ''} ${card.matched ? 'done' : ''}`}
              onClick={()=>onCardClick(idx)}
              aria-label={isFaceUp ? card.symbol : '卡牌'}
            >
              <span className="front">?</span>
              <span className="back">{card.symbol}</span>
            </button>
          )
        })}
      </main>

      <footer className="footer">
        <h2>玩法</h2>
        <ol>
          <li>點擊兩張卡牌，若圖案相同即配對成功。</li>
          <li>所有卡牌配對完成即獲勝；用越少步數越好。</li>
          <li>可切換不同棋盤大小訓練記憶與專注。</li>
        </ol>
      </footer>

      {won && (
        <div className="overlay">
          <div className="dialog">
            <h3>你贏了！</h3>
            <p>總步數：{moves}，用時：{elapsed}s</p>
            <div className="dialog-actions">
              <button onClick={()=>newGame()}>再玩一次</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
