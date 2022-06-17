import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Container, Row, Col} from 'react-bootstrap';
import './App.css';
import SearchEngine from './Components/SearchEngine';
import GoogleMap from './Components/GoogleMap';
// import TableComponent from './Components/TableComponent';

function App() {
  const saveUserInputHandler = (enteredUserInput) => {
    const userInput = {
      ...enteredUserInput
    };
    console.log(userInput);
  };
  return (
    <div>
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
      <div>        
        <div style={{width: "50%", display: "inline-block"}}><SearchEngine onSaveUserInput = {saveUserInputHandler}/></div>
        <div>
          <Row><GoogleMap/></Row>
          {/* <Row><TableComponent/></Row> */}
        </div>
      </div>
    </div>
  );  
}
export default App;