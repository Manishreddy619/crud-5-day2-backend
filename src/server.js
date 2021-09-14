import express from 'express'; // importing express
// 1=> you need to intsall express and import it and dont forget to write type: module in package.json file ,if you want to use above syntax
import authorsRouter from './resources/authors/authors.js';
const server = express(); // express is function
const port = 3002;

server.use(cors());
server.use(express.json());
server.use('/authors', authorsRouter);
server.listen(port, () => {
	console.log(`server is running on ${port}`);
});
// we are listening to port 3001
