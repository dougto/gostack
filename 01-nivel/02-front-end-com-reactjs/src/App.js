import React, { useState, useEffect } from 'react';
import Header from './components/Header';

import api from './services/api';
import './App.css';
import backgroundImage from './assets/background.jpg';

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('projects')
    .then(res => {
      console.log(res);
      setProjects(res.data);
    });
  },[]);

  function handleAddProject() {
    api.post('projects', { title: `project ${Date.now()}`, owner: 'website'})
    .then(res => {
      console.log('New project:', res.data);
      setProjects([...projects, res.data]);
    });
  }

  return (
    <>
      <Header title="Projects" />

      <img width={300} src={backgroundImage} />

      <div>Projetos:</div>
      {projects.map(project => {
        return (<div key={project.id}>{project.title}</div>)
      })}

      <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
    </>
  );
}

export default App;
