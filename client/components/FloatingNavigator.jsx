import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import DifferenceIcon from '@mui/icons-material/Difference';
import GroupWorkIcon from '@mui/icons-material/GroupWork';


const defaultTheme = createTheme();

const actions = [
  { icon: <DifferenceIcon />, name: 'imoprt mon', path: '/landing' },
  { icon: <GroupWorkIcon />, name: 'imoprt team', path: '/landing' },


];

export default function FloatingNavigator() {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <ThemeProvider theme={theme}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "relative", bottom: 16, right: 16 }}
        direction='left'
        FabProps={{
          sx: {
            bgcolor: theme.palette.primary.main, // Set the background color of the Fab
            '&:hover': {
              bgcolor: 'darkgrey', // Set the hover background color of the Fab
            }
          }
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleNavigation(action.path)}
          />
        ))}
      </SpeedDial>
    </ThemeProvider>
  );
}