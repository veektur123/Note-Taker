const express = require('express')
const app = express()
const path = require('path');
const { uuid } = require('uuidv4');
const fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (request, response) => {
    response.sendFile(path.join(__dirname, "/public/notes.html"));
   
})

app.get('/api/notes', (request, response) => {
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          response.json(parsedNotes)
        }
      });
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.log(req.body)
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text ) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };
  
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, "/public/index.html"));
   
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})