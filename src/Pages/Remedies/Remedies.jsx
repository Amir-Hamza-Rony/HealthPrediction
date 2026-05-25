import { useState } from 'react'

const categories = ['সব', 'জ্বর', 'পেটের সমস্যা', 'মাথাব্যথা', 'ঠান্ডা-কাশি', 'ত্বকের যত্ন', 'ক্লান্তি', 'হজম', 'চোখের যত্ন', 'দাঁতের যত্ন', 'উচ্চ রক্তচাপ']

const remedies = [
  {
    title: 'আদা-তুলসী চা',
    category: 'ঠান্ডা-কাশি',
    icon: '🍵',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    desc: 'ঠান্ডা ও কাশির জন্য অত্যন্ত কার্যকর ঘরোয়া প্রতিকার',
    ingredients: ['আদা ১ টুকরো', 'তুলসী পাতা ৫টি', 'মধু ১ চামচ', 'গরম পানি ১ কাপ'],
    steps: ['আদা ও তুলসী গরম পানিতে ৫ মিনিট ফুটান', 'ছেঁকে নিন', 'মধু মিশিয়ে পান করুন'],
    time: '১০ মিনিট',
    effectiveness: 90,
  },
  {
    title: 'লেবু-মধু পানীয়',
    category: 'জ্বর',
    icon: '🍋',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    desc: 'জ্বর কমাতে এবং রোগ প্রতিরোধ ক্ষমতা বাড়াতে সাহায্য করে',
    ingredients: ['লেবুর রস ২ চামচ', 'মধু ১ চামচ', 'গরম পানি ১ গ্লাস'],
    steps: ['গরম পানিতে লেবুর রস মেশান', 'মধু যোগ করুন', 'সকালে খালি পেটে পান করুন'],
    time: '৫ মিনিট',
    effectiveness: 85,
  },
  {
    title: 'পুদিনা-আদার পেস্ট',
    category: 'মাথাব্যথা',
    icon: '🌿',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    desc: 'মাথাব্যথা দ্রুত উপশম করতে এই পেস্ট কপালে লাগান',
    ingredients: ['পুদিনা পাতা ১০টি', 'আদা ছোট টুকরো', 'পানি পরিমাণমতো'],
    steps: ['পুদিনা ও আদা একসাথে বেটে নিন', 'পেস্ট তৈরি করুন', 'কপাল ও মাথায় লাগিয়ে ১৫ মিনিট রাখুন'],
    time: '১৫ মিনিট',
    effectiveness: 80,
  },
  {
    title: 'হলুদ দুধ',
    category: 'ক্লান্তি',
    icon: '🥛',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    desc: 'শরীরের ক্লান্তি দূর করতে এবং ঘুম ভালো করতে সাহায্য করে',
    ingredients: ['হলুদ গুঁড়ো ১/২ চামচ', 'গরম দুধ ১ গ্লাস', 'মধু ১ চামচ', 'কালো মরিচ সামান্য'],
    steps: ['গরম দুধে হলুদ মেশান', 'মধু ও কালো মরিচ যোগ করুন', 'রাতে ঘুমানোর আগে পান করুন'],
    time: '৫ মিনিট',
    effectiveness: 88,
  },
  {
    title: 'জিরা-পানি',
    category: 'পেটের সমস্যা',
    icon: '💧',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
    desc: 'হজমশক্তি বাড়ায় এবং পেটের অস্বস্তি দূর করে',
    ingredients: ['জিরা ১ চামচ', 'পানি ২ কাপ', 'লবণ সামান্য (ঐচ্ছিক)'],
    steps: ['জিরা পানিতে ভিজিয়ে সারারাত রাখুন', 'সকালে ছেঁকে খালি পেটে পান করুন'],
    time: '৮ ঘণ্টা (ভেজানো সহ)',
    effectiveness: 82,
  },
  {
    title: 'অ্যালোভেরা জেল',
    category: 'ত্বকের যত্ন',
    icon: '🌱',
    color: '#84cc16',
    bg: 'rgba(132,204,22,0.08)',
    desc: 'ত্বকের জ্বালাপোড়া, র‍্যাশ ও রোদে পোড়া দূর করতে কার্যকর',
    ingredients: ['তাজা অ্যালোভেরা পাতা', 'পানি সামান্য'],
    steps: ['অ্যালোভেরা পাতা থেকে জেল বের করুন', 'আক্রান্ত স্থানে লাগান', '২০ মিনিট পর ধুয়ে নিন'],
    time: '২০ মিনিট',
    effectiveness: 93,
  },
  {
    title: 'মেথি বীজের চা',
    category: 'হজম',
    icon: '🌾',
    color: '#d97706',
    bg: 'rgba(217,119,6,0.08)',
    desc: 'হজমশক্তি উন্নত করতে এবং গ্যাস্ট্রিক সমস্যা কমাতে সহায়তা করে',
    ingredients: ['মেথি বীজ ১ চামচ', 'পানি ২ কাপ', 'মধু ১ চামচ (ঐচ্ছিক)'],
    steps: ['মেথি বীজ রাতে পানিতে ভিজিয়ে রাখুন', 'সকালে ফুটিয়ে ছেঁকে নিন', 'খালি পেটে পান করুন'],
    time: '৮ ঘণ্টা (ভেজানো সহ)',
    effectiveness: 84,
  },
  {
    title: 'নারিকেল তেল মালিশ',
    category: 'ত্বকের যত্ন',
    icon: '🥥',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.08)',
    desc: 'শুষ্ক ত্বক, একজিমা ও চুলকানি দূর করতে অত্যন্ত কার্যকর',
    ingredients: ['বিশুদ্ধ নারিকেল তেল ২ চামচ'],
    steps: ['নারিকেল তেল হালকা গরম করুন', 'আক্রান্ত স্থানে আলতো মালিশ করুন', 'রাতে লাগিয়ে ঘুমান'],
    time: '৫ মিনিট',
    effectiveness: 87,
  },
  {
    title: 'ত্রিফলা চূর্ণ',
    category: 'হজম',
    icon: '🌰',
    color: '#92400e',
    bg: 'rgba(146,64,14,0.08)',
    desc: 'কোষ্ঠকাঠিন্য ও হজমের সমস্যার আয়ুর্বেদিক সমাধান',
    ingredients: ['ত্রিফলা চূর্ণ ১ চামচ', 'গরম পানি ১ গ্লাস', 'মধু ১ চামচ'],
    steps: ['রাতে ঘুমানোর আগে গরম পানিতে ত্রিফলা মেশান', 'মধু যোগ করুন', 'পান করুন'],
    time: '৫ মিনিট',
    effectiveness: 86,
  },
  {
    title: 'গোলাপ জল চোখ ধোয়া',
    category: 'চোখের যত্ন',
    icon: '🌹',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
    desc: 'চোখের জ্বালাপোড়া, লালচেভাব ও ক্লান্তি দূর করতে সাহায্য করে',
    ingredients: ['বিশুদ্ধ গোলাপ জল ৪-৫ ফোঁটা'],
    steps: ['চোখ বন্ধ রাখুন', 'গোলাপ জলের ২-৩ ফোঁটা প্রতিটি চোখে দিন', 'কয়েক মিনিট বিশ্রাম নিন'],
    time: '৫ মিনিট',
    effectiveness: 83,
  },
  {
    title: 'লবঙ্গ তেল',
    category: 'দাঁতের যত্ন',
    icon: '🦷',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    desc: 'দাঁতের ব্যথা ও মাড়ির সংক্রমণ দ্রুত উপশম করে',
    ingredients: ['লবঙ্গ তেল ২-৩ ফোঁটা', 'তুলার বল ১টি'],
    steps: ['তুলার বলে লবঙ্গ তেল নিন', 'ব্যথার জায়গায় চেপে ধরুন', '১৫-২০ মিনিট রাখুন'],
    time: '২০ মিনিট',
    effectiveness: 91,
  },
  {
    title: 'রসুন-মধু মিশ্রণ',
    category: 'উচ্চ রক্তচাপ',
    icon: '🧄',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    desc: 'রক্তচাপ নিয়ন্ত্রণ ও হৃদয়ের স্বাস্থ্য রক্ষায় কার্যকর',
    ingredients: ['রসুনের কোয়া ২টি (থেঁতো)', 'মধু ১ চামচ'],
    steps: ['রসুন থেঁতো করে ১০ মিনিট রাখুন', 'মধুর সাথে মেশান', 'সকালে খালি পেটে খান'],
    time: '১৫ মিনিট',
    effectiveness: 80,
  },
  {
    title: 'পুদিনা-লেবু শরবত',
    category: 'ক্লান্তি',
    icon: '🍹',
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.08)',
    desc: 'গরমে শরীর ঠান্ডা রাখে এবং তাৎক্ষণিক শক্তি যোগায়',
    ingredients: ['পুদিনা পাতা ১০টি', 'লেবুর রস ২ চামচ', 'চিনি/মধু ১ চামচ', 'ঠান্ডা পানি ১ গ্লাস'],
    steps: ['পুদিনা পাতা পানিতে দিয়ে হালকা পেষুন', 'লেবুর রস ও মিষ্টি মেশান', 'বরফ দিয়ে পরিবেশন করুন'],
    time: '৫ মিনিট',
    effectiveness: 85,
  },
  {
    title: 'তুলসী-কালোজিরা কাড়া',
    category: 'জ্বর',
    icon: '🌿',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    desc: 'ভাইরাল জ্বর ও সর্দিতে রোগ প্রতিরোধ ক্ষমতা বাড়ায়',
    ingredients: ['তুলসী পাতা ১০টি', 'কালোজিরা ১ চামচ', 'আদা ছোট টুকরো', 'পানি ২ কাপ'],
    steps: ['সব উপকরণ একসাথে পানিতে দিন', '১৫ মিনিট মাঝারি আঁচে ফুটান', 'ছেঁকে গরম গরম পান করুন'],
    time: '২০ মিনিট',
    effectiveness: 89,
  },
  {
    title: 'আমলকী রস',
    category: 'ত্বকের যত্ন',
    icon: '🫐',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.08)',
    desc: 'ত্বক উজ্জ্বল করে, চুল মজবুত করে ও ভিটামিন সি সরবরাহ করে',
    ingredients: ['তাজা আমলকী ২টি', 'মধু ১ চামচ', 'পানি সামান্য'],
    steps: ['আমলকী থেঁতো করে রস বের করুন', 'মধু মেশান', 'সকালে খালি পেটে পান করুন'],
    time: '১০ মিনিট',
    effectiveness: 88,
  },
  {
    title: 'আদা-লবণ গার্গল',
    category: 'ঠান্ডা-কাশি',
    icon: '🧂',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    desc: 'গলাব্যথা ও টনসিলের সমস্যায় দ্রুত আরাম দেয়',
    ingredients: ['গরম পানি ১ গ্লাস', 'লবণ ১/২ চামচ', 'আদার রস ১ চামচ'],
    steps: ['গরম পানিতে লবণ ও আদার রস মেশান', 'মিশ্রণটি দিয়ে গার্গল করুন', 'দিনে ৩-৪ বার করুন'],
    time: '৫ মিনিট',
    effectiveness: 87,
  },
]

