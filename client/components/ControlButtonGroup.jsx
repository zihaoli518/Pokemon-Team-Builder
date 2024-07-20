import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Grow from '@mui/material/Grow';
import FormControlLabel from '@mui/material/FormControlLabel';
import DifferenceIcon from '@mui/icons-material/Difference';
import GroupWorkIcon from '@mui/icons-material/GroupWork';


import AllSavedTeams from './AllSavedTeams.jsx';
import ImportActionFloatingButton from './ImportActionFloatingButton.jsx';




const actions = [
  { icon: <DifferenceIcon />, name: 'imoprt mon', path: '/landing' },
  { icon: <GroupWorkIcon />, name: 'imoprt team', path: '/landing' },


];

export default function ControlButtonGroup(props) {
  const navigate = useNavigate();
  const theme = useTheme();

  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    props.setSavedTeamsDisplay((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <FormControlLabel
        control={<Switch checked={props.savedTeamsDisplay} onChange={handleChange} />}
        label="Show"
      />
      {/* <Box sx={{ display: "flex", }}>
        <Grow in={checked}>
          <Box>
            <AllSavedTeams />
          </Box>
        </Grow>
      </Box> */}

      <div className="navigator-container">
        <ImportActionFloatingButton />
      </div>
    </ThemeProvider>
  );
}