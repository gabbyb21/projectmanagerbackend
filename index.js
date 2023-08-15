const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json());

//routes

//create project
app.post('/projects', async(req, res) => {
  try {
    const { title, description, status, github_link, app_link } = req.body;
    const newProject = await pool.query('INSERT INTO project (title, description, status, github_link, app_link) VALUES ($1, $2, $3, $4, $5) RETURNING *', [title, description, status, github_link, app_link]);

    res.json(newProject.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all projects
app.get('/projects', async(req, res) => {
  try {
    const allProjects = await pool.query('SELECT * FROM project');

    res.json(allProjects.rows);
  } catch (err) {
    console.error(err.message)
  }
})

//get a project
app.get('/projects/:id', async(req, res) => {
  try {
    const { id } = req.params;
    const project = await pool.query('SELECT * FROM project WHERE project_id = $1', [id])

    res.json(project.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

//update a project
app.put('/projects/:id', async(req, res) => {
  try {
    console.log(req.body);
    const { id } = req.params; 
    const { description, status, github_link, app_link } = req.body;
    const updateProject = await pool.query(`UPDATE project SET description = '${req.body.description}', status = '${req.body.status}', github_link = '${req.body.github_link}', app_link = '${req.body.app_link}' WHERE project_id = ${req.params.id}`);

    res.json('Project was updated');
  } catch (err) {
    console.error(err.message)
  }
})

//delete a project
app.delete('/projects/:id', async( req, res) => {
  try {
    const { id } = req.params;
    const deleteProject = await pool.query('DELETE FROM project WHERE project_id = $1', [id]);

    res.json('Project was deleted');
  } catch (err) {
    console.error(err.message)
  }
})

app.listen(4000, () => {
  console.log('server has started on port 4000');
});