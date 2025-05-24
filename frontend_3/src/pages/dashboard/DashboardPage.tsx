import { Box, Typography, Container, Card, CardContent } from "@mui/material";
import PageAccessTemplate from "../../components/dashboard/page-access/PageAccessTemplate";
import { BsGlobeAmericas } from "react-icons/bs";
import ProductCategoryPieChart from "../../components/pieChart/ProductCategoryPieChart";
import OrderBarChart from "../../components/lineChart/OrderBarChart";

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
  <Card sx={{ flex: "1 1 500px", minWidth: 400 }}>
    <CardContent>
      <OrderBarChart />
    </CardContent>
  </Card>

  <Card sx={{ flex: "1 1 500px", minWidth: 400 }}>
    <CardContent>
      <ProductCategoryPieChart />
    </CardContent>
  </Card>
</Box>

          </Box>
        </Container>
      </PageAccessTemplate>
    </div>
  );
};

export default DashboardPage;
