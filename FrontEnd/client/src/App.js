import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col } from 'react-bootstrap';
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
      <div className='container'>
        <div className = "row">
          <div className="col"><SearchEngine onSaveUserInput = {saveUserInputHandler}/></div>
          <div className="col"></div>
        </div>
        
        <div className = "row">
          <GoogleMap/>
        </div>
      </div>
  );  
}
export default App;