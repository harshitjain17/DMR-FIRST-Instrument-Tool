import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavBar from './Components/NavBar';
import DataTable from './Components//DataTable';

function App() {
  // const saveUserInputHandler = (enteredUserInput) => {
  //   const userInput = {
  //     ...enteredUserInput
  //   };
  //   console.log(userInput);
  // };
  return (
    <div>
      <NavBar/>
      {/* <div className="d-flex flex-row">
        <div style={{width: "35%", display: "inline-block"}}><SearchEngine onSaveUserInput = {saveUserInputHandler}/></div>
        <div>
          <TableComponent/>
          <GoogleMap/>
        </div>
      </div> */}
      <DataTable/>
    </div>
  );  
}
export default App;