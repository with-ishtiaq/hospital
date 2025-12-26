import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalHospital as HospitalIcon,
  Link as LinkIcon
} from '@mui/icons-material';

const HospitalOptionsTab = () => {
  // Hospital data with provided links
  const [hospitals, setHospitals] = useState([
    { 
      id: 1, 
      name: 'Square Hospital', 
      url: 'https://www.squarehospital.com/',
      description: 'A leading private hospital in Bangladesh with international standard healthcare services.'
    },
    { 
      id: 2, 
      name: 'BRB Hospitals Limited', 
      url: 'https://www.brbhospital.com/',
      description: 'A multi-disciplinary super-specialty tertiary care hospital in Dhaka.'
    },
    { 
      id: 3, 
      name: 'Evercare Hospital Dhaka', 
      url: 'https://www.evercarebd.com/en',
      description: 'A part of the global Evercare Group, providing world-class healthcare services.'
    },
    { 
      id: 4, 
      name: 'Popular Medical College Hospital', 
      url: 'https://www.popular-hospital.com/',
      description: 'A renowned medical college hospital providing quality healthcare services.'
    },
    { 
      id: 5, 
      name: 'Labaid Specialized Hospital', 
      url: 'https://labaid.com.bd/',
      description: 'One of the largest private healthcare providers in Bangladesh.'
    },
    { 
      id: 6, 
      name: 'Ibn Sina Hospital', 
      url: 'https://www.ibnsinatrust.com/',
      description: 'A trusted name in healthcare services with multiple branches across the country.'
    }
  ]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [hospitalForm, setHospitalForm] = useState({ name: '', url: '' });

  const handleOpenDialog = (hospital = null) => {
    if (hospital) {
      setHospitalForm({ name: hospital.name, url: hospital.url });
      setEditingHospital(hospital.id);
    } else {
      setHospitalForm({ name: '', url: '' });
      setEditingHospital(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingHospital(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingHospital) {
      // Update existing hospital
      setHospitals(hospitals.map(h => 
        h.id === editingHospital ? { ...h, ...hospitalForm } : h
      ));
    } else {
      // Add new hospital
      const newHospital = {
        id: Date.now(),
        ...hospitalForm
      };
      setHospitals([...hospitals, newHospital]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      setHospitals(hospitals.filter(h => h.id !== id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Hospital Options
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Hospital
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mt: 1 }} columns={{ xs: 1, sm: 2, md: 3 }}>
        {hospitals.map((hospital) => (
          <Grid item xs={1} sm={1} md={1} key={hospital.id}>
            <Card elevation={3}>
              <CardActionArea 
                onClick={() => window.open(hospital.url, '_blank', 'noopener,noreferrer')}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <HospitalIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h6" component="div">
                        {hospital.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {hospital.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LinkIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(hospital.url, '_blank', 'noopener,noreferrer');
                    }}
                    sx={{ mt: 1, alignSelf: 'flex-start' }}
                  >
                    Visit Website
                  </Button>
                </CardContent>
              </CardActionArea>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDialog(hospital);
                  }}
                  aria-label="edit"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(hospital.id);
                  }}
                  aria-label="delete"
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Hospital Name"
              type="text"
              fullWidth
              variant="outlined"
              value={hospitalForm.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="url"
              label="Hospital URL"
              type="url"
              fullWidth
              variant="outlined"
              value={hospitalForm.url}
              onChange={handleInputChange}
              required
              placeholder="https://example.com"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingHospital ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default HospitalOptionsTab;
