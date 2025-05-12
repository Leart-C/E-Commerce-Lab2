import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PATH_DASHBOARD, PATH_PUBLIC } from "./paths";
import AuthGuard from "../auth/AuthGuard";
import {
  allAccessRoles,
  managerAccessRoles,
  adminAccessRoles,
  ownerAccessRoles,
} from "../auth/auth.utils";
import Layout from "../components/layout";
import AddMaterial from "../pages/materials/AddMaterial.page";
import Supplier from "../pages/suppliers/Supplier.page";
import EditSupplier from "../pages/suppliers/EditSupplier.page";
import AddSupplier from "../pages/suppliers/AddSupplier.page";
import ProjectTask from "../pages/projectsTask/ProjectTask.pages";
import EditProjectTask from "../pages/projectsTask/EditProjectTask.page";
import AddProjectTask from "../pages/projectsTask/AddProjectTask.page";
import Project from "../pages/projects/Project.page";
import EditProject from "../pages/projects/EditProject.page";
import AddProject from "../pages/projects/AddProject.page";
import HeatTreatment from "../pages/heatTreatment/HeatTreatment.page";
import EditHeatTreatments from "../pages/heatTreatment/EditHeatTreatments.page";
import AddHeatTreatment from "../pages/heatTreatment/AddHeatTreatment.page";
import Corrosion from "../pages/corrosion/Corrosion.page";
import AddCorrosion from "../pages/corrosion/AddCorrosion.page";
import EditCorrosion from "../pages/corrosion/EditCorrosion.page";

//

// Lazy load components
const AdminPage = lazy(() => import("../pages/dashboard/AdminPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const ManagerPage = lazy(() => import("../pages/dashboard/ManagerPage"));
const MyLogsPage = lazy(() => import("../pages/dashboard/MyLogsPage"));
const OwnerPage = lazy(() => import("../pages/dashboard/OwnerPage"));
const SystemLogsPage = lazy(() => import("../pages/dashboard/SystemLogsPage"));
const UpdateRolePage = lazy(() => import("../pages/dashboard/UpdateRolePage"));
const UserPage = lazy(() => import("../pages/dashboard/UserPage"));
const UsersManagementPage = lazy(
  () => import("../pages/dashboard/UsersManagementPage")
);
const HomePage = lazy(() => import("../pages/public/HomePage"));
const LoginPage = lazy(() => import("../pages/public/LoginPage"));
const NotFoundPage = lazy(() => import("../pages/public/NotFoundPage"));
const RegisterPage = lazy(() => import("../pages/public/RegisterPage"));
const UnauthorizedPage = lazy(() => import("../pages/public/UnauthorizedPage"));
const Products = lazy(() => import("../pages/products/Products.page"));
const AddProduct = lazy(() => import("../pages/products/AddProduct.page"));
const EditProduct = lazy(
  () => import("../pages/edit-product/EditProduct.pages")
);
const DeleteProduct = lazy(
  () => import("../pages/delete-product/DeleteProduct.page")
);
const Orders = lazy(() => import("../pages/orders/Orders.pages"));
const AddOrder = lazy(() => import("../pages/orders/AddOrder.pages"));
const EditOrders = lazy(() => import("../pages/edit-orders/EditOrders.pages"));
const DeleteOrder = lazy(
  () => import("../pages/delete-order/DeleteOrder.page")
);
const Materials = lazy(() => import("../pages/materials/Materials.pages"));
const EditMaterial = lazy(() => import("../pages/materials/EditMaterial.page"));

const GlobalRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path={PATH_PUBLIC.register}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path={PATH_PUBLIC.login}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path={PATH_PUBLIC.unauthorized}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <UnauthorizedPage />
            </Suspense>
          }
        />

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path="/materials">
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Materials />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <AddMaterial />
                </Suspense>
              }
            />
            <Route
              path="edit/:id"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <EditMaterial />
                </Suspense>
              }
            />
          </Route>
          <Route path="/suppliers">
            <Route
              index
              element={
                <Suspense fallback={<div>LOading...</div>}>
                  <Supplier />
                </Suspense>
              }
            />
            <Route path="edit/:id" element={<EditSupplier />} />
            <Route path="add" element={<AddSupplier />} />
          </Route>
          <Route path="/projectTasks">
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProjectTask />
                </Suspense>
              }
            />
            <Route path="edit/:id" element={<EditProjectTask />} />
            <Route path="add" element={<AddProjectTask />} />
          </Route>

          <Route path="/projects">
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Project />
                </Suspense>
              }
            />
            <Route path="edit/:id" element={<EditProject />} />
            <Route path="add" element={<AddProject />} />
          </Route>

          <Route path="/heatTreatments">
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <HeatTreatment />
                </Suspense>
              }
            />
            <Route path="edit/:id" element={<EditHeatTreatments />} />
            <Route path="add" element={<AddHeatTreatment />} />
          </Route>
          <Route path="/corrosions">
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Corrosion />
                </Suspense>
              }
            />
            <Route path="add" element={<AddCorrosion />} />
            <Route path="edit/:id" element={<EditCorrosion />} />
          </Route>

          <Route
            path={PATH_DASHBOARD.dashboard}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.myLogs}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <MyLogsPage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.user}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <UserPage />
              </Suspense>
            }
          />
        </Route>

        <Route element={<AuthGuard roles={managerAccessRoles} />}>
          <Route
            path={PATH_DASHBOARD.manager}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ManagerPage />
              </Suspense>
            }
          />
        </Route>

        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path="/products">
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Products />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <AddProduct />
                </Suspense>
              }
            />
            <Route
              path="edit/:id"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <EditProduct />
                </Suspense>
              }
            />
            <Route
              path="delete/:id"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <DeleteProduct />
                </Suspense>
              }
            />
          </Route>
          <Route path="/orders">
            <Route
              index
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Orders />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <AddOrder />
                </Suspense>
              }
            />
            <Route
              path="edit/:id"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <EditOrders />
                </Suspense>
              }
            />
            <Route
              path="delete/:id"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <DeleteOrder />
                </Suspense>
              }
            />
          </Route>
          <Route
            path={PATH_DASHBOARD.usersManagement}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <UsersManagementPage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.updateRole}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <UpdateRolePage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.systemLogs}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SystemLogsPage />
              </Suspense>
            }
          />
          <Route
            path={PATH_DASHBOARD.admin}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminPage />
              </Suspense>
            }
          />
        </Route>

        <Route element={<AuthGuard roles={ownerAccessRoles} />}>
          <Route
            path={PATH_DASHBOARD.owner}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <OwnerPage />
              </Suspense>
            }
          />
        </Route>

        <Route
          path={PATH_PUBLIC.notFound}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFoundPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={<Navigate to={PATH_PUBLIC.notFound} replace />}
        />
      </Route>
    </Routes>
  );
};

export default GlobalRouter;
