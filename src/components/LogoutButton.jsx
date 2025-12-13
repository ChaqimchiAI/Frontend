import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'https://apichaqimchi.pythonanywhere.com/api/v1/user/logout/',
        { refresh: refreshToken }, // body to'g'ri yuborilmoqda
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    } catch (error) {
      console.error('Logout xatolik yuz berdi:', error);
    //   localStorage.removeItem('access_token');
    //   localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };

  return (
    <Icon
      icon="solar:logout-line-duotone"
      style={{ cursor: 'pointer', color: 'red', fontSize: '24px' }}
      title="Chiqish"
      onClick={handleLogout}
    />
  );
}
