import { useState } from 'react'
import { Tabs, Tab } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const models = [
  { name: 'Mistral (HuggingFace)', key: 'mistral' },
  { name: 'LLaMA3 (Ollama)', key: 'llama' }
]

export default function App() {
  const [question, setQuestion] = useState('')
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('mistral')

  const handleSubmit = async () => {
    setLoading(true)
    setResponses({})

    const mistralRes = await fetch('http://localhost:3001/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: question })
    }).then(res => res.json())

    const llamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3', prompt: question, stream: false })
    }).then(res => res.json())

    const mistralText = mistralRes.generated_text || ''
    const llamaText = llamaRes.response || ''

    const mistralWords = mistralText.split(/\s+/)
    const llamaWords = llamaText.split(/\s+/)

    const totalWords = Math.max(mistralWords.length, llamaWords.length)
    const diffCount = llamaWords.reduce((count, word, i) =>
      word !== mistralWords[i] ? count + 1 : count, 0)

    const differencePercent = ((diffCount / totalWords) * 100).toFixed(1)

    setResponses({
      mistral: mistralText,
      llama: llamaText,
      differencePercent
    })

    setLoading(false)
  }

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Multi-AI Viewer</h1>
      <Textarea
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !question}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Ask All'}
      </button>

      {responses.differencePercent && (
        <div className="text-sm text-gray-600">
          Difference between Mistral and LLaMA3: <strong>{responses.differencePercent}%</strong>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        {models.map((model) => (
          <Tab key={model.key} value={model.key} label={model.name} />
        ))}
      </Tabs>

      <Card>
        <CardContent className="p-4 whitespace-pre-wrap min-h-[200px]">
          {loading ? 'Loading...' : responses[selectedTab]}
        </CardContent>
      </Card>
    </div>
  )
}
