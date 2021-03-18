const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const posts = {}

app.get('/posts', (_, res) => {
	res.send(posts)
})

app.post('/events', (req, res) => {
	const { type, data } = req.body

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

	console.log(posts)
	res.send({})
})

app.listen(4002, () => {
	console.log('Listening on 4002')
})
