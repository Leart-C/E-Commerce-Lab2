export const PATH_PUBLIC = {
  home: "/",
  register: "/register",
  login: "/login",
  unauthorized: "/unauthorized",
  notFound: "/404",
};

export const PATH_DASHBOARD = {
  dashboard: "/dashboard",
  usersManagement: "/dashboard/users-management",
  updateRole: "/dashboard/update-role/:userName",
  sendMessage: "/dashboard/send-message",
  inbox: "/dashboard/inbox",
  allMessages: "/dashboard/all-messages",
  systemLogs: "/dashboard/system-logs",
  myLogs: "dashboard/my-logs",
  owner: "/dashboard/owner",
  admin: "/dashboard/admin",
  manager: "/dashboard/manager",
  user: "/dashboard/user",
  payment: "/dashboard/payment",
  paymentMethod: "/dashboard/paymentMethod",
  invoice: "/dashboard/invoice",
  category: "/dashboard/category",
  refund: "/dashboard/refund",
  transaction: "/dashboard/transaction",
  shippingAddress: "/dashboard/shippingAddress",
  order: "dashboard/order",
  product: "dashboard/product",
  productReview: "/dashboard/productReview",
  productReviewByProductId: "/dashboard/productReview/:productId",
  orderItem: "/dashboard/orderItem",
  chat: "/dashboard/chat",
    chatWithUser: (userId?: string) => userId ? `/dashboard/chat/${userId}` : '/dashboard/chat',
  

};
