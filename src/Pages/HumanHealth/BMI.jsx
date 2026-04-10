import { useState } from 'react'

export default function BMI() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [result, setResult] = useState(null)

  function calculate(e) {
    e.preventDefault()
    const w = parseFloat(weight)
    const h = parseFloat(height) / 100
    if (!w || !h) return
    const bmi = +(w / (h * h)).toFixed(1)
    let cat = 'Unknown', color = '#888'
    if (bmi < 18.5) { cat = 'Underweight'; color = '#378ADD' }
    else if (bmi < 25) { cat = 'Normal'; color = '#639922' }
    else if (bmi < 30) { cat = 'Overweight'; color = '#EF9F27' }
    else { cat = 'Obese'; color = '#E24B4A' }
    setResult({ bmi, cat, color })
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 w-full">
      <h2 className="text-base font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">⚖️</span> BMI Calculator
      </h2>
      <form onSubmit={calculate} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
            <input
              type="number" value={weight} onChange={e => setWeight(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              placeholder="e.g. 70"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Height (cm)</label>
            <input
              type="number" value={height} onChange={e => setHeight(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              placeholder="e.g. 170"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Calculate BMI
        </button>
      </form>

      {result && (
        <div className="mt-3 p-3.5 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-2xl font-medium">{result.bmi}</div>
          <div className="text-xs text-gray-400 mb-1">BMI</div>
          <span
            className="inline-block text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: result.color + '20', color: result.color }}
          >
            {result.cat}
          </span>
        </div>
      )}
    </section>
  )
}