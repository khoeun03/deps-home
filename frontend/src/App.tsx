import { Route, Routes } from 'react-router';

import MyPage from './pages/mypage';
import SignIn from './pages/signin';
import SignUp from './pages/signup';

const App = () => {
  return (
    <Routes>
      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/mypage' element={<MyPage />} />
    </Routes>
  );
};

export default App;
