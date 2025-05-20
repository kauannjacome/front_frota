// server.js
import express from 'express'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 3000

// Serve arquivos estáticos de dist
app.use(express.static(path.join(__dirname, 'dist')))

// Redireciona todas as requisições para index.html (SPA routing)
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
)

app.listen(PORT, () =>
  console.log(`Servidor rodando na porta ${PORT}`)
)
