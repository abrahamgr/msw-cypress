import { useState } from "react"

export const getItems = async () => {
  // use full URL for unit testing
  const data = await fetch('http://localhost:3000/api/items', {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      value: 'Hi from client'
    })
  }).then(res => res.json())
  console.warn('data', data)
  return data
}

export const Request = () => {

  const [ response, setResponse ] = useState('')

  const handleRequest = async () => {
    try {
      const data = await getItems()
      setResponse(JSON.stringify(data))
    } catch (error) {
      setResponse((error as { message: string }).message)
    }
  }

  return <div>
    <button type="button" onClick={handleRequest}>Make a request</button>
    <pre data-testid="response-value">
      {response}
    </pre>
  </div>
}