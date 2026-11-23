import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import '../styles/brand.css';
import { HomePage } from '../pages/HomePage';

hydrateRoot(document.getElementById('root')!, <HomePage />);
