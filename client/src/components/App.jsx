import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from './Layout';
import Home from './pages/Home';


const App = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
        setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <Routes>
      <Route
      path="/"
      element={
        <Layout>
          <Home />
        </Layout>
      }
      />
      </Routes>
    );
  };
  
  export default App;

     