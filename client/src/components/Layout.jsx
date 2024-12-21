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
