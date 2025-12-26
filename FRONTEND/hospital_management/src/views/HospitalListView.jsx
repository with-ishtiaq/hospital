import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Grid,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Paper,
  Chip,
  Rating,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { Search, LocalHospital, LocationOn, Phone, Email, OpenInNew as OpenInNewIcon, Star } from '@mui/icons-material';
import { useHospital } from '../contexts/HospitalContext';
import Image from '../components/common/Image';

const HospitalListView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const { hospitals, loading, error } = useHospital();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (hospitals) {
      const filtered = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredHospitals(filtered);
    }
  }, [searchTerm, hospitals]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" my={4}>
        <Typography color="error">
          Error loading hospitals: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Hospitals
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Browse and find the best hospitals in your area
        </Typography>
        
        <Box mb={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search hospitals by name, location, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {filteredHospitals.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No hospitals found
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Try adjusting your search or check back later.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredHospitals.map((hospital) => (
            <Grid item xs={12} key={hospital._id}>
              <Card 
                elevation={2} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6]
                  },
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  width: isMobile ? '100%' : 280,
                  height: isMobile ? 220 : 'auto',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Image 
                    entityType="hospital"
                    entityId={hospital._id}
                    alt={hospital.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    backdropFilter: 'blur(4px)'
                  }}>
                    <Star sx={{ color: '#FFD700', mr: 0.5, fontSize: 16 }} />
                    <Typography variant="body2" fontWeight="500">
                      {hospital.rating?.toFixed(1) || 'N/R'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          {hospital.website ? (
                            <Button
                              component="a"
                              href={hospital.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                mb: 1,
                                textTransform: 'none',
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'primary.contrastText'
                                }
                              }}
                              startIcon={<OpenInNewIcon fontSize="small" />}
                            >
                              Visit Website
                            </Button>
                          ) : (
                            <Typography 
                              variant="h5"
                              sx={{ 
                                mb: 0.5,
                                fontWeight: 600,
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              {hospital.name}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Chip 
                        label={hospital.type || 'General'} 
                        color="primary" 
                        size="small"
                        variant="outlined"
                        sx={{ height: 24 }}
                      />
                    </Box>

                    <Box mt={1} mb={2}>
                      {hospital.specialties?.slice(0, 4).map((specialty, index) => (
                        <Chip
                          key={index}
                          label={specialty}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {hospital.specialties?.length > 4 && (
                        <Chip 
                          label={`+${hospital.specialties.length - 4} more`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Box display="flex" flexDirection="column" gap={1} mt={2}>
                      <Box 
                        display="flex" 
                        alignItems="center"
                        component="a"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            color: 'primary.main',
                            '& .MuiSvgIcon-root': {
                              color: 'primary.main'
                            }
                          }
                        }}
                      onClick={(e) => e.stopPropagation()}
                      >
                        <LocationOn color="action" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {hospital.address || 'Address not available'}
                        </Typography>
                      </Box>
                      
                      {hospital.phone && (
                        <Box 
                          display="flex" 
                          alignItems="center"
                          component="a" 
                          href={`tel:${hospital.phone.replace(/[^0-9+]/g, '')}`}
                          sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': {
                              color: 'primary.main',
                              '& .MuiSvgIcon-root': {
                                color: 'primary.main'
                              }
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone color="action" fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {hospital.phone}
                          </Typography>
                        </Box>
                      )}
                      
                      {hospital.email && (
                        <Box 
                          display="flex" 
                          alignItems="center"
                          component="a"
                          href={`mailto:${hospital.email}`}
                          sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': {
                              color: 'primary.main',
                              '& .MuiSvgIcon-root': {
                                color: 'primary.main'
                              }
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Email color="action" fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {hospital.email}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {hospital.website && (
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button 
                          href={hospital.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={(e) => e.stopPropagation()}
                          startIcon={<OpenInNewIcon fontSize="small" />}
                        >
                          Visit Website
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HospitalListView;
