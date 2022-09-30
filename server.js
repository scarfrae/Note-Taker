const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./helper/fsUtils');


//TODO: GET /notes should return the notes.html file.
//refer to class activity 07-Ins_GET-Fetch/server.js for a get route to render a public html file.
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//TODO: GET /api/notes should read the db.json file and return all saved notes as JSON.
//refer to class activity 28-Stu_Mini-Project/Main/routes/tips.js for a get route to render data from a file
// GET Route for retrieving all the tips
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//TODO: POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
//refer to class activity 28-Stu_Mini-Project/Main/routes/tips.js for a POST route to take in a req.body and add to a .json file.
app.post('/api/notes', (req, res) => {
  console.log(req.body);

  const { title, text} = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      // note_id: uuidv4(),
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding ');
  }
});

// DELETE Route for a specific tip
app.delete('/api/notes/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

//TODO: GET * should return the index.html file.
//refer to class activity 07-Ins_GET-Fetch/server.js for a get route to render a public html file.
//wildcard route
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
