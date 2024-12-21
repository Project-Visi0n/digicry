import { Container, Typography, Box } from '@mui/material';

const Layout = ({ children }) => {

  return (
    <>
    {/* Background elements */}
    <div className="gradient-animation"></div>
      <div className="gradient-overlay"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {/* App Title */}
          <Typography
            variant="h2"
            component="h1"
            className="main-title"
          >
            Digi-Cry
          </Typography>

          {/* Navigation Placeholder */}
          <nav className="glass-container nav-container">
            <a className="nav-link active" href="#home">Home</a>
            <a className="nav-link" href="#journal">Journal</a>
            <a className="nav-link" href="#analytics">Analytics</a>
          </nav>

          {/* Page Content */}
          <Box sx={{ mt: 4 }}>
            {children}
          </Box>
        </Box>
      </Container>
    </>

  );
};

export default Layout;
