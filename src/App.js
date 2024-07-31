import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home"
import Referal from "./components/refrel"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="/refer" Component={Referal}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
