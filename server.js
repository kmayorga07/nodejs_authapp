const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
  res.json(users);
});

// This will allow users to create a user
app.post('/users', async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    if (!req.body.name || !req.body.password) {
      return res.status(400).send('Name and password are required');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch (error) {
    console.error("Error during user creation:", error); // Log the error
    res.status(500).send('Server error');
  }
});

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send('Cannot find user');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success');
    } else {
      res.send('Not Allowed');
    }
  } catch (error) {
    console.error("Error during login:", error); // Log the error
    res.status(500).send('Server error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
