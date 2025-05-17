import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaUser } from 'react-icons/fa';

//Eksportohet ne komponente te jashtme si Order.tsx
export interface UserDto {
  id: string;
  username: string;
};

const UserPage = () => {



  return (
    <div className='pageTemplate2'>
      <PageAccessTemplate color='#FEC223' icon={FaUser} role='User' />
    </div>
  );
};

export default UserPage;