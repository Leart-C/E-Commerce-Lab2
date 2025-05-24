import { Box, Typography, Container, Card, CardContent } from "@mui/material";
import PageAccessTemplate from "../../components/dashboard/page-access/PageAccessTemplate";
import { BsGlobeAmericas } from "react-icons/bs";
import ProductCategoryPieChart from "../../components/pieChart/ProductCategoryPieChart";

const DashboardPage = () => {
  return (
    <div className="pageTemplate2">
      <PageAccessTemplate color="#000" icon={BsGlobeAmericas} role="Dashboard">
        <Container maxWidth="xl">
          <Box display="flex" flexDirection="column" gap={4} mt={2}>
            {/* Titulli dhe përshkrimi */}
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Dashboard
              </Typography>
            </Box>

            {/* Seksioni i grafikëve */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={4}
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Card sx={{ flex: "1 1 350px", minWidth: 300 }}>
                <CardContent>
                  <ProductCategoryPieChart />
                </CardContent>
              </Card>

              {/* Mund të shtosh grafikë të tjerë këtu */}
              {/* <Card sx={{ flex: '1 1 350px', minWidth: 300 }}>
                <CardContent><OrderBarChart /></CardContent>
              </Card> */}
            </Box>
          </Box>
        </Container>
      </PageAccessTemplate>
    </div>
  );
};

export default DashboardPage;
