import { FaUserTie } from "react-icons/fa";
import PageAccessTemplate from "./page-access/PageAccessTemplate";

const ManagerPage = () => {
  return (
    <div className="pageTemplate2">
      <PageAccessTemplate color="#0B96BC" icon={FaUserTie} role="Manager" />
    </div>
  );
};

export default ManagerPage;
