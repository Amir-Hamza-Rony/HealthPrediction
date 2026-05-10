import { useState } from 'react'

function HealthTracking(){
  return (
    <section className="bg-white rounded shadow p-6">
      <h3 className="font-medium">Pet Health Tracking</h3>
      <p className="text-sm text-gray-600">Log weight, vaccinations and notes for your pet.</p>
    </section>
  )
}

function PetDiseasePrediction(){
  return (
    <section className="bg-white rounded shadow p-6">
      <h3 className="font-medium">Pet Disease Prediction (simulated)</h3>
      <p className="text-sm text-gray-600">Enter symptoms to get a simulated suggestion.</p>
    </section>
  )
}

function PetDoctorRecommendation(){
  const doctors = [
    { name:'Dr. Anna - Vet Clinic', specialty:'General' },
    { name:'Dr. Rao - Animal Care', specialty:'Surgery' }
  ]

  return (
    <section className="bg-white rounded shadow p-6">
      <h3 className="font-medium">Pet Doctor Recommendations</h3>
      <ul className="mt-3 space-y-2">
        {doctors.map((d,i)=> <li key={i} className="p-3 border rounded">{d.name} — {d.specialty}</li>)}
      </ul>
    </section>
  )
}

export default function PetHealth(){
  const [tab, setTab] = useState('track')

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={()=>setTab('track')} className={`px-3 py-2 rounded ${tab==='track'? 'bg-blue-600 text-white':'bg-white'}`}>Tracking</button>
        <button onClick={()=>setTab('predict')} className={`px-3 py-2 rounded ${tab==='predict'? 'bg-blue-600 text-white':'bg-white'}`}>Prediction</button>
        <button onClick={()=>setTab('doctors')} className={`px-3 py-2 rounded ${tab==='doctors'? 'bg-blue-600 text-white':'bg-white'}`}>Doctors</button>
      </div>

      {tab==='track' && <HealthTracking />}
      {tab==='predict' && <PetDiseasePrediction />}
      {tab==='doctors' && <PetDoctorRecommendation />}
    </div>
  )
}
