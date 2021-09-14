import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import uniqid from 'uniqid';
const authorsRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
console.log(currentDir);
const authorsJsonFilePath = join(currentDir, 'authors.json');

// ---------------------get-------------------
authorsRouter.get('/', (req, res) => {
	// res.send('data coming................');
	// we need the file to get the data
	const fileData = readFileSync(authorsJsonFilePath);
	console.log(fileData);
	// convert to human readable
	const authorsData = JSON.parse(fileData);
	console.log(authorsData);
	res.send(authorsData);
});

// ----------------------get with id----------------------
authorsRouter.get('/:authorid', (req, res) => {
	// res.send('author is coming.................');
	const fileData = readFileSync(authorsJsonFilePath);
	const authorsData = JSON.parse(fileData);
	const author = authorsData.find(
		(author) => author.ID === req.params.authorid,
	);

	res.send(author);
});
// -------------------------post------------------------
authorsRouter.post('/', (req, res) => {
	const newAuthor = { ...req.body, Id: uniqid() };
	const authors = JSON.parse(readFileSync(authorsJsonFilePath));
	authors.push(newAuthor);
	writeFileSync(authorsJsonFilePath, JSON.stringify(authors));
	res.status(201).send({ name: newAuthor.name });
});

authorsRouter.put('/:authorid', (req, res) => {
	const authors = JSON.parse(readFileSync(authorsJsonFilePath));
	let remainingAuthors = authors.filter(
		(author) => author.ID !== req.params.authorid,
	);
	let updatedAuthor = { ...req.body, ID: req.params.authorid };
	remainingAuthors.push(updatedAuthor);
	res.send(updatedAuthor);
});
authorsRouter.delete('/:authorid', (req, res) => {
	const authorsData = JSON.parse(readFileSync(authorsJsonFilePath));
	let modifiedAuthors = authorsData.filter(
		(author) => author.ID !== req.params.authorid,
	);
	writeFileSync(authorsJsonFilePath, JSON.stringify(modifiedAuthors));
	res.status(204).send('deleted');
});
export default authorsRouter;
// authorsRouter.post('/checkemail', (req, res) => {
// 	console.log(req.body);
// 	const authors = JSON.parse(readFileSync(authorsJsonFilePath));
// 	console.log(authors);
// 	let emails = authors.map((author) => author.email);
// 	// if (req.body.email) {
// 	// 	const authors = JSON.parse(readFileSync(authorsJsonFilePath));
// 	// 	authors.filter((author) => {
// 	// 		let uniqueEmail = author.email !== req.body.email;
// 	// 		console.log(uniqueEmail);
// 	// 		if (uniqueEmail) {
// 	// 			const newAuthor = { ...req.body, Id: uniqid() };
// 	// 			authors.push(newAuthor);
// 	// 			writeFileSync(authorsJsonFilePath, JSON.stringify(authors));
// 	// 			res.status(201).send(true);
// 	// 		}
// 	// 	});
// 	// } else {
// 	res.send('hello');
// 	// }
// });
