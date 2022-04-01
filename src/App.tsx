import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import SingleRoom from "./components/SingleRoom";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<CreateRoom />} />
          <Route path="/room/:id" element={<SingleRoom />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
