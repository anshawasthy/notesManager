import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import Workspaces from './pages/Workspaces';
import WorkspaceDetails from './pages/WorkspaceDetails';
import SharedWorkspace from "./pages/SharedWorkspace";


function App() {

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/login"
          element={<LoginRegister />}
        />
        <Route
          path="/workspaces"
          element={
            <>
              <Navbar />
              <Workspaces />
            </>
          }
        />
        <Route
          path="/workspaces/:id"
          element={
            <>
              <Navbar />
              <WorkspaceDetails />
            </>
          }
        />
        <Route
          path="/shared/:shareId"
          element={<SharedWorkspace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
