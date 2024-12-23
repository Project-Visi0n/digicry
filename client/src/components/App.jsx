import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Journal from "./pages/Journal";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Routes>
              <Route index element={<Home />} />
              <Route path="journal" element={<Journal />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
