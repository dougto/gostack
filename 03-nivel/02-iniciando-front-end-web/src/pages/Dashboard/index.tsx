import React from 'react';

const Dashboard: React.FC = () => (
  <div>
    dashboad{' '}
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem('@GoBarber:token');
        localStorage.removeItem('@GoBarber:user');
      }}
    >
      sair
    </button>
  </div>
);

export default Dashboard;
