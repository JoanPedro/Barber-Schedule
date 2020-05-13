const app = require('./app')
const PORT = 3333

app.listen(PORT, _ => { // Inicia servidor!
  console.log(`Server running in: http://localhost:${PORT}`)
})
