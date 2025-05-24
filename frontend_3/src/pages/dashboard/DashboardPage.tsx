import { Box, Typography, Container, Card, CardContent } from "@mui/material";
import PageAccessTemplate from "../../components/dashboard/page-access/PageAccessTemplate";
import { BsGlobeAmericas } from "react-icons/bs";
import ProductCategoryPieChart from "../../components/pieChart/ProductCategoryPieChart";
import OrderBarChart from "../../components/lineChart/OrderBarChart";
import DashboardStatGroup from "../../components/statGroup/DashboardStatGroup";

const DashboardPage = () => {
  return (
    <div className="pageTemplate2">
      <PageAccessTemplate color="#000" icon={BsGlobeAmericas} role="Dashboard">
        <Container maxWidth="xl">
          <Box display="flex" flexDirection="column" gap={4} mt={2}>
            <Typography variant="h4" fontWeight="bold">
              Dashboard
            </Typography>

            {/* Card me dy grafikë horizontalisht */}
            <Card sx={{ maxWidth: 1200, margin: "auto" }}>
              <CardContent>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexWrap="wrap"
                  gap={4}
                >
                  <Box flex="1" minWidth={400}>
                    <DashboardStatGroup />
                  </Box>
                  <Box flex="1" minWidth={400}>
                    <OrderBarChart />
                  </Box>
                  <Box flex="1" minWidth={400}>
                    <ProductCategoryPieChart />
                  </Box>
                  
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </PageAccessTemplate>
    </div>
  );
};

export default DashboardPage;
