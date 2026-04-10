import { useState } from 'react'

export default function AIPrediction(){
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)

  function predict(e){
    e.preventDefault()
    const list = symptoms.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean)
    if(list.length===0) return

    // Simulated rule-based prediction (demo only)
    const rules = [
      { match: ['fever','cough'], disease: 'Common Cold / Flu' },
      { match: ['chest pain','shortness of breath'], disease: 'Cardiac concern (see doctor)' },
      { match: ['thirst','frequent urination'], disease: 'Possible Diabetes' },
      { match: ['itching','rash'], disease: 'Allergic reaction' },
    ]

    let found = 'No strong match — consult a professional.'
    for(const r of rules){
      if(r.match.every(m => list.some(s => s.includes(m)))){ found = r.disease; break }
    }

    // minor randomness for demo
    if(found==='No strong match — consult a professional.' && Math.random()>0.8) found='Further evaluation recommended.'

    setResult({ symptoms: list, prediction: found })
  }

  return (
    <section className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-3">AI-based Disease Prediction (simulated)</h2>
      <form onSubmit={predict} className="space-y-3">
        <label className="text-sm text-gray-600">Enter symptoms (comma-separated)</label>
        <input value={symptoms} onChange={e=>setSymptoms(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. fever, cough, sore throat" />
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Predict</button>
        </div>
      </form>

      {result && (
        <div className="mt-4 bg-gray-50 p-4 rounded">
          <div className="text-sm text-gray-600">Symptoms: {result.symptoms.join(', ')}</div>
          <div className="mt-2 font-medium">Prediction: {result.prediction}</div>
        </div>
      )}
    </section>
  )
}
