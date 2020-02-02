import React from 'react';
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Main from './Main';
import grey from '@material-ui/core/colors/grey';
 

function App() {

  const theme = createMuiTheme({
      palette: {
        type: 'light'
      },
      overrides: {
        MuiContainer: {
          root: {
            width: '500px',
            paddingLeft: '0px',
            paddingRight: '0px',
          }
        },
        MuiFormLabel: {
          root: {
            color: 'white',
            '&$focused': {
              color: 'grey',
            },
          },
        },
        MuiInputBase: {
          root: {
            color: 'white'
          }
        },
        MuiButton: {
          contained: {
            backgroundColor:grey[800],
            color:'white'
          }
        },
        MuiInput: {
          underline: {
            '&:after' : {
              borderBottom : '2px solid black'
            }
          }
        }
      }
  })

  return (
    <ThemeProvider theme={theme}>
      <Main></Main>
    </ThemeProvider>
  );
}

export default App;  
