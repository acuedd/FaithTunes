import { useState } from 'react';
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
  Text,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTokens } from '../store/slices/authSlice';
import { loginUser } from '../services/auth.service';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginUser(email, password);

      dispatch(setTokens({
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        user: res.user,
      }));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login fallido');
    }
  };

  return (
    <Center h="100vh" w="100vw">
      <Box w={400}>
        <Title style={{ textAlign: 'center' }} mb="md">
          Iniciar sesión 🎧
        </Title>

        <Paper withBorder shadow="md" p={30} radius="md">
          {error && (
            <Notification color="red" title="Error" onClose={() => setError('')}>
              {error}
            </Notification>
          )}

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                name="email"
                label="Email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <PasswordInput
                name="password"
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button fullWidth mt="sm" type="submit">
                Iniciar sesión
              </Button>
              <Button
                variant="subtle"
                color="blue"
                onClick={() => navigate('/register')}
              >
                ¿No tienes cuenta? Regístrate
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Center>
  );
}
