import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import {
  AppBar, Toolbar, Typography, Container, Grid, Button,
  Slider, Card, CardContent, CardHeader, Box, CircularProgress,
  LinearProgress, Divider, Alert, Snackbar, Tabs, Tab, Fade,
  Paper, Chip, IconButton, TextField, Stack, Switch, FormControlLabel
} from '@mui/material';
import {
  CloudUpload, Delete, CheckCircle, Cancel, Compare, Refresh,
  Settings, BugReport, List, Info, LinkOff, Link, SettingsBackupRestore,
  History, Description, SwapHoriz, DoneAll, Warning
} from '@mui/icons-material';

// Custom color theme
const colors = {
  primary: {
    main: '#4A55A2',
    light: '#7895CB',
    dark: '#33407A',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#A0BFE0',
    light: '#C5DFF8',
    dark: '#7895CB',
    contrastText: '#333333'
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF'
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
    contrastText: '#FFFFFF'
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#333333'
  },
  background: {
    paper: '#FFFFFF',
    default: '#F5F5F5',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
  }
};

// Component to handle file dropzone with animation
const SignatureDropzone = ({ onDrop, file, preview, canvasRef, onClear, disabled, label }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false,
    onDrop
  });
  
  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: isDragActive ? `2px dashed ${colors.primary.main}` : 'none',
      }}
    >
      <CardHeader 
        title={label}
        sx={{ 
          backgroundColor: colors.primary.main, 
          color: colors.primary.contrastText,
          py: 1.5,
        }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box
          sx={{
            height: 220,
            mb: 2,
            border: `1px solid ${colors.secondary.main}`,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: isDragActive ? 'rgba(74, 85, 162, 0.05)' : '#FAFAFA',
            transition: 'all 0.2s ease',
          }}
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={220}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              borderRadius: '8px'
            }}
          />
          
          {!preview && (
            <Fade in={!preview}>
              <Box
                {...getRootProps()}
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(74, 85, 162, 0.05)',
                  }
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload 
                  fontSize="large" 
                  sx={{ 
                    color: colors.primary.main,
                    fontSize: '48px',
                    mb: 1,
                    transition: 'transform 0.3s ease',
                    transform: isDragActive ? 'scale(1.2)' : 'scale(1)',
                  }} 
                />
                <Typography variant="body1" color="primary" align="center" sx={{ fontWeight: 500 }}>
                  {isDragActive ? 'Drop signature here' : 'Drag & drop a signature image'}
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 0.5 }}>
                  or click to select
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<CloudUpload />}
            {...getRootProps()}
            disabled={disabled}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0px 4px 8px rgba(74, 85, 162, 0.2)'
              }
            }}
          >
            <input {...getInputProps()} />
            Upload
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={onClear}
            disabled={!file || disabled}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Clear
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
function Sign() {
  // States
  const [apiUrl, setApiUrl] = useState('https://23de-153-104-35-32.ngrok-free.app');
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [threshold, setThreshold] = useState(0.10);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [detailedLogs, setDetailedLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [historicalResults, setHistoricalResults] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  
  // Add a log entry
  const addLog = (message, type = 'info') => {
    setDetailedLogs(prevLogs => [
      ...prevLogs, 
      { 
        timestamp: new Date().toLocaleTimeString(), 
        message, 
        type 
      }
    ]);
  };

  // Check API status on component mount
  useEffect(() => {
   // In the checkApiStatus function in sign.jsx
   const checkApiStatus = async () => {
    try {
      addLog(`Connecting to API at ${apiUrl}...`);
      const response = await axios.get(`${apiUrl}/api/health`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      // Log the complete response for debugging
      console.log("Complete API response:", JSON.stringify(response.data));
      addLog(`Raw API response: ${JSON.stringify(response.data)}`, 'info');
      
      if (response.data.status === 'ok' && response.data.model_loaded === true) {
        setApiStatus('connected');
        addLog('API connection successful', 'success');
        // Additional logging
      } else {
        setApiStatus('error');
        const reason = response.data.model_error || 'Unknown reason';
        addLog(`API running but model not loaded: ${reason}`, 'warning');
        // Additional logging
      }
    } catch (error) {
      // Error handling
    }
  };
    checkApiStatus();
  }, [apiUrl]);

  // Process signature 1 upload
  const handleSignature1Drop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSignature1(file);
    addLog(`Signature 1 uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info');
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview1(e.target.result);
      
      // Draw image on canvas
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef1.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling to fit while preserving aspect ratio
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        ) * 0.9; // 90% to add some margin
        
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        
        // Center image on canvas
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        // Draw image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        addLog(`Signature 1 processed: ${scaledWidth.toFixed(0)}×${scaledHeight.toFixed(0)} px`);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  // Process signature 2 upload
  const handleSignature2Drop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSignature2(file);
    addLog(`Signature 2 uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info');
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview2(e.target.result);
      
      // Draw image on canvas
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef2.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling to fit while preserving aspect ratio
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        ) * 0.9;
        
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        
        // Center image on canvas
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        // Draw image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        addLog(`Signature 2 processed: ${scaledWidth.toFixed(0)}×${scaledHeight.toFixed(0)} px`);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  // Clear signature
  const clearSignature = (num) => {
    if (num === 1) {
      setSignature1(null);
      setPreview1(null);
      const canvas = canvasRef1.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      addLog('Signature 1 cleared');
    } else {
      setSignature2(null);
      setPreview2(null);
      const canvas = canvasRef2.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      addLog('Signature 2 cleared');
    }
  };
  
  // Verify signatures
  const verifySignatures = async () => {
    if (!signature1 || !signature2) {
      setSnackbar({
        open: true,
        message: 'Please upload both signatures',
        severity: 'warning'
      });
      return;
    }

    setVerifying(true);
    setResult(null);
    setDetailedLogs([]); // Clear logs for new verification
    addLog('Starting verification process...', 'info');

    try {
      // Get data URLs from canvases
      const canvas1 = canvasRef1.current;
      const canvas2 = canvasRef2.current;
      const dataUrl1 = canvas1.toDataURL('image/png');
      const dataUrl2 = canvas2.toDataURL('image/png');
      
      // Check if data URLs are identical
      const isDifferent = dataUrl1 !== dataUrl2;
      addLog(`Images are ${isDifferent ? 'different' : 'identical'}`, isDifferent ? 'info' : 'warning');
      
      if (!isDifferent) {
        addLog('Warning: You uploaded identical images', 'warning');
      }

      // Send to API
      addLog(`Sending request to API (threshold: ${threshold.toFixed(2)})`, 'info');
      
      const response = await axios.post(`${apiUrl}/api/verify`, 
        {
            signature1: dataUrl1,
            signature2: dataUrl2,
            threshold: threshold
          },
          {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          }
        );

      // Handle result
      addLog(`Received response: similarity score ${response.data.similarity.toFixed(4)}`, 'info');
      setResult(response.data);
      
      // Add to historical results
      const newHistoricalResult = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        similarity: response.data.similarity,
        authentic: response.data.authentic,
        threshold: response.data.threshold
      };
      
      setHistoricalResults(prev => [newHistoricalResult, ...prev].slice(0, 10));
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Verification complete: ${response.data.authentic ? 'MATCH' : 'NO MATCH'}`,
        severity: response.data.authentic ? 'success' : 'info'
      });
    } catch (error) {
      console.error('Verification error:', error);
      
      addLog(`Error during verification: ${error.message}`, 'error');
      if (error.response) {
        addLog(`Server response: ${JSON.stringify(error.response.data)}`, 'error');
      }
      
      setSnackbar({
        open: true,
        message: `Error: ${error.response?.data?.error || error.message}`,
        severity: 'error'
      });
      
      // Show logs automatically on error
      setShowLogs(true);
    } finally {
      setVerifying(false);
      addLog('Verification process completed', 'info');
    }
  };
  
  // Reset the entire form
  const resetForm = () => {
    clearSignature(1);
    clearSignature(2);
    setThreshold(0.47);
    setResult(null);
    setDetailedLogs([]);
    addLog('Form reset', 'info');
  };
  
  // Handle test connection
  const testConnection = async () => {
    setApiStatus('checking');
    addLog(`Testing connection to ${apiUrl}...`);
    
    try {
        const response = await axios.get(`${apiUrl}/api/health`, {
            headers: {
              'ngrok-skip-browser-warning': 'true'
            }
          });      if (response.data.status === 'ok' && response.data.model_loaded) {
        setApiStatus('connected');
        addLog('Connection test successful', 'success');
        setSnackbar({
          open: true,
          message: 'Successfully connected to API',
          severity: 'success'
        });
      } else {
        setApiStatus('error');
        addLog('API running but model not loaded', 'warning');
        setSnackbar({
          open: true,
          message: 'API is running but model is not loaded',
          severity: 'warning'
        });
      }
    } catch (error) {
      setApiStatus('error');
      addLog(`Connection test failed: ${error.message}`, 'error');
      setSnackbar({
        open: true,
        message: 'Failed to connect to API',
        severity: 'error'
      });
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="App" style={{ 
      backgroundColor: darkMode ? '#121212' : colors.background.default,
      minHeight: '100vh',
      color: darkMode ? '#FFFFFF' : colors.text.primary,
      transition: 'background-color 0.3s ease'
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: darkMode ? '#1E1E1E' : colors.primary.main,
          borderBottom: `1px solid ${darkMode ? '#333' : 'transparent'}`
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DoneAll sx={{ mr: 1.5, fontSize: 28 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              SignCheck
            </Typography>
            <Typography 
              variant="subtitle2" 
              component="div" 
              sx={{ 
                ml: 1, 
                bgcolor: 'rgba(255,255,255,0.15)', 
                px: 1, 
                py: 0.5, 
                borderRadius: 1,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Signature Verification
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={apiStatus === 'connected' ? <Link /> : apiStatus === 'checking' ? <Refresh /> : <LinkOff />}
              label={apiStatus === 'connected' ? 'Connected' : apiStatus === 'checking' ? 'Connecting...' : 'Disconnected'}
              color={apiStatus === 'connected' ? 'success' : apiStatus === 'checking' ? 'warning' : 'error'}
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(255,255,255,0.3)',
                '& .MuiChip-label': { color: 'white' },
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            <IconButton 
              color="inherit" 
              onClick={() => setSettingsOpen(!settingsOpen)}
              size="small"
            >
              <Settings />
            </IconButton>
            <FormControlLabel
              control={
                <Switch 
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  size="small"
                  sx={{ 
                    ml: 1,
                    '& .MuiSwitch-thumb': {
                      backgroundColor: darkMode ? '#FFFFFF' : '#1E1E1E'
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                    }
                  }}
                />
              }
              label={<Typography variant="body2">Dark</Typography>}
              sx={{ ml: 0.5 }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 4, 
          mb: 8,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Settings Panel */}
        <Fade in={settingsOpen}>
          <Box>
            {settingsOpen && (
              <Paper 
                elevation={darkMode ? 1 : 3} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#1E1E1E' : '#FFFFFF',
                  border: darkMode ? '1px solid #333' : 'none',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Settings fontSize="small" sx={{ mr: 1 }} /> API Configuration
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setSettingsOpen(false)}
                    sx={{ color: darkMode ? '#AAAAAA' : '#666666' }}
                  >
                    <Cancel fontSize="small" />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="API URL"
                      variant="outlined"
                      size="small"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      InputProps={{
                        sx: { 
                          borderRadius: '8px',
                          backgroundColor: darkMode ? '#333' : 'white',
                          color: darkMode ? 'white' : 'inherit'
                        }
                      }}
                      InputLabelProps={{
                        sx: { color: darkMode ? '#AAA' : 'inherit' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button 
                      variant="contained" 
                      color={apiStatus === 'connected' ? 'success' : 'primary'}
                      onClick={testConnection}
                      startIcon={<Refresh />}
                      disableElevation
                      fullWidth
                      sx={{ 
                        borderRadius: '8px', 
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      Test Connection
                    </Button>
                  </Grid>
                </Grid>
                
                <Alert 
                  severity={apiStatus === 'connected' ? 'success' : apiStatus === 'checking' ? 'info' : 'error'} 
                  sx={{ mt: 2, borderRadius: '8px' }}
                  variant="outlined"
                >
                  {apiStatus === 'connected' 
                    ? 'Successfully connected to the signature verification service.' 
                    : apiStatus === 'checking' 
                    ? 'Checking connection to API...'
                    : 'Cannot connect to the signature verification service. Please check the URL and ensure the server is running.'}
                </Alert>
              </Paper>
            )}
          </Box>
        </Fade>
        
        {/* Main Title */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: darkMode ? 'white' : colors.primary.main
            }}
          >
            Signature Verification System
          </Typography>
          <Typography 
            variant="body1" 
            color={darkMode ? 'rgba(255,255,255,0.7)' : 'textSecondary'}
          >
            Upload two signature images to check if they're from the same person
          </Typography>
        </Box>
        
        {/* Tabs */}
        <Paper 
          elevation={darkMode ? 1 : 3} 
          sx={{ 
            borderRadius: 2, 
            mb: 4,
            overflow: 'hidden',
            backgroundColor: darkMode ? '#1E1E1E' : '#FFFFFF',
            border: darkMode ? '1px solid #333' : 'none',
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              backgroundColor: darkMode ? '#333' : colors.primary.light,
              '& .MuiTab-root': {
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)',
                textTransform: 'none',
                fontWeight: 500,
                py: 2
              },
              '& .Mui-selected': {
                color: '#FFFFFF',
                fontWeight: 600
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFFFFF',
                height: 3
              }
            }}
          >
            <Tab icon={<Compare sx={{ mr: 1 }} />} label="Verify Signatures" iconPosition="start" />
            <Tab icon={<History sx={{ mr: 1 }} />} label="History" iconPosition="start" />
            <Tab icon={<BugReport sx={{ mr: 1 }} />} label="Debug" iconPosition="start" />
          </Tabs>
          
          {/* Verification Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Signature Dropzones */}
                <Grid item xs={12} md={6}>
                  <SignatureDropzone
                    onDrop={handleSignature1Drop}
                    file={signature1}
                    preview={preview1}
                    canvasRef={canvasRef1}
                    onClear={() => clearSignature(1)}
                    disabled={verifying}
                    label="Reference Signature"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SignatureDropzone
                    onDrop={handleSignature2Drop}
                    file={signature2}
                    preview={preview2}
                    canvasRef={canvasRef2}
                    onClear={() => clearSignature(2)}
                    disabled={verifying}
                    label="Test Signature"
                  />
                </Grid>
                
                {/* Threshold & Verification Controls */}
                <Grid item xs={12}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 2, 
                      border: `1px solid ${darkMode ? '#333' : colors.secondary.main}`,
                      backgroundColor: darkMode ? '#1E1E1E' : 'white'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: darkMode ? 'white' : 'inherit' }}>
                        Verification Threshold
                      </Typography>
                      <Box sx={{ px: 2, pb: 1 }}>
                        <Slider
                          value={threshold}
                          onChange={(_, newValue) => setThreshold(newValue)}
                          aria-labelledby="threshold-slider"
                          valueLabelDisplay="auto"
                          step={0.01}
                          marks={[
                            { value: 0, label: '0' },
                            { value: 0.25, label: '0.25' },
                            { value: 0.5, label: '0.5' },
                            { value: 0.75, label: '0.75' },
                            { value: 1, label: '1' }
                          ]}
                          min={0}
                          max={1}
                          disabled={verifying}
                          sx={{
                            color: colors.primary.main,
                            '& .MuiSlider-valueLabel': {
                              backgroundColor: colors.primary.main
                            },
                            '& .MuiSlider-markLabel': {
                              color: darkMode ? '#AAA' : 'inherit'
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                        <Info fontSize="small" sx={{ color: darkMode ? '#AAA' : colors.text.secondary, mr: 1 }} />
                        <Typography variant="body2" color={darkMode ? '#AAA' : 'textSecondary'}>
                          Current threshold: <b>{threshold.toFixed(2)}</b> — Higher values require more similarity for a match
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2, borderColor: darkMode ? '#333' : 'rgba(0,0,0,0.1)' }} />
                      
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          disableElevation
                          fullWidth
                          startIcon={verifying ? <CircularProgress size={20} color="inherit" /> : <Compare />}
                          onClick={verifySignatures}
                          disabled={!signature1 || !signature2 || verifying || apiStatus !== 'connected'}
                          sx={{ 
                            borderRadius: '8px',
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: '0px 4px 8px rgba(74, 85, 162, 0.2)'
                            }
                          }}
                        >
                          {verifying ? 'Verifying...' : 'Verify Signatures'}
                        </Button>
                        
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<SettingsBackupRestore />}
                          onClick={resetForm}
                          disabled={verifying}
                          sx={{ 
                            borderRadius: '8px',
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: 'rgba(74, 85, 162, 0.05)'
                            }
                          }}
                        >
                          Reset
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Results Section */}
                {result && (
                  <Grid item xs={12}>
                    <Fade in={!!result}>
                      <Card 
                        elevation={3}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: `2px solid ${result.authentic ? colors.success.main : colors.error.main}`,
                          backgroundColor: darkMode 
                            ? (result.authentic ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)') 
                            : (result.authentic ? 'rgba(76, 175, 80, 0.05)' : 'rgba(244, 67, 54, 0.05)'),
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Box 
                          sx={{ 
                            bgcolor: result.authentic ? colors.success.main : colors.error.main,
                            py: 2,
                            px: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                          }}
                        >
                          {result.authentic ? (
                            <CheckCircle fontSize="large" sx={{ color: 'white' }} />
                          ) : (
                            <Cancel fontSize="large" sx={{ color: 'white' }} />
                          )}
                          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                            {result.authentic ? 'Signatures Match' : 'Signatures Do Not Match'}
                          </Typography>
                        </Box>
                        
                        <CardContent sx={{ p: 3 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Box>
                                <Typography variant="h6" gutterBottom sx={{ color: darkMode ? 'white' : 'inherit' }}>
                                  Similarity Score
                                </Typography>
                                <Box sx={{ mt: 2, mb: 3 }}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    mb: 1 
                                  }}>
                                    <Typography variant="body2" color={darkMode ? '#AAA' : 'textSecondary'}>
                                      0
                                    </Typography>
                                    <Typography 
                                      variant="h4" 
                                      sx={{ 
                                        color: result.authentic ? colors.success.main : colors.error.main, 
                                        fontWeight: 600 
                                      }}
                                    >
                                      {result.similarity.toFixed(4)}
                                    </Typography>
                                    <Typography variant="body2" color={darkMode ? '#AAA' : 'textSecondary'}>
                                      1
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={result.similarity * 100}
                                    color={result.authentic ? "success" : "error"}
                                    sx={{ 
                                      height: 10, 
                                      borderRadius: 5, 
                                      mb: 1,
                                      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                    }}
                                  />
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center'
                                  }}>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: 0.5,
                                      color: darkMode ? '#AAA' : 'textSecondary'
                                    }}>
                                      <Typography variant="caption">Threshold</Typography>
                                      <Chip 
                                        label={result.threshold.toFixed(2)} 
                                        size="small" 
                                        sx={{ 
                                          fontSize: '0.7rem',
                                          height: 20,
                                          bgcolor: darkMode ? '#333' : 'rgba(0,0,0,0.05)',
                                          color: darkMode ? '#FFF' : 'inherit'
                                        }} 
                                      />
                                    </Box>
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        color: darkMode ? '#AAA' : 'textSecondary',
                                        fontStyle: 'italic'
                                      }}
                                    >
                                      Higher is more similar
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <Box>
                                <Typography variant="h6" gutterBottom sx={{ color: darkMode ? 'white' : 'inherit' }}>
                                  Verification Details
                                </Typography>
                                <Paper 
                                  elevation={0} 
                                  sx={{ 
                                    p: 2, 
                                    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                    borderRadius: 2,
                                    border: `1px solid ${darkMode ? '#333' : 'rgba(0,0,0,0.05)'}`,
                                  }}
                                >
                                  <Typography sx={{ color: darkMode ? 'white' : 'inherit' }}>
                                    {result.authentic
                                      ? 'The system has determined that these signatures are likely from the same person.'
                                      : 'The system has determined that these signatures are likely from different people or one may be forged.'
                                    }
                                  </Typography>
                                  
                                  {result.inputs_different === false && (
                                    <Alert 
                                      severity="warning" 
                                      variant="outlined"
                                      icon={<Warning />}
                                      sx={{ 
                                        mt: 2, 
                                        borderRadius: '8px',
                                        backgroundColor: darkMode ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)'
                                      }}
                                    >
                                      The system detected that the input images were identical or very similar.
                                    </Alert>
                                  )}
                                </Paper>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          
          {/* History Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: darkMode ? 'white' : 'inherit' }}>
                Verification History
              </Typography>
              
              {historicalResults.length === 0 ? (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                    border: `1px solid ${darkMode ? '#333' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <History sx={{ fontSize: 48, color: darkMode ? '#AAA' : 'rgba(0,0,0,0.2)', mb: 2 }} />
                  <Typography sx={{ color: darkMode ? '#AAA' : 'textSecondary' }}>
                    No verification history yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#888' : 'textSecondary', mt: 1 }}>
                    Complete a verification to see results here
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  {historicalResults.map((item, index) => (
                    <Paper 
                      key={item.id}
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2,
                        backgroundColor: darkMode ? '#1E1E1E' : 'white',
                        border: `1px solid ${darkMode ? '#333' : colors.secondary.light}`,
                      }}
                    >
                      <Box 
                        sx={{ 
                          p: 1.5,
                          borderRadius: '50%',
                          display: 'flex',
                          mr: 2,
                          backgroundColor: item.authentic 
                            ? (darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.1)')
                            : (darkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.1)')
                        }}
                      >
                        {item.authentic ? (
                          <CheckCircle sx={{ color: colors.success.main }} />
                        ) : (
                          <Cancel sx={{ color: colors.error.main }} />
                        )}
                      </Box>
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 500,
                            color: darkMode ? 'white' : 'inherit'
                          }}
                        >
                          {item.authentic ? 'Signatures Match' : 'Signatures Do Not Match'}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: darkMode ? '#AAA' : 'textSecondary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexWrap: 'wrap'
                          }}
                        >
                          <span>Timestamp: {item.timestamp}</span>
                          <span>•</span>
                          <span>Similarity: {item.similarity.toFixed(4)}</span>
                          <span>•</span>
                          <span>Threshold: {item.threshold.toFixed(2)}</span>
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}
          
          {/* Debug Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: darkMode ? 'white' : 'inherit' }}>
                  Debug Logs
                </Typography>
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={() => setDetailedLogs([])}
                  disabled={detailedLogs.length === 0}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  Clear Logs
                </Button>
              </Box>
              
              <Paper 
                elevation={0}
                sx={{ 
                  maxHeight: '500px', 
                  overflowY: 'auto',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: darkMode ? '#121212' : '#f8f9fa',
                  border: `1px solid ${darkMode ? '#333' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                {detailedLogs.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Description sx={{ fontSize: 48, color: darkMode ? '#444' : 'rgba(0,0,0,0.1)', mb: 2 }} />
                    <Typography color={darkMode ? '#777' : 'textSecondary'}>
                      No logs available
                    </Typography>
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      lineHeight: 1.7
                    }}
                  >
                    {detailedLogs.map((log, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          py: 0.5,
                          pl: 1,
                          borderLeft: `3px solid ${
                            log.type === 'error' ? colors.error.main : 
                            log.type === 'warning' ? colors.warning.main :
                            log.type === 'success' ? colors.success.main :
                            darkMode ? '#555' : colors.secondary.light
                          }`,
                          mb: 0.5,
                          color: log.type === 'error' ? (darkMode ? '#ff8a80' : colors.error.main) : 
                                log.type === 'warning' ? (darkMode ? '#ffcc80' : colors.warning.main) :
                                log.type === 'success' ? (darkMode ? '#a5d6a7' : colors.success.main) :
                                (darkMode ? '#BBB' : colors.text.primary),
                          backgroundColor: darkMode ? '#1A1A1A' : 'rgba(0,0,0,0.02)',
                          borderRadius: '0 4px 4px 0',
                          wordBreak: 'break-word'
                        }}
                      >
                        <span style={{ color: darkMode ? '#777' : '#999', marginRight: '8px' }}>
                          [{log.timestamp}]
                        </span>
                        {log.message}
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: darkMode ? 'white' : 'inherit' }}>
                  System Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: darkMode ? '#1E1E1E' : 'white',
                        border: `1px solid ${darkMode ? '#333' : colors.secondary.light}`,
                        height: '100%'
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#AAA' : 'textSecondary' }}>
                        API Status
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: darkMode ? 'white' : 'inherit'
                        }}
                      >
                        <Box 
                          component="span" 
                          sx={{ 
                            width: 10, 
                            height: 10, 
                            borderRadius: '50%', 
                            bgcolor: apiStatus === 'connected' 
                              ? colors.success.main 
                              : apiStatus === 'checking' 
                              ? colors.warning.main 
                              : colors.error.main,
                            mr: 1,
                            display: 'inline-block'
                          }} 
                        />
                        {apiStatus === 'connected' 
                          ? 'Connected to API' 
                          : apiStatus === 'checking' 
                          ? 'Checking connection...' 
                          : 'Disconnected'}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: darkMode ? '#AAA' : 'textSecondary',
                          mt: 1,
                          wordBreak: 'break-all'
                        }}
                      >
                        URL: {apiUrl}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: darkMode ? '#1E1E1E' : 'white',
                        border: `1px solid ${darkMode ? '#333' : colors.secondary.light}`,
                        height: '100%'
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom sx={{ color: darkMode ? '#AAA' : 'textSecondary' }}>
                        Verification Settings
                      </Typography>
                      <Typography 
                        variant="body1" 
                        gutterBottom
                        sx={{ color: darkMode ? 'white' : 'inherit' }}
                      >
                        Current Threshold: <b>{threshold.toFixed(2)}</b>
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#AAA' : 'textSecondary' }}>
                        Image processing: Grayscale → Binarize → Crop → Resize → Normalize
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? '#777' : 'textSecondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <SwapHoriz fontSize="small" />
            Powered by a Siamese Neural Network trained on signature data
          </Typography>
        </Box>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Sign;