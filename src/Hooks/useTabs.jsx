import { useState } from 'react'

export default function useTabs(initial='overview'){
  const [active, setActive] = useState(initial)
  return { active, setActive }
}
