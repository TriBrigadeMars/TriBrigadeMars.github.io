import React from 'react';
import { renderToString } from 'react-dom/server';
import { HomePage } from '../pages/HomePage';
import { EducationPage } from '../pages/EducationPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function renderPage(route: 'home' | 'education' | 'notFound'): string {
  switch (route) {
    case 'home':
      return renderToString(<HomePage />);
    case 'education':
      return renderToString(<EducationPage />);
    case 'notFound':
      return renderToString(<NotFoundPage />);
  }
}
