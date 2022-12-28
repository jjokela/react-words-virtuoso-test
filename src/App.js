import logo from './logo.svg';
import './App.css';
import Kortti from './Kortti';
import VirtuosoList from './VirtuosoList';
import { Container } from '@mui/system';
import Loora from './Loora';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';



function App() {
  const theme = useTheme();
  return (
    <div className="App">
      <Container disableGutters={useMediaQuery(theme.breakpoints.only('xs'))}>
        <Loora />
        <VirtuosoList />
      </Container>
    </div>
  );
}

export default App;
