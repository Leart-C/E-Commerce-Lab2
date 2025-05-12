export interface IProduct {
  id: string;
  brand: string;
  title: string;
  size: string;
}

export interface IMaterial {
  id: string;
  name: string;
  description: string;
  supplierId: string;
}

export interface IProject {
  projectId: number;
  projectName: string;
  startDate: string;
  endDate: string;
  projectManager: string;
  budget: number;
  status: string;
}

export interface IHeatTreatment {
  id: string;
  processName: string;
  temperature: string;
  timeDuration: string;
  coolingMethod: string;
  purpose: string;
  corrosionId: string;
}

export interface ICorrosion {
  id: string;
  materialName: string;
  environment: string;
  corrosionRate: string;
  protectiveCoating: string;
  notes: string;
}

export interface IProjectTask {
  projectTaskId: number;
  projectId: number;
  taskName: string;
  assignedTo: string;
  dueDate: string;
  status: string;
  description: string;
}

export interface ISupplier {
  id: string;
  name: string;
  info: string;
}

export interface ICreateProduct {
  brand: string;
  title: string;
  size: string;
}

export interface IOrder {
  total: string;
  address: string;
  paymentMethod: string;
  productId: string;
  brand: string;
}

export interface Supplier {
  id: string;
  name: string;
  info: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  supplierId: string;
}
