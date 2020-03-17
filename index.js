const express = require('express');

const postsRoutes = require('./posts/postsRoutes');

const server = express();
server.use(express.json());
server.use('/api/posts', postsRoutes);

server.listen(8000, () => console.log('API is running on port 8000'));