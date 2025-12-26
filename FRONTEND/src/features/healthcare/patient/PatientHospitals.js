import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Avatar, Stack, Container, Alert } from '@mui/material';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PatientHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/hospitals`);
        const json = await res.json();
        if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed to load hospitals');
        setHospitals(json.data || []);
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openUrl = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2, overflow: 'hidden', mt: 2 }}>
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="h3">Hospitals</Typography>
          <Typography variant="body2" color="text.secondary">View available hospitals. Links open the official sites.</Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          {loading && <Typography variant="body2" color="text.secondary">Loading hospitals...</Typography>}
          {error && <Alert severity="error" sx={{ my: 1 }}>{error}</Alert>}
          {!loading && !error && (
            <Grid container spacing={2}>
              {hospitals.map((h) => (
                <Grid item xs={12} md={6} key={h.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                          src={h.imageUrl || '/download.jpg'}
                          alt="hospital"
                          variant="rounded"
                          sx={{ width: 56, height: 56 }}
                        />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="subtitle1" noWrap fontWeight={600}>{h.name}</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {h.locationAddress || h.address}
                          </Typography>
                          {typeof h.rating === 'number' && (
                            <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.5 }}>
                              ★ {h.rating} ({h.reviewCount || 0})
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={() => openUrl(h.website)}
                          disabled={!h.website}
                          sx={{ minWidth: 150 }}
                        >
                          Open Website
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => openUrl(h.doctorsUrl)}
                          disabled={!h.doctorsUrl}
                          sx={{ minWidth: 150 }}
                        >
                          Doctors
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openUrl(h.appointmentUrl)}
                          disabled={!h.appointmentUrl}
                          sx={{ minWidth: 150 }}
                        >
                          Book Appointment
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default PatientHospitals;