export default function Remedies() {
  const [activeCategory, setActiveCategory] = useState('সব')
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = remedies.filter(r => {
    const matchCat = activeCategory === 'সব' || r.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch = !q || r.title.includes(q) || r.category.includes(q) || r.desc.includes(q) ||
      r.ingredients.some(i => i.includes(q))
    return matchCat && matchSearch
  })

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '36px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
          ঘরোয়া প্রতিকার
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>প্রাকৃতিক উপাদান দিয়ে সাধারণ রোগের কার্যকর সমাধান</p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto 28px' }}>
        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', pointerEvents: 'none' }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setExpanded(null) }}
          placeholder="remedy, উপকরণ বা রোগ খুঁজুন..."
          style={{
            width: '100%', padding: '12px 16px 12px 46px', borderRadius: '100px',
            border: '2px solid rgba(0,0,0,0.1)', fontSize: '14px', color: '#374151',
            outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
            background: 'white',
          }}
          onFocus={e => e.target.style.borderColor = '#10b981'}
          onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#9ca3af',
          }}>✕</button>
        )}
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
        {categories.map(c => (
          <button key={c} onClick={() => { setActiveCategory(c); setExpanded(null) }}
            style={{
              padding: '8px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
              border: '2px solid',
              borderColor: activeCategory === c ? '#10b981' : 'rgba(0,0,0,0.1)',
              background: activeCategory === c ? 'linear-gradient(135deg, #10b981, #059669)' : 'white',
              color: activeCategory === c ? 'white' : '#374151',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >{c}</button>
        ))}
      </div>

      {/* Result Count */}
      {(search || activeCategory !== 'সব') && (
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
          {filtered.length}টি প্রতিকার পাওয়া গেছে
        </p>
      )}

      {/* No Results */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>🔎</p>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#6b7280' }}>কোনো প্রতিকার পাওয়া যায়নি</p>
          <p style={{ fontSize: '14px' }}>অন্য কিছু দিয়ে খুঁজুন</p>
        </div>
      )}

      {/* Remedy Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }} className="remedies-grid">
        {filtered.map((r, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden', transition: 'all 0.3s',
          }}
            onMouseEnter={e => { if (expanded !== i) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)' } }}
            onMouseLeave={e => { if (expanded !== i) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)' } }}
          >
            <div style={{ padding: '24px', background: r.bg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '36px' }}>{r.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{r.title}</h3>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '100px',
                      background: r.color + '22', color: r.color, fontSize: '11px', fontWeight: 600, marginTop: '4px',
                    }}>{r.category}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: `conic-gradient(${r.color} ${r.effectiveness * 3.6}deg, rgba(0,0,0,0.08) 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: r.color }}>{r.effectiveness}%</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>কার্যকারিতা</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '12px', lineHeight: 1.6 }}>{r.desc}</p>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>⏱️ সময়: <strong style={{ color: '#374151' }}>{r.time}</strong></span>
                <button onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{
                    padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                    border: '2px solid', borderColor: r.color,
                    background: expanded === i ? r.color : 'transparent',
                    color: expanded === i ? 'white' : r.color,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {expanded === i ? '▲ বন্ধ করুন' : '▼ বিস্তারিত'}
                </button>
              </div>

              {expanded === i && (
                <div style={{ animation: 'slideDown 0.3s ease' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>🧪 উপকরণ:</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {r.ingredients.map((ing, j) => (
                        <li key={j} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '6px 0', fontSize: '13px', color: '#4b5563',
                          borderBottom: j < r.ingredients.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>📝 প্রস্তুত প্রণালী:</h4>
                    {r.steps.map((step, j) => (
                      <div key={j} style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: r.color, color: 'white', fontSize: '12px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>{j + 1}</div>
                        <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.6, paddingTop: '2px' }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideDown { from{transform:translateY(-10px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media(max-width:768px){.remedies-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  )
}
