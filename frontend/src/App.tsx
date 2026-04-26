import { Route, Routes } from 'react-router';

import NavBar from './components/NavBar';
import MyPage from './pages/mypage';
import Problem from './pages/problem';
import Problems from './pages/problems';
import SignIn from './pages/signin';
import SignUp from './pages/signup';

const App = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <NavBar />
      <main className='flex-1'>
        <Routes>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/mypage' element={<MyPage />} />

          <Route path='/problems' element={<Problems />} />
          <Route path='/problems/:problemId' element={<Problem />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
