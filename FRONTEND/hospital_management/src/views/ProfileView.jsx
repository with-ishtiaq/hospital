import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { patientAPI } from '../services/api';

const ProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const res = await patientAPI.getProfile(user._id);
        const data = res.data?.data || res.data; // support either style
        setProfile(data);
        setForm({
          name: data?.name || user.name || '',
          email: data?.email || user.email || '',
          phone: data?.phone || '',
          address: data?.address || ''
        });
      } catch (e) {
        console.error(e);
        setError(e.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await patientAPI.updateProfile(user._id, form);
      setSuccess('Profile updated successfully');
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar sx={{ width: 56, height: 56 }}>
          {form.name?.charAt(0) || user?.name?.charAt(0) || '?'}
        </Avatar>
        <Box>
          <Typography variant="h5">My Profile</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal information
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
      )}

      <Box component="form" onSubmit={onSave}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={onChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={onChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileView;
