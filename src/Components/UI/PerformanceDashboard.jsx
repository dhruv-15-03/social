

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import BugReportIcon from '@mui/icons-material/BugReport';
import { PerformanceUtils } from '../hooks/usePerformanceMonitor';

const PerformanceDashboard = React.memo(() => {
  const [metrics, setMetrics] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const updateMetrics = useCallback(() => {
    if (isMonitoring) {
      const currentMetrics = PerformanceUtils.getAllMetrics();
      setMetrics(currentMetrics);
    }
  }, [isMonitoring]);

  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [updateMetrics, refreshInterval]);

  const calculatePerformanceScore = useCallback(() => {
    if (!metrics) return 0;

    let score = 100;
    const components = Object.values(metrics.components);
    
    components.forEach(component => {
      const avgRenderTime = component.totalTime / component.count;
      if (avgRenderTime > 16) score -= 10; 
      if (avgRenderTime > 50) score -= 20; 
    });

    score -= Math.min(metrics.errors.length * 5, 30);

    const slowInteractions = metrics.interactions.filter(i => i.latency > 100);
    score -= Math.min(slowInteractions.length * 3, 20);

    return Math.max(score, 0);
  }, [metrics]);

  const formatMemory = (bytes) => {
    if (!bytes) return '0 MB';
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleClearMetrics = useCallback(() => {
    PerformanceUtils.clearMetrics();
    updateMetrics();
  }, [updateMetrics]);

  const handleExportReport = useCallback(() => {
    PerformanceUtils.exportReport();
  }, []);

  if (!metrics) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Performance Dashboard
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  const performanceScore = calculatePerformanceScore();
  const componentCount = Object.keys(metrics.components).length;
  const totalRenders = Object.values(metrics.components).reduce((sum, comp) => sum + comp.count, 0);
  const avgMemory = metrics.memory.length > 0 
    ? metrics.memory.reduce((sum, m) => sum + m.used, 0) / metrics.memory.length 
    : 0;

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          🚀 Performance Dashboard
        </Typography>
        <Box display="flex" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={isMonitoring}
                onChange={(e) => setIsMonitoring(e.target.checked)}
              />
            }
            label="Live Monitoring"
          />
          <Button onClick={handleClearMetrics} variant="outlined" size="small">
            Clear Data
          </Button>
          <Button onClick={handleExportReport} variant="contained" size="small">
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Performance Score */}
      <Card sx={{ mb: 3, background: performanceScore > 80 ? '#e8f5e8' : performanceScore > 60 ? '#fff3cd' : '#f8d7da' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <SpeedIcon fontSize="large" />
            <Box>
              <Typography variant="h3" component="div">
                {performanceScore}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Performance Score
              </Typography>
            </Box>
            <Box ml="auto">
              <Chip 
                label={performanceScore > 80 ? 'Excellent' : performanceScore > 60 ? 'Good' : 'Needs Improvement'} 
                color={performanceScore > 80 ? 'success' : performanceScore > 60 ? 'warning' : 'error'}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <SpeedIcon color="primary" />
                <Typography variant="h6">{componentCount}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Monitored Components
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <MemoryIcon color="secondary" />
                <Typography variant="h6">{totalRenders}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Renders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <NetworkCheckIcon color="success" />
                <Typography variant="h6">{formatMemory(avgMemory)}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Avg Memory Usage
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <BugReportIcon color="error" />
                <Typography variant="h6">{metrics.errors.length}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Recent Errors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Metrics */}
      <Grid container spacing={3}>
        {/* Component Renders */}
        <Grid item xs={12} lg={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Component Performance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell align="right">Renders</TableCell>
                      <TableCell align="right">Avg Time (ms)</TableCell>
                      <TableCell align="right">Max Time (ms)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(metrics.components).map(([name, data]) => (
                      <TableRow key={name}>
                        <TableCell component="th" scope="row">
                          {name}
                        </TableCell>
                        <TableCell align="right">{data.count}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={(data.totalTime / data.count).toFixed(2)}
                            size="small"
                            color={data.totalTime / data.count > 16 ? 'error' : 'success'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {data.maxTime.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Recent Interactions */}
        <Grid item xs={12} lg={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Recent Interactions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Component</TableCell>
                      <TableCell align="right">Latency (ms)</TableCell>
                      <TableCell align="right">Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.interactions.slice(-10).map((interaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{interaction.type}</TableCell>
                        <TableCell>{interaction.component}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={interaction.latency.toFixed(2)}
                            size="small"
                            color={interaction.latency > 100 ? 'error' : 'success'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {new Date(interaction.timestamp).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Memory Usage */}
        <Grid item xs={12} lg={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Memory Usage</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {metrics.memory.slice(-5).map((mem, index) => (
                <Box key={index} mb={1}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2">
                      {new Date(mem.timestamp).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2">
                      {formatMemory(mem.used)} / {formatMemory(mem.total)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(mem.used / mem.total) * 100}
                    color={mem.used / mem.total > 0.8 ? 'error' : mem.used / mem.total > 0.6 ? 'warning' : 'success'}
                  />
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Network Requests */}
        <Grid item xs={12} lg={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Network Activity</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>URL</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell align="right">Duration (ms)</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.network.slice(-10).map((req, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {req.url.length > 30 ? `...${req.url.slice(-27)}` : req.url}
                        </TableCell>
                        <TableCell>{req.method}</TableCell>
                        <TableCell align="right">{req.duration.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={req.status}
                            size="small"
                            color={req.success ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Optimization Recommendations */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 Optimization Recommendations
          </Typography>
          {performanceScore > 90 && (
            <Typography variant="body2" color="success.main">
              ✅ Excellent performance! Your application is well-optimized.
            </Typography>
          )}
          {performanceScore <= 90 && performanceScore > 70 && (
            <Box>
              <Typography variant="body2" color="warning.main">
                ⚠️ Good performance with room for improvement:
              </Typography>
              <ul>
                <li>Consider implementing virtual scrolling for long lists</li>
                <li>Add more component memoization where needed</li>
                <li>Optimize heavy computation with useMemo</li>
              </ul>
            </Box>
          )}
          {performanceScore <= 70 && (
            <Box>
              <Typography variant="body2" color="error.main">
                🚨 Performance issues detected:
              </Typography>
              <ul>
                <li>Several components have slow render times</li>
                <li>Consider code splitting for better initial load</li>
                <li>Implement lazy loading for images and heavy components</li>
                <li>Review and optimize expensive operations</li>
              </ul>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';

export default PerformanceDashboard;
