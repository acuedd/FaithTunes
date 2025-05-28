import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications'; // 👈 Importa esto
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <MantineProvider
      theme={{
        components: {
          Modal: {
            styles: () => ({
              inner: {
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                zIndex: 200,
              },
              content: {
                margin: 0,
              },
            }),
          },
        },
      }}
    >
      <Notifications position="top-right" zIndex={9999} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}