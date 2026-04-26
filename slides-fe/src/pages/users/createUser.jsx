import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import httpClient from '../../services/axios';

const roles = [
  { value: 'user', label: 'User' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateUser = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.username) {
      newErrors.username = 'Username is required';
    } else if (/\s/.test(form.username)) {
      newErrors.username = 'Username must not contain spaces';
    }
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!form.role) {
      newErrors.role = 'Role is required';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSuccess('');
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    setSuccess('');
    try {
      await httpClient.post('http://localhost:3500/api/users/create', {
        username: form.username,
        password: form.password,
        email: form.email,
        role: form.role,
      });
      setSuccess('User created successfully!');
      setForm({ username: '', password: '', email: '', role: '' });
    } catch (err) {
      setApiError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="60vh" display="flex" justifyContent="center" bgcolor="#fff" sx={{ pt: 5 }}>
      <Box maxWidth={320} width="100%" boxShadow={2} borderRadius={2} bgcolor="#fff" mt={3} minHeight={220} display="flex" flexDirection="column" justifyContent="center" sx={{ p: '15px' }}>
        <Typography variant="h5" mb={1.5} fontWeight={600} align="center">Create User</Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={!!errors.username}
            helperText={errors.username}
            autoComplete="off"
            InputProps={{ style: { textAlign: 'center' } }}
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={!!errors.email}
            helperText={errors.email}
            autoComplete="off"
            InputProps={{ style: { textAlign: 'center' } }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="dense"
            error={!!errors.password}
            helperText={errors.password}
            autoComplete="new-password"
            InputProps={{ style: { textAlign: 'center' } }}
          />
          <FormControl fullWidth margin="dense" error={!!errors.role}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={form.role}
              label="Role"
              onChange={handleChange}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>{role.label.toLowerCase()}</MenuItem>
              ))}
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>
          {apiError && <Typography color="error" mt={1}>{apiError}</Typography>}
          {success && <Typography color="primary" mt={1}>{success}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1.5, textTransform: 'none', fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default CreateUser; 