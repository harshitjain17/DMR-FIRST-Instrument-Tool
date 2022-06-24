import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavBar from './Components/NavBar';
import DataTable from './Components//DataTable';
import GoogleMap from './Components/GoogleMap';
import SearchEngine from './Components/SearchEngine';

function App() {
  const saveUserInputHandler = (enteredUserInput) => {
    const userInput = {
      ...enteredUserInput
    };
    console.log(userInput);
  };
  return (
    <div>
      <NavBar/>
      <div className="d-flex flex-row">
        <div style={{width: "35%", height: "100%", display: "inline-block"}}><SearchEngine onSaveUserInput = {saveUserInputHandler}/></div>
        <div style={{width: "100%"}}>
          <DataTable/>
          <GoogleMap/>
        </div>
      </div>
    </div>
  );  
}
export default App;