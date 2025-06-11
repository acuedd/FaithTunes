import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Stack,
  Notification,
  Center,
  Box,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { registerUser } from '../services/auth.service';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await registerUser(name, email, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <Center h="100vh" w="100vw">
      <Box w={400}>
        <Title style={{ textAlign: 'center' }} mb="md">
          Crear cuenta 🎧
        </Title>

        <Paper withBorder shadow="md" p="lg" radius="md">
          {error && (
            <Notification color="red" title="Error" onClose={() => setError('')}>
              {error}
            </Notification>
          )}

          <form onSubmit={handleRegister}>
            <Stack>
              <TextInput
                label="Nombre"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <TextInput
                label="Email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <PasswordInput
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={password.length > 0 && password.length < 6 ? 'Debe tener al menos 6 caracteres' : null}
              />

              <Button fullWidth type="submit" mt="md">
                Registrarse
              </Button>
              <Button
                variant="subtle"
                color="blue"
                onClick={() => navigate('/login')}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Center>
  );
}