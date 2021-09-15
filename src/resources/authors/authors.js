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
	const fileAsString = fileData.toString();
	const fileAsJsonArray = JSON.parse(fileAsString);
	const author = fileAsJsonArray.find(
		(author) => author.Id === req.params.authorid,
	);
	if (!author) {
		res
			.status(500)
			.send({ message: `author was not found ${req.params.authorid}` });
	}
	console.log(author);
	res.send(author);
});
// -------------------------post------------------------
authorsRouter.post('/', (req, res) => {
	// const newAuthor = { ...req.body, Id: uniqid() };
	const { name, surname, email, dateofbirth } = req.body;
	const newAuthor = {
		Id: uniqid(),
		name,
		surname,
		email,
		dateofbirth,
		avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
		createdAt: new Date(),
		updated: new Date(),
	};
	const authors = JSON.parse(readFileSync(authorsJsonFilePath));
	authors.push(newAuthor);
	writeFileSync(authorsJsonFilePath, JSON.stringify(authors));
	res.status(201).send({ name: newAuthor.name });
});
authorsRouter.post('/checkemail', (req, res) => {
	const { name, surname, email, dateofbirth } = req.body;
	const newAuthor = {
		Id: uniqid(),
		name,
		surname,
		email,
		dateofbirth,
		avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
		createdAt: new Date(),
		updated: new Date(),
	};

	const authors = JSON.parse(readFileSync(authorsJsonFilePath));
	const emailIsAlreadyInUse = authors.some(
		(author) => author.email === req.body.email,
	);
	if (emailIsAlreadyInUse) {
		return res.send('email has been already in use', false);
	} else {
		authors.push(newAuthor);
		writeFileSync(authorsJsonFilePath, JSON.stringify(authors));
		return res.send(true);
	}
});
// -----------------------put-------------------

authorsRouter.put('/:authorid', (req, res) => {
	const authors = JSON.parse(readFileSync(authorsJsonFilePath));
	let remainingAuthors = authors.filter(
		(author) => author.ID !== req.params.authorid,
	);
	let updatedAuthor = { ...req.body, ID: req.params.authorid };
	remainingAuthors.push(updatedAuthor);
	res.send(updatedAuthor);
});
// --------------------------------delete-----------------------
authorsRouter.delete('/:authorid', (req, res) => {
	const authorsData = JSON.parse(readFileSync(authorsJsonFilePath));
	let modifiedAuthors = authorsData.filter(
		(author) => author.ID !== req.params.authorid,
	);
	writeFileSync(authorsJsonFilePath, JSON.stringify(modifiedAuthors));
	res.status(204).send('deleted');
});
export default authorsRouter;
