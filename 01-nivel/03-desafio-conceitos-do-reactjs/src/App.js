import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories')
    .then(res => {
      console.log(res);
      setRepositories(res.data);
    });
  },[]);

  async function handleAddRepository() {
    const newRepository = (await api.post('repositories', {
      title: `new repo ${(Date.now())}`,
      url: "blabla.com",
      techs: ["tech 1", "tech 2"]
    })).data;
    setRepositories([...repositories, newRepository])
  }

  async function handleRemoveRepository(id) {
    (await api.delete(`/repositories/${id}`));
    const index = repositories.findIndex(repository => repository.id === id );
    repositories.splice(index, 1);
    setRepositories([...repositories]);
  }

  function renderRepositories() {
    if (repositories.length === 0) return null;

    return (<div style={{dsplay: "flex", flexDirection: "column"}}>
      {repositories.map(repository => {
      return (<div key={repository.id} style={{display: "flex", maxWidth: "40%"}}>
        <div>{repository.title}</div>
        <button onClick={() => handleRemoveRepository(repository.id)}>
          Remover
        </button>
      </div>)})}
    </div>
    );
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {renderRepositories()}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
