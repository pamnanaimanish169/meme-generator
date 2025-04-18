import Footer from "./components/Footer";
import Header from "./components/Header";
import MemeCanvas from "./components/MemeCanvas";
import "./index.css";

function App() {
  return (
    <div>
      <Header />
      <MemeCanvas />
      {/* Disabling footer due to canvas being out of the screen */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
