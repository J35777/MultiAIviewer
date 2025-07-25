const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
require('dotenv').config()

const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.json())

app.post('/api/query', async (req, res) => {
  const { prompt } = req.body

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        }
      }
    )

    res.json({ generated_text: response.data[0]?.generated_text || '' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to query Hugging Face model' })
  }
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
