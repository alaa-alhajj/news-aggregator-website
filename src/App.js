import './App.css';
import Header from "./Components/Header";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import AppRouter from "./Components/startup/AppRouter"
function App() {
  return (
    <>
      <Header />
      <ToastContainer />
     <AppRouter />
    </>
  );
}

export default App;
