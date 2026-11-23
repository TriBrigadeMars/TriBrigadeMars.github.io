import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import '../styles/brand.css';
import { EducationPage } from '../pages/EducationPage';

hydrateRoot(document.getElementById('root')!, <EducationPage />);
