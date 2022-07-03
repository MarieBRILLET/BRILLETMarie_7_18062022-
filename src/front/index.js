import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; //implacement de la feuille de style voir si moddification possible entre css et scss
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);