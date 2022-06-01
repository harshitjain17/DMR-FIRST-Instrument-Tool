import './App.css';
import Navbar from "./components/Navbar";
import MiddleLeftSection from './components/MiddlePage/MiddleLeftSection';
import MiddleRightSection from './components/MiddlePage/MiddleRightSection';


export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement('script');
  script.src = urlOfTheLibrary;
  script.async = true;
  document.body.appendChild(script);
}
function App() {
     
  return (
    <div>
      <Navbar></Navbar>
      <MiddleLeftSection></MiddleLeftSection>
      <MiddleRightSection></MiddleRightSection>
    </div>
  );
};

export default App;
