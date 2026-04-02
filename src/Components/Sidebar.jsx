export default function Sidebar({tabs, active, onChange}){
  return (
    <aside className="w-full md:w-64 bg-white rounded shadow p-3">
      <ul className="space-y-2">
        {tabs.map((t) => (
          <li key={t.key}>
            <button
              onClick={() => onChange(t.key)}
              className={`w-full text-left px-3 py-2 rounded ${active===t.key? 'bg-blue-50 text-blue-600 font-semibold':'text-gray-700 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
