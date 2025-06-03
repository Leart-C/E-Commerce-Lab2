//#region Imports
import { Routes, Route, Navigate,createBrowserRouter, RouterProvider, createRoutesFromElements } from "react-router-dom";
import { PATH_DASHBOARD, PATH_PUBLIC } from "./paths";
import AuthGuard from "../auth/AuthGuard";
import {
  allAccessRoles,
  managerAccessRoles,
  adminAccessRoles,
  ownerAccessRoles,
} from "../auth/auth.utils";
import Layout from "../components/layout";
import AdminPage from "../pages/dashboard/AdminPage";
import AllMessagesPage from "../pages/dashboard/AllMessagesPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import InboxPage from "../pages/dashboard/InboxPage";
import ManagerPage from "../pages/dashboard/ManagerPage";
import MyLogsPage from "../pages/dashboard/MyLogsPage";
import OwnerPage from "../pages/dashboard/OwnerPage";
import SendMessagePage from "../pages/dashboard/SendMessagePage";
import SystemLogsPage from "../pages/dashboard/SystemLogsPage";
import UpdateRolePage from "../pages/dashboard/UpdateRolePage";
import UserPage from "../pages/dashboard/UserPage";
import UsersManagementPage from "../pages/dashboard/UserManagementPage";
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import NotFoundPage from "../pages/public/NotFoundPage";
import RegisterPage from "../pages/public/RegisterPage";
import UnauthorizedPage from "../pages/public/UnauthorizedPage";
import { Suspense } from "react";
import PaymentMethod from "../pages/paymentMethod/PaymentMethod";
import Invoice from "../pages/invoice/Invoice";
import Payment from "../pages/payment/Payment";
import Category from "../pages/category/Category";
import Refund from "../pages/refund/Refund";
import Transaction from "../pages/transaction/Transaction";
import ShippingAddress from "../pages/shippingAddress/ShippingAddress";
import Order from "../pages/order/Order";
import Product from "../pages/product/Product";
import ProductReview from "../pages/productReview/ProductReview";
import ProductReviewList from "../pages/productReview/ProductReviewList";
import OrderItem from "../pages/orderItem/OrderItem";
import ChatLayout from "../components/Chat/ChatLayout";
//#endregion

const GlobalRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path={PATH_PUBLIC.register} element={<RegisterPage />} />
        <Route path={PATH_PUBLIC.login} element={<LoginPage />} />
        <Route path={PATH_PUBLIC.unauthorized} element={<UnauthorizedPage />} />

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.dashboard} element={<DashboardPage />} />
          <Route
            path={PATH_DASHBOARD.sendMessage}
            element={<SendMessagePage />}
          />
          <Route path={PATH_DASHBOARD.inbox} element={<InboxPage />} />
          <Route path={PATH_DASHBOARD.myLogs} element={<MyLogsPage />} />

          {/* Kjo linj shakton TypeError nese doni me shfaq nje list pa chat mundeni me zevendesu me nje komponent tjeter
          ose me perdor kete qe eshte pasi qe chat-i ngarkohet ne chatlayout */}
                    <Route path={PATH_DASHBOARD.user} element={<UserPage />} /> 

        </Route>
        <Route element={<AuthGuard roles={managerAccessRoles} />}>
          <Route path={PATH_DASHBOARD.manager} element={<ManagerPage />} />
        </Route>
        <Route element={<AuthGuard roles={adminAccessRoles} />}>
          <Route
            path={PATH_DASHBOARD.usersManagement}
            element={<UsersManagementPage />}
          />
          <Route
            path={PATH_DASHBOARD.updateRole}
            element={<UpdateRolePage />}
          />
          <Route
            path={PATH_DASHBOARD.allMessages}
            element={<AllMessagesPage />}
          />
          <Route
            path={PATH_DASHBOARD.systemLogs}
            element={<SystemLogsPage />}
          />
          <Route path={PATH_DASHBOARD.admin} element={<AdminPage />} />
        </Route>
        <Route element={<AuthGuard roles={ownerAccessRoles} />}>
          <Route path={PATH_DASHBOARD.owner} element={<OwnerPage />} />
        </Route>

        <Route path={PATH_PUBLIC.notFound} element={<NotFoundPage />} />

        <Route
          path="*"
          element={<Navigate to={PATH_PUBLIC.notFound} replace />}
        />
        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.paymentMethod}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <PaymentMethod />
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.invoice}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Invoice />
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.payment}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Payment />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.category}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Category />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.refund}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Refund />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.transaction}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Transaction />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.shippingAddress}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ShippingAddress />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.order}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Order />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.product}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Product />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.productReview}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProductReview />
                </Suspense>
              }
            />
            <Route
              path=":productId"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProductReviewList />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.orderItem}>
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <OrderItem />
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route path={PATH_DASHBOARD.chat}>
                    <Route index element={
                        <Suspense fallback={<div>Loading Chat Page...</div>}>
                            <ChatLayout />
                        </Suspense>
                    } />
                    <Route path=":userId" element={ 
                        <Suspense fallback={<div>Loading Specific Chat...</div>}>
                            <ChatLayout /> {/* ChatLayout lexon userId nga parametrat e url-it */}
                        </Suspense>
                    } />
                </Route>


                <Route element={<AuthGuard roles={allAccessRoles} />}>
          
        </Route>
            </Route>
    </Routes>
  );
};

export default GlobalRouter;

