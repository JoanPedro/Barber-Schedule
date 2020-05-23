import app from './app'; // Só é possível com sucrase! "Yarn add sucrase -D"

const PORT = 3333;

app.listen(PORT, () => {
  // Inicia servidor!
  console.log(`Server running in: http://localhost:${PORT}`);
});
