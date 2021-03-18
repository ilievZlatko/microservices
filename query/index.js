const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(express.json())
app.use(cors())

const posts = {}

const handleEvent = (type, data) => {
	switch (type) {
		case 'PostCreated': {
			const { id, title } = data
			posts[id] = { id, title, comments: [] }
			break
		}

		case 'CommentCreated': {
			const { id, content, postId, status } = data
			const post = posts[postId]
			post.comments.push({ id, content, status })
			break
		}

		case 'CommentUpdated': {
			const { id, content, postId, status } = data
			const post = posts[postId]
			const comment = post.comments.find(c => c.id === id)

			comment.status = status
			comment.content = content
			break
		}

		default:
			break
	}
}

app.get('/posts', (_, res) => {
	res.send(posts)
})

app.post('/events', (req, res) => {
	handleEvent(req.body.type, req.body.data)
	res.send({})
})

app.listen(4002, async () => {
	console.log('Listening on 4002')

	const res = await axios.get('http://localhost:4005/events')

	for (let event of res.data) {
		console.log('Processing event:', event.type)
		handleEvent(event.type, event.data)
	}
})
