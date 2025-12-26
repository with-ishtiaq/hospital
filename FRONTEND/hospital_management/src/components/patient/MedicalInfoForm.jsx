import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MedicalInformation as MedicalInformationIcon,
  LocalHospital as LocalHospitalIcon,
  Bloodtype as BloodtypeIcon,
  MonitorWeight as WeightIcon,
  Height as HeightIcon,
  MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  bloodType: Yup.string().required('Blood type is required'),
  height: Yup.number().positive('Height must be positive').required('Height is required'),
  weight: Yup.number().positive('Weight must be positive').required('Weight is required'),
  allergies: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Allergy name is required'),
      severity: Yup.string().required('Severity is required'),
    })
  ),
  conditions: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Condition name is required'),
      diagnosedDate: Yup.string().required('Diagnosis date is required'),
      status: Yup.string().required('Status is required'),
    })
  ),
  medications: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Medication name is required'),
      dosage: Yup.string().required('Dosage is required'),
      frequency: Yup.string().required('Frequency is required'),
    })
  ),
});

const MedicalInfoForm = ({ patient, onSave }) => {
  const [openAllergyDialog, setOpenAllergyDialog] = useState(false);
  const [openConditionDialog, setOpenConditionDialog] = useState(false);
  const [openMedicationDialog, setOpenMedicationDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const formik = useFormik({
    initialValues: {
      bloodType: patient?.bloodType || '',
      height: patient?.height?.value || '',
      heightUnit: patient?.height?.unit || 'cm',
      weight: patient?.weight?.value || '',
      weightUnit: patient?.weight?.unit || 'kg',
      allergies: patient?.allergies || [],
      conditions: patient?.conditions || [],
      medications: patient?.medications || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSave({
          ...values,
          height: { value: values.height, unit: values.heightUnit },
          weight: { value: values.weight, unit: values.weightUnit },
        });
        setSnackbar({
          open: true,
          message: 'Medical information updated successfully',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to update medical information',
          severity: 'error',
        });
      }
    },
  });

  const handleAddAllergy = (values, { resetForm }) => {
    formik.setFieldValue('allergies', [...formik.values.allergies, values]);
    setOpenAllergyDialog(false);
    resetForm();
  };

  const handleAddCondition = (values, { resetForm }) => {
    formik.setFieldValue('conditions', [...formik.values.conditions, values]);
    setOpenConditionDialog(false);
    resetForm();
  };

  const handleAddMedication = (values, { resetForm }) => {
    formik.setFieldValue('medications', [...formik.values.medications, values]);
    setOpenMedicationDialog(false);
    resetForm();
  };

  const handleRemoveAllergy = (index) => {
    const newAllergies = [...formik.values.allergies];
    newAllergies.splice(index, 1);
    formik.setFieldValue('allergies', newAllergies);
  };

  const handleRemoveCondition = (index) => {
    const newConditions = [...formik.values.conditions];
    newConditions.splice(index, 1);
    formik.setFieldValue('conditions', newConditions);
  };

  const handleRemoveMedication = (index) => {
    const newMedications = [...formik.values.medications];
    newMedications.splice(index, 1);
    formik.setFieldValue('medications', newMedications);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BloodtypeIcon sx={{ mr: 1 }} />
            Basic Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                id="bloodType"
                name="bloodType"
                label="Blood Type"
                value={formik.values.bloodType}
                onChange={formik.handleChange}
                error={formik.touched.bloodType && Boolean(formik.errors.bloodType)}
                helperText={formik.touched.bloodType && formik.errors.bloodType}
                InputProps={{
                  startAdornment: <BloodtypeIcon color="action" sx={{ mr: 1 }} />,
                }}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  id="height"
                  name="height"
                  label="Height"
                  type="number"
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  error={formik.touched.height && Boolean(formik.errors.height)}
                  helperText={formik.touched.height && formik.errors.height}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HeightIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Select
                  value={formik.values.heightUnit}
                  onChange={(e) => formik.setFieldValue('heightUnit', e.target.value)}
                  size="small"
                  sx={{ minWidth: 80 }}
                >
                  <MenuItem value="cm">cm</MenuItem>
                  <MenuItem value="in">in</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  id="weight"
                  name="weight"
                  label="Weight"
                  type="number"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  error={formik.touched.weight && Boolean(formik.errors.weight)}
                  helperText={formik.touched.weight && formik.errors.weight}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WeightIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Select
                  value={formik.values.weightUnit}
                  onChange={(e) => formik.setFieldValue('weightUnit', e.target.value)}
                  size="small"
                  sx={{ minWidth: 80 }}
                >
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="lbs">lbs</MenuItem>
                </Select>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Allergies Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <MedicalInformationIcon sx={{ mr: 1 }} />
              Allergies
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenAllergyDialog(true)}
            >
              Add Allergy
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {formik.values.allergies.length > 0 ? (
            <Grid container spacing={1}>
              {formik.values.allergies.map((allergy, index) => (
                <Grid item key={index}>
                  <Chip
                    label={`${allergy.name} (${allergy.severity})`}
                    onDelete={() => handleRemoveAllergy(index)}
                    color="error"
                    variant="outlined"
                    deleteIcon={<DeleteIcon />}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No allergies recorded
            </Typography>
          )}
        </Grid>

        {/* Conditions Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospitalIcon sx={{ mr: 1 }} />
              Medical Conditions
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenConditionDialog(true)}
            >
              Add Condition
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {formik.values.conditions.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Condition</TableCell>
                    <TableCell>Diagnosed Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.conditions.map((condition, index) => (
                    <TableRow key={index}>
                      <TableCell>{condition.name}</TableCell>
                      <TableCell>{condition.diagnosedDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={condition.status} 
                          size="small"
                          color={
                            condition.status === 'Active' ? 'error' :
                            condition.status === 'In Remission' ? 'warning' : 'success'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveCondition(index)}
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
            <Typography variant="body2" color="text.secondary">
              No medical conditions recorded
            </Typography>
          )}
        </Grid>

        {/* Medications Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <MedicalServicesIcon sx={{ mr: 1 }} />
              Current Medications
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenMedicationDialog(true)}
            >
              Add Medication
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {formik.values.medications.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Medication</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.medications.map((medication, index) => (
                    <TableRow key={index}>
                      <TableCell>{medication.name}</TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{medication.frequency}</TableCell>
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
            <Typography variant="body2" color="text.secondary">
              No medications recorded
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={formik.isSubmitting}
          >
            Save Medical Information
          </Button>
        </Grid>
      </Grid>

      {/* Dialogs for adding items */}
      <AllergyDialog
        open={openAllergyDialog}
        onClose={() => setOpenAllergyDialog(false)}
        onSubmit={handleAddAllergy}
      />
      <ConditionDialog
        open={openConditionDialog}
        onClose={() => setOpenConditionDialog(false)}
        onSubmit={handleAddCondition}
      />
      <MedicationDialog
        open={openMedicationDialog}
        onClose={() => setOpenMedicationDialog(false)}
        onSubmit={handleAddMedication}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Sub-components for dialogs
const AllergyDialog = ({ open, onClose, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      severity: 'Moderate',
      notes: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Allergy name is required'),
      severity: Yup.string().required('Severity is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmit(values, { resetForm });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Allergy</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Allergy Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  name="severity"
                  value={formik.values.severity}
                  onChange={formik.handleChange}
                  label="Severity"
                >
                  {['Mild', 'Moderate', 'Severe', 'Life-threatening'].map((severity) => (
                    <MenuItem key={severity} value={severity}>
                      {severity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Allergy
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const ConditionDialog = ({ open, onClose, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      diagnosedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      notes: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Condition name is required'),
      diagnosedDate: Yup.string().required('Diagnosis date is required'),
      status: Yup.string().required('Status is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmit(values, { resetForm });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Medical Condition</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Condition Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="diagnosedDate"
                label="Diagnosed Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.diagnosedDate}
                onChange={formik.handleChange}
                error={formik.touched.diagnosedDate && Boolean(formik.errors.diagnosedDate)}
                helperText={formik.touched.diagnosedDate && formik.errors.diagnosedDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  label="Status"
                >
                  {['Active', 'In Remission', 'Resolved'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Condition
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const MedicationDialog = ({ open, onClose, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Medication name is required'),
      dosage: Yup.string().required('Dosage is required'),
      frequency: Yup.string().required('Frequency is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmit(values, { resetForm });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Medication</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
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
                name="dosage"
                label="Dosage"
                value={formik.values.dosage}
                onChange={formik.handleChange}
                error={formik.touched.dosage && Boolean(formik.errors.dosage)}
                helperText={formik.touched.dosage && formik.errors.dosage}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="frequency"
                label="Frequency"
                value={formik.values.frequency}
                onChange={formik.handleChange}
                error={formik.touched.frequency && Boolean(formik.errors.frequency)}
                helperText={formik.touched.frequency && formik.errors.frequency}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="startDate"
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.startDate}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="endDate"
                label="End Date (optional)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.endDate}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Medication
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MedicalInfoForm;
