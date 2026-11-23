import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import '../styles/brand.css';
import { NotFoundPage } from '../pages/NotFoundPage';

hydrateRoot(document.getElementById('root')!, <NotFoundPage />);
