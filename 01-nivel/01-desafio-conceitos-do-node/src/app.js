const express = require("express");
const cors = require("cors");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getRepositoryIndex(id) {
  return repositories.findIndex(repository => repository.id == id );
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (getRepositoryIndex(id) < 0) {
    return response.status(400).json({error: "Project not found"})
  }

  if (!validate(id)) {
    return response.status(400).json({ error: "Invalid project ID" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = getRepositoryIndex(id);
  const { likes } = repositories[index];

  repositories[index] = { id, title, url, techs, likes };

  return response.status(200).json(repositories[index]);
});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  repositories.splice(getRepositoryIndex(id), 1);

  return response.status(204).json({ message: "deleted successfully" });
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;
  const index = getRepositoryIndex(id);
  const repository = repositories[index];
  const likes = repository.likes + 1;

  repositories[index] = { ...repository, likes};

  return response.status(200).json(repositories[index]);
});

module.exports = app;
