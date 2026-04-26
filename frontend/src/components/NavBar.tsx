import '../index.css';

import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';

import { useMe } from '../queries/me';
import { Button } from './Button';

const NavBar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: me } = useMe();

  const handleLogout = async () => {
    const res = await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate('/');
    }
  };

  return (
    <nav className='border-primary-200 sticky top-0 z-50 h-14 border-b'>
      <div className='flex h-full items-stretch gap-6 px-4'>
        <Link to='/' className='text-headline2 flex shrink-0 items-center px-2'>
          <div>
            <span className='text-neutral-400'>{'<'}</span>
            <span className='text-primary-600'>{'ETO'}</span>
            <span className='text-neutral-400'>{'/>'}</span>
          </div>
        </Link>
        <Link to='/problems' className='text-label1 flex shrink-0 items-center px-2'>
          <span className='text-neutral-800'>Problems</span>
        </Link>
        <div className='flex-1' />
        <div className='flex shrink-0 items-center'>
          {me ? (
            <div className='flex items-center gap-2'>
              <Link to='/mypage'>
                <span className='text-body1'>{me.data.nickname}</span>
              </Link>
              <Button color='secondary' variant='outlined' onClick={handleLogout}>
                로그아웃
              </Button>
            </div>
          ) : (
            <Link to='/signin'>
              <Button color='primary' variant='outlined'>
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
