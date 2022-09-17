import express from 'express'

const PORT = 8000
const app = express()

app.listen(PORT, async () => {
   /* eslint-disable-next-line */
   console.log(`Server is running on ${PORT} port`)
}).on('error', (err) => {
   /* eslint-disable-next-line */
   console.log(`Server error occured ${err}`)
})
