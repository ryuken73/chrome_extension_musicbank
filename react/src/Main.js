/*global chrome*/
import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

const useStyle = makeStyles({
    title : {
        backgroundColor: grey[900],
        color: "white",
        display : 'flex'
    },
    textBox : {
        backgroundColor: grey[800],
        color: "white",
        display : 'flex',
        justifyContent : 'space-between'
    },
    submitBtns : {
        backgroundColor: grey[700],
        color: "white"
    }
})

function Main() {

  const classes = useStyle();
  const defaults = {
    address : 'https://10.10.16.122:3000',
    maxResult : 500,
    minWord : 2,
    delay : 500,
    timeout : 5000,
  }
  const LOCAL_STORAGE_KEY = 'MBK_SEARCH_OPTIONS';
  const [options, setOptions] = useState(defaults);
  const [message, setMessage] = useState('');
  console.log('re-rendering!!')
  const {address, maxResult, minWord, delay, timeout} = options;
  console.log(address,maxResult,minWord,delay, timeout);

  const fakeStorage = new Map();

  if(!chrome.storage){
    chrome.storage = {
      local : fakeStorage
    }
    // chrome.storage.local.set = ({key, value}) => fakeStorage[key] = value;
  }

  useEffect(() => {
    console.log('in useEffect');
    chrome.storage.local.get(LOCAL_STORAGE_KEY, results => {
      console.log('result = ', results);
      console.log('result[LOCAL_STORAGE_KEY] = ', results[LOCAL_STORAGE_KEY]);
      const savedOptions = results[LOCAL_STORAGE_KEY];
      const combinedOptions = Object.assign({}, defaults, savedOptions);

      setOptions({...combinedOptions});
      chrome.storage.local.set({[LOCAL_STORAGE_KEY]: combinedOptions}, () => {
        console.log(`save localStorage[${LOCAL_STORAGE_KEY}] = `, combinedOptions);
        console.log(chrome.runtime.lastError);
      })
    })
  },[])

  const handleChangeValue = (type) => {
    return (event) => {
      const {value} = event.target;
      const newOptions = {...options, [type]: value};
      setOptions(newOptions);     
    }
  }

  const handleSaveClick = () => {
    // localStorage.setItem('address', address);
    console.log(chrome);
    chrome.storage.local.set({[LOCAL_STORAGE_KEY]: options}, () => {
      console.log(`save localStorage[${LOCAL_STORAGE_KEY}] = `, options);
      console.log(chrome.runtime.lastError);
      setMessage('저장되었습니다.');
    });
  }

  const handleInitClick = () => {
    setOptions({...defaults});
    chrome.storage.local.set({[LOCAL_STORAGE_KEY]: {...defaults}}, () => {
      console.log(`save localStorage[${LOCAL_STORAGE_KEY}] = `, options);
      console.log(chrome.runtime.lastError);
      setMessage('초기화되었습니다.');
    });
  }

  const handleCloseClick = () => {
    window.close();
  }


  return (
      <Container maxWidth="sm">
        <Box p={1} className={classes.title} >
            <Typography variant="h4">
                옵션
            </Typography>
            <Button style={{marginLeft:'auto'}} variant="contained" onClick={handleInitClick}>초기화</Button>   
        </Box>
        <Box p={1} className={classes.textBox}>
            <TextField  autoFocus={true} value={address} margin='dense' onChange={handleChangeValue('address')} required fullWidth label="주소"/>
        </Box>
        <Box p={1} className={classes.textBox}>
            <TextField value={maxResult} margin='dense' onChange={handleChangeValue('maxResult')}  label="최대 결과갯수"/>
            <TextField value={minWord} margin='dense' onChange={handleChangeValue('minWord')}  label="최소 검색단어수"/>
        </Box>
        <Box p={1} className={classes.textBox}>
            <TextField value={delay} margin='dense' onChange={handleChangeValue('delay')} label="자동완성 지연(ms)"/>
            <TextField value={timeout} margin='dense' onChange={handleChangeValue('timeout')} label="자동완성 시간초과(ms)"/>
        </Box>
        <Box p={1} className={classes.submitBtns}>
            <Button variant="contained" onClick={handleSaveClick}>저장</Button>
            <Button style={{marginLeft:'5px'}} variant="contained" onClick={handleCloseClick}>닫기</Button>
            <Typography style={{marginLeft: '20px'}} variant="caption">{message}</Typography>         
        </Box>
      </Container>
  );
}

export default Main;
