import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Description as DescriptionIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,

  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Sample data for medical records
const medicalRecords = [
  {
    id: 1,
    name: 'Blood Test Results',
    type: 'pdf',
    date: '2023-05-15',
    doctor: 'Dr. Sarah Johnson',
    category: 'Lab Results',
    size: '2.4 MB',
    description: 'Complete blood count and metabolic panel results.'
  },
  {
    id: 2,
    name: 'X-Ray - Right Arm',
    type: 'image',
    date: '2023-04-22',
    doctor: 'Dr. Michael Chen',
    category: 'Imaging',
    size: '4.7 MB',
    description: 'X-ray of right arm showing healed fracture.'
  },
  {
    id: 3,
    name: 'Prescription - Amoxicillin',
    type: 'document',
    date: '2023-03-10',
    doctor: 'Dr. Emily Wilson',
    category: 'Prescriptions',
    size: '0.8 MB',
    description: 'Antibiotic prescription for sinus infection.'
  },
  {
    id: 4,
    name: 'MRI Brain Scan',
    type: 'image',
    date: '2023-02-28',
    doctor: 'Dr. Robert Taylor',
    category: 'Imaging',
    size: '15.2 MB',
    description: 'MRI scan of the brain showing normal results.'
  },
  {
    id: 5,
    name: 'Annual Physical Report',
    type: 'pdf',
    date: '2023-01-15',
    doctor: 'Dr. Sarah Johnson',
    category: 'Reports',
    size: '3.1 MB',
    description: 'Annual physical examination summary and recommendations.'
  }
];

const categories = [
  'All Categories',
  'Lab Results',
  'Imaging',
  'Prescriptions',
  'Reports',
  'Doctor Notes',
  'Vaccination Records'
];

const MedicalRecordsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, record) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecord(null);
  };

  const handleDownload = () => {
    // Handle download logic here
    console.log('Downloading:', selectedRecord);
    handleMenuClose();
  };

  const handleShare = () => {
    // Handle share logic here
    console.log('Sharing:', selectedRecord);
    handleMenuClose();
  };

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Deleting:', selectedRecord);
    handleMenuClose();
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || 
                          record.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredRecords.length - page * rowsPerPage);

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon color="error" />;
      case 'image':
        return <ImageIcon color="primary" />;
      default:
        return <FileIcon color="action" />;
    }
  };

  return (
    <Box>
      {/* Header and Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">My Medical Records</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadIcon />}
            sx={{ mr: 1 }}
          >
            Upload New
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
          >
            Download All
          </Button>
        </Box>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              variant="outlined"
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon color="action" />
                  </InputAdornment>
                ),
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? 'Grid View' : 'List View'}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Records List */}
      {viewMode === 'list' ? (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredRecords
                ).map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getFileIcon(record.type)}
                        <Box ml={1}>{record.name}</Box>
                      </Box>
                    </TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>
                      <Chip 
                        label={record.category}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.doctor}</TableCell>
                    <TableCell>{record.size}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        aria-controls="record-menu"
                        aria-haspopup="true"
                        onClick={(e) => handleMenuClick(e, record)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRecords.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      ) : (
        // Grid View
        <Grid container spacing={3}>
          {filteredRecords.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getFileIcon(record.type)}
                    <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                      {record.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {record.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    <Chip 
                      icon={<CalendarIcon fontSize="small" />}
                      label={record.date}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      icon={<PersonIcon fontSize="small" />}
                      label={record.doctor}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={record.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <Box p={2} bgcolor="action.hover">
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        size="small"
                        startIcon={<DownloadIcon fontSize="small" />}
                      >
                        Download
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        size="small"
                        startIcon={<DescriptionIcon fontSize="small" />}
                      >
                        View
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          p={6}
          textAlign="center"
        >
          <DescriptionIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No medical records found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm || selectedCategory !== 'All Categories' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Upload your first medical record to get started.'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadIcon />}
            sx={{ mt: 2 }}
          >
            Upload Medical Record
          </Button>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        id="record-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download" />
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Share" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ color: 'error' }} />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MedicalRecordsTab;
