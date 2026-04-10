import { useState } from 'react'

export default function Pulse() {
  const [pulse, setPulse] = useState('')
  const [status, setStatus] = useState(null)

  function check(e) {
    e.preventDefault()
    const p = parseInt(pulse)
    if (!p) return
    let label = 'Normal', color = '#639922'
    if (p < 60) { label = 'Bradycardia (low)'; color = '#378ADD' }
    else if (p > 100) { label = 'Tachycardia (high)'; color = '#E24B4A' }
    setStatus({ bpm: p, label, color })
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 w-full">
      <h2 className="text-base font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">💓</span> Pulse Monitor
      </h2>
      <form onSubmit={check} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Pulse rate (bpm)</label>
          <input
            type="number" value={pulse} onChange={e => setPulse(e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            placeholder="e.g. 72"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Check Pulse
        </button>
      </form>

      {status && (
        <div className="mt-3 p-3.5 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-medium">{status.bpm}</span>
            <span className="text-xs text-gray-400">bpm</span>
          </div>
          <span
            className="inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: status.color + '20', color: status.color }}
          >
            {status.label}
          </span>
        </div>
      )}
    </section>
  )
}