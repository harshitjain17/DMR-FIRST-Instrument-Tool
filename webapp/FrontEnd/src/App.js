import 'bootstrap/dist/css/bootstrap.min.css';
<<<<<<< HEAD:FrontEnd/client/src/App.js
import {Navbar, Nav, Container} from 'react-bootstrap';
=======
>>>>>>> 4ad879fe6c58de7b1b756881807dc96f1398e943:webapp/FrontEnd/src/App.js
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
          <div className="col"></div>
        </div>
        
        <div className = "row">
          <GoogleMap/>
        </div>
      </div>
    </>
  );  
}
export default App;