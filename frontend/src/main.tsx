import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MantineProvider defaultColorScheme="light" theme={{}}>
          <App />
        </MantineProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);