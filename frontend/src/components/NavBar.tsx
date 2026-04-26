import '../index.css';

import { Link } from 'react-router';

import { useMe } from '../queries/me';
import { Button } from './Button';

const NavBar = () => {
  const { data: me } = useMe();

  return (
    <nav className='sticky top-0 z-50 h-14 border-b border-primary-200'>
      <div className='flex h-full items-stretch gap-6 px-4'>
        <Link to='/' className='shrink-0 text-headline2 flex items-center px-2'>
          <div>
            <span className='text-neutral-400'>{'<'}</span>
            <span className='text-primary-600'>{'ETO'}</span>
            <span className='text-neutral-400'>{'/>'}</span>
          </div>
        </Link>
        <Link to='/problems' className='shrink-0 text-label1 flex items-center px-2'>
          <span className='text-neutral-800'>Problems</span>
        </Link>
        <div className='flex-1' />
        <div className='shrink-0 flex items-center'>
          {me ? (
            <>me</>
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
