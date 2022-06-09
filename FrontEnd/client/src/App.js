import 'bootstrap/dist/css/bootstrap.min.css';
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
        <SearchEngine onSaveUserInput = {saveUserInputHandler}/>
        <GoogleMap/>
      </>
  );  
}
export default App;