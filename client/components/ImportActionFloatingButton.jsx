import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { Box, Tooltip, Typography, Modal, SpeedDial, TextField, Button } from '@mui/material';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import DifferenceIcon from '@mui/icons-material/Difference';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import CopyAllRoundedIcon from '@mui/icons-material/CopyAllRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

import { connect } from 'react-redux';
import * as actions from '../actions/actions';

const mapStateToProps = state => ({
  currentPokemon: state.pokemon.currentPokemon,
});

const mapDispatchToProps = dispatch => ({
  updatePokemonPokeAPI: (pokemon, pokemonData, mode, importedSet) => dispatch(actions.updatePokemonPokeAPI(pokemon, pokemonData, mode, importedSet)),
  updatePokemonSet: (importedSet) => dispatch(actions.updatePokemonSet(importedSet)),
  importTeam: (importedSet) => dispatch(actions.importTeam(importedSet)),
});

function ImportActionFloatingButton(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [modalContent, setModalContent] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [importModalText, setImportModalText] = useState('');
  const divRef = useRef(null);

  const actionsConfig = [
    { icon: <DifferenceIcon />, name: 'Import Mon', handleClick: () => { setModalMode('importMon'); setShowModal(true); }},
    { icon: <GroupWorkIcon />, name: 'Import Team', handleClick: () => { setModalMode('importTeam'); setShowModal(true); }},
    { icon: <FileUploadRoundedIcon />, name: 'Export Mon', handleClick: () => { setModalMode('exportMon'); setShowModal(true); }},

  ];

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target) && event.target.nodeName !== 'BUTTON') {
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleClickImportMon = () => {
    const userInput = importModalText;
    let backendURL = '/api/importMonSet';
    if (process.env.NODE_ENV === 'production') backendURL = 'https://pokemon-team-builder-api.vercel.app' + backendURL;

    fetch(backendURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({ team: userInput }),
    })
      .then((response) => response.json())
      .then((response) => {
        const pokemonData = response.pokemonData;
        if (response.importedSet)
          props.updatePokemonPokeAPI(pokemonData.name, pokemonData, 'import', response.importedSet);
        setShowModal(false);
      });
  };

  const handleClickImportTeam = () => {
    const userInput = importModalText;
    let backendURL = '/api/importTeam';
    if (process.env.NODE_ENV === 'production') backendURL = 'https://pokemon-team-builder-api.vercel.app' + backendURL;

    fetch(backendURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify({ team: userInput }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response from import team: ', response)
        if (response.importedTeam) props.importTeam(response.importedTeam);
        setShowModal(false);
      });
  };


  const handleClickExportMon = () => {

      const userInput = props.currentPokemon;
      let backendURL = '/api/exportMon';
      if (process.env.NODE_ENV === 'production') backendURL = 'https://pokemon-team-builder-api.vercel.app' + backendURL;
      fetch(backendURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain',
        },
        body: JSON.stringify({ mon: userInput }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log('end of handleClickExport ', response)
          setImportModalText(response.exportedSet)
        });
  };

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = (copyText) => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onClickFunctionObj = {
    importMon: handleClickImportMon,
    importTeam: handleClickImportTeam,
    exportMon: handleClickExportMon,
  };

  useEffect(() => {
    // if (textFieldRef.current) {
    //   textFieldRef.current.focus();
    //   textFieldRef.current.select();
    // }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: "absolute", top: "10%", left: "50%", height: "300%" }}
        direction="down"
        FabProps={{
          sx: {
            bgcolor: theme.palette.primary.main,
            "&:hover": {
              bgcolor: "darkgrey",
            },
          },
        }}
        icon={<SpeedDialIcon />}
      >
        {actionsConfig.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.handleClick}
          />
        ))}
      </SpeedDial>

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <Box
          sx={{
            width: "25%",
            height: "50%",
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 15,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "3%",
            opacity: 0.9,
            borderRadius: "0.8rem",
            p: 2,
          }}
        >
          <TextField
            id="import-export-textfield"
            label="paste your set below:"
            InputLabelProps={{
              sx: {
                backgroundColor: theme.shadows[3],
                borderRadius: "0.5rem",
                px: 1,
                fontSize: "35%",
                paddingBottom: "2%",
              },
            }}
            multiline
            value={importModalText}
            onChange={(e) => setImportModalText(e.target.value)}
            variant="filled"
            autoFocus
            sx={{
              width: "82%",
              minHeight: "82%",
              maxHeight: "80%",
              overflowY: "auto",
              borderColor: theme.palette.secondary.main,
              border: 1,
              "& .MuiFilledInput-root": {
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                overflowY: "auto",
                "& textarea": {
                  height: "100%",
                  boxSizing: "border-box",
                  marginTop: "4%",
                  overflowY: "scroll !important",
                },
              },
            }}
          />
          <Button
            onClick={onClickFunctionObj[modalMode]}
            sx={{
              height: "10%",
              width: "30%",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.text.primary,
              lineHeight: "normal",
              padding: "5%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            import
          </Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportActionFloatingButton);
