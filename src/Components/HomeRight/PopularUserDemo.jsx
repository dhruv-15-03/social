import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PopularUser from './PopularUser';

/**
 * Demo component to showcase PopularUser with different name lengths
 * This helps test the professional layout improvements
 */
const PopularUserDemo = () => {
  // Test data with various name lengths and scenarios
  const testUsers = [
    {
      id: 1,
      name: "John Doe",
      userName: "johndoe",
      profilePicture: null,
      mutualFollowers: 5
    },
    {
      id: 2,
      name: "Alexandria Victoria Constantinopoulos-Henderson",
      userName: "alex_victoria_const_henderson_2024",
      profilePicture: null,
      mutualFollowers: 12
    },
    {
      id: 3,
      name: "Mohammed Abdullah Al-Rashid bin Sultan",
      userName: "mohammed_abdullah_al_rashid_bin_sultan_official",
      profilePicture: "https://via.placeholder.com/150",
      mutualFollowers: 1
    },
    {
      id: 4,
      name: "Dr. Christopher Emmanuel Montgomery-Williams III",
      userName: "dr_christopher_emmanuel_montgomery_williams_third",
      profilePicture: null,
      mutualFollowers: 25
    },
    {
      id: 5,
      name: "Ana",
      userName: "ana",
      profilePicture: "https://via.placeholder.com/150",
      mutualFollowers: 3
    },
    {
      id: 6,
      name: "Bartholomew Fitzgerald O'Sullivan-MacReynolds",
      userName: "bartholomew_fitzgerald_osullivan_macreynolds_esquire",
      profilePicture: null,
      mutualFollowers: 8
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 400 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        🔧 Popular User Layout Test
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Testing the professional follow button layout with various name lengths:
      </Typography>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>
          Professional Features:
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✅ <strong>Text Truncation:</strong> Long names get ellipsis (...)
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✅ <strong>Fixed Button Width:</strong> 90px consistent follow button
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✅ <strong>Responsive Layout:</strong> Components maintain position
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✅ <strong>Hover Effects:</strong> Professional animations and feedback
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✅ <strong>Accessibility:</strong> Full text on hover (title attribute)
          </Typography>
          <Typography variant="body2">
            ✅ <strong>Consistent Height:</strong> 80px minimum height for alignment
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 600 }}>
          Test Cases:
        </Typography>
        
        {testUsers.map((user, index) => (
          <Box key={user.id} sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Case {index + 1}: {user.name.length > 20 ? 'Long Name' : user.name.length > 10 ? 'Medium Name' : 'Short Name'} 
              ({user.name.length} chars)
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 1, 
                mb: 2,
                '&:hover': {
                  boxShadow: 2,
                  transition: 'box-shadow 0.2s ease-in-out'
                }
              }}
            >
              <PopularUser item={user} />
            </Paper>
          </Box>
        ))}
      </Box>

      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mt: 3, 
          backgroundColor: 'success.light', 
          color: 'success.contrastText' 
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          🎯 Professional Solution Implemented:
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          • Fixed layout prevents button displacement<br/>
          • Text truncation handles long names gracefully<br/>
          • Consistent spacing and professional styling<br/>
          • Responsive design maintains usability<br/>
          • Enhanced user experience with smooth animations
        </Typography>
      </Paper>
    </Box>
  );
};

export default PopularUserDemo;
