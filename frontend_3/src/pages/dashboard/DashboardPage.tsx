import {
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
} from "@mui/material";
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
          {/* Titulli */}
          <Typography variant="h4" fontWeight="bold" mt={4} mb={2}>
            Dashboard
          </Typography>

          <Grid container spacing={3}>
            {/* Statistika */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <DashboardStatGroup />
                </CardContent>
              </Card>
            </Grid>

            {/* Grafiku i porosive sipas statusit */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <OrderBarChart />
                </CardContent>
              </Card>
            </Grid>

            {/* Grafiku i produkteve sipas kategorisë */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <ProductCategoryPieChart />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </PageAccessTemplate>
    </div>
  );
};

export default DashboardPage;
