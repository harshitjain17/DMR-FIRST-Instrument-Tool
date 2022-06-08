import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SearchEngine from './Components/SearchEngine';

function App() {
  const saveUserInputHandler = (enteredUserInput) => {
    // const userInput = {
    //   ...enteredUserInput
    // };
    console.log(enteredUserInput);
  };
  return (
        <SearchEngine onSaveUserInput = {saveUserInputHandler}></SearchEngine>
  );
}
export default App;
