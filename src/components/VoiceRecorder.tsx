'use client'
import { useState, useRef } from 'react'

export default function VoiceRecorder({ expectedText }: { expectedText: string }) {

  const [recording, setRecording] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunks: Blob[] = []

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })

      const formData = new FormData()
      formData.append('audio', blob)
      formData.append('expectedText', expectedText)

      const res = await fetch('/api/pronunciation', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      setScore(data.score)
      setFeedback(data.feedback)
    }

    mediaRecorder.start()
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">

      <p className="mb-2 font-semibold">🎯 Say this:</p>
      <p className="text-lg mb-4">{expectedText}</p>

      {!recording ? (
        <button onClick={startRecording} className="bg-green-500 text-white px-4 py-2 rounded">
          Start Speaking
        </button>
      ) : (
        <button onClick={stopRecording} className="bg-red-500 text-white px-4 py-2 rounded">
          Stop
        </button>
      )}

      {score !== null && (
        <div className="mt-4">
          <p>Score: {score}/100</p>
          <p className="text-sm text-gray-600">{feedback}</p>
        </div>
      )}

    </div>
  )
}
