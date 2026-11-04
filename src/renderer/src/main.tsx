import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './compiled-tailwind.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary fallbackTitle="حدث خطأ أثناء تحميل واجهة التطبيق">
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
