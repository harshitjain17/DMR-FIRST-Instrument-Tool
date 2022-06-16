import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Container} from 'react-bootstrap';
import './App.css';
import SearchEngine from './Components/SearchEngine';
import GoogleMap from './Components/GoogleMap';

function App() {
  const saveUserInputHandler = (enteredUserInput) => {
    const userInput = {
      ...enteredUserInput
    };
    console.log(userInput);
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="#home">Logo (or name)</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#contact">Contact</Nav.Link>
        </Nav>
        </Container>
      </Navbar>
      <div className='container'>
        <div className = "row">
          <div className="col"><SearchEngine onSaveUserInput = {saveUserInputHandler}/></div>
          <div className="col">
            <div className="row"><GoogleMap/></div>
            <div className="row"></div>
          </div>
        </div>
      </div>
    </>
  );  
}
export default App;