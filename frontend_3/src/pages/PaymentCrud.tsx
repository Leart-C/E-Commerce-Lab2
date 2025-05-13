import * as React from "react";
import axios from "axios";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Crud, DataSourceCache } from "@toolpad/core/Crud";
import PaymentsIcon from "@mui/icons-material/Payment";
import { PATH_DASHBOARD } from "../routes/paths";

const NAVIGATION = [
  {
    segment: "paymentCruds",
    title: "Payments",
    icon: <PaymentsIcon />,
    pattern: "dashboard/paymentCruds{/:paymentId}*",
  },
];

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
});

const API_BASE = "https://localhost:7039/api/Payment"; // vendose URL-në reale të API-t tënd

export const paymentsDataSource = {
  fields: [
    { field: "id", headerName: "ID" },
    { field: "paymentMethodId", headerName: "Payment Method ID" },
    { field: "orderId", headerName: "Order ID" },
    { field: "amount", headerName: "Amount" },
  ],

  getMany: async () => {
    const response = await axios.get(API_BASE);
    return {
      items: response.data,
      itemCount: response.data.length,
    };
  },

  getOne: async (id: string | number) => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  createOne: async (data: string) => {
    const response = await axios.post(API_BASE, data);
    return response.data;
  },

  updateOne: async (id: string | number, data: string) => {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data;
  },

  deleteOne: async (id: string | number) => {
    await axios.delete(`${API_BASE}/${id}`);
  },

  validate: (values: {
    paymentMethodId: string;
    orderId: string;
    amount: number;
  }) => {
    const issues = [];

    if (!values.paymentMethodId) {
      issues.push({ path: ["paymentMethodId"], message: "Required" });
    }

    if (!values.orderId) {
      issues.push({ path: ["orderId"], message: "Required" });
    }

    if (!values.amount || values.amount <= 0) {
      issues.push({
        path: ["amount"],
        message: "Amount must be greater than 0",
      });
    }

    return { issues };
  },
};

const paymentsCache = new DataSourceCache();

export default function PaymentCrud() {
  return (
    <AppProvider navigation={NAVIGATION} theme={theme}>
      <DashboardLayout>
        <PageContainer title="Payments">
          <Crud
            dataSource={paymentsDataSource}
            dataSourceCache={paymentsCache}
            rootPath={PATH_DASHBOARD.paymentCrud}
            initialPageSize={10}
            defaultValues={{
              paymentMethodId: 1,
              orderId: 1,
              amount: 0,
            }}
          />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
