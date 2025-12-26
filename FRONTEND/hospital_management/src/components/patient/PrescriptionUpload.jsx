import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Grid
} from '@mui/material';
import { 
  FileUpload as FileUploadIcon, 
  Delete as DeleteIcon,
  MedicalServices as MedicalServicesIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { patientAPI } from '../../services/api';

const PrescriptionUpload = ({ patientId, onUploadSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const formik = useFormik({
    initialValues: {
      prescriptionFile: null,
      doctorName: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      medications: []
    },
    validationSchema: Yup.object({
      prescriptionFile: Yup.mixed().required('A file is required'),
      doctorName: Yup.string().required("Doctor's name is required"),
      date: Yup.date().required('Date is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('prescriptionFile', values.prescriptionFile);
        formData.append('doctorName', values.doctorName);
        formData.append('date', values.date);
        formData.append('notes', values.notes);
        formData.append('medications', JSON.stringify(values.medications));

        await patientAPI.uploadPrescription(patientId, formData);
        
        setSnackbar({
          open: true,
          message: 'Prescription uploaded successfully',
          severity: 'success'
        });
        
        resetForm();
        setOpen(false);
        if (onUploadSuccess) onUploadSuccess();
      } catch (error) {
        console.error('Error uploading prescription:', error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to upload prescription',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue('prescriptionFile', file);
  };

  const handleAddMedication = (medication) => {
    formik.setFieldValue('medications', [...formik.values.medications, medication]);
  };

  const handleRemoveMedication = (index) => {
    const newMedications = [...formik.values.medications];
    newMedications.splice(index, 1);
    formik.setFieldValue('medications', newMedications);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Button
        variant="contained"
        component="label"
        startIcon={<FileUploadIcon />}
        onClick={() => setOpen(true)}
      >
        Upload Prescription
      </Button>

      <Dialog 
        open={open} 
        onClose={() => !loading && setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Prescription</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  id="prescription-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="prescription-file">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<FileUploadIcon />}
                  >
                    {formik.values.prescriptionFile 
                      ? formik.values.prescriptionFile.name 
                      : 'Select Prescription File'}
                  </Button>
                </label>
                {formik.touched.prescriptionFile && formik.errors.prescriptionFile && (
                  <Typography color="error" variant="caption" display="block">
                    {formik.errors.prescriptionFile}
                  </Typography>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  Supported formats: PDF, JPG, JPEG, PNG (Max 5MB)
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="doctorName"
                  name="doctorName"
                  label="Doctor's Name"
                  value={formik.values.doctorName}
                  onChange={formik.handleChange}
                  error={formik.touched.doctorName && Boolean(formik.errors.doctorName)}
                  helperText={formik.touched.doctorName && formik.errors.doctorName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="date"
                  name="date"
                  label="Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="notes"
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Medications</Typography>
                  <AddMedicationDialog onAdd={handleAddMedication} />
                </Box>
                
                {formik.values.medications.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Medication</TableCell>
                          <TableCell>Dosage</TableCell>
                          <TableCell>Frequency</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formik.values.medications.map((med, index) => (
                          <TableRow key={index}>
                            <TableCell>{med.name}</TableCell>
                            <TableCell>{med.dosage}</TableCell>
                            <TableCell>{med.frequency}</TableCell>
                            <TableCell>{med.duration}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveMedication(index)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No medications added yet. Click the + button to add medications.
                    </Typography>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!formik.isValid || loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const AddMedicationDialog = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      name: '',
      dosage: '',
      frequency: 'Once daily',
      duration: '7 days',
      instructions: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Medication name is required'),
      dosage: Yup.string().required('Dosage is required'),
      frequency: Yup.string().required('Frequency is required'),
      duration: Yup.string().required('Duration is required')
    }),
    onSubmit: (values, { resetForm }) => {
      onAdd(values);
      resetForm();
      setOpen(false);
    }
  });

  return (
    <>
      <Button 
        size="small" 
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Add Medication
      </Button>
      
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Medication</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Medication Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="dosage"
                  name="dosage"
                  label="Dosage"
                  value={formik.values.dosage}
                  onChange={formik.handleChange}
                  error={formik.touched.dosage && Boolean(formik.errors.dosage)}
                  helperText={formik.touched.dosage && formik.errors.dosage}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    id="frequency"
                    name="frequency"
                    value={formik.values.frequency}
                    label="Frequency"
                    onChange={formik.handleChange}
                    error={formik.touched.frequency && Boolean(formik.errors.frequency)}
                  >
                    {['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 
                      'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'As needed'].map((freq) => (
                      <MenuItem key={freq} value={freq}>{freq}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    id="duration"
                    name="duration"
                    value={formik.values.duration}
                    label="Duration"
                    onChange={formik.handleChange}
                    error={formik.touched.duration && Boolean(formik.errors.duration)}
                  >
                    {['3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '28 days', '30 days', 'As needed'].map((dur) => (
                      <MenuItem key={dur} value={dur}>{dur}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="instructions"
                  name="instructions"
                  label="Special Instructions"
                  multiline
                  rows={2}
                  value={formik.values.instructions}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PrescriptionUpload;
