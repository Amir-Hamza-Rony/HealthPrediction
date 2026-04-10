import { useState } from 'react'

export default function DietRecommendations(){
  const [goal, setGoal] = useState('maintain')

  const recommendations = {
    maintain: ['Balanced meals', 'Regular activity', 'Hydration'],
    lose: ['Reduce calories', 'Increase protein', 'Strength training'],
    gain: ['Increase healthy calories', 'Frequent meals', 'Strength training']
  }

  return (
    <section className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-3">Diet Recommendations</h2>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm text-gray-600">Goal:</label>
        <select value={goal} onChange={e=>setGoal(e.target.value)} className="p-2 border rounded">
          <option value="maintain">Maintain weight</option>
          <option value="lose">Lose weight</option>
          <option value="gain">Gain weight</option>
        </select>
      </div>

      <ul className="list-disc ml-5 space-y-1">
        {recommendations[goal].map((r,i)=> <li key={i}>{r}</li>)}
      </ul>
    </section>
  )
}
