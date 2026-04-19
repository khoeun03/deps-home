import { Route, Routes } from 'react-router';

import MyPage from './pages/mypage';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import Submit from './pages/submit';

const App = () => {
  return (
    <Routes>
      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/mypage' element={<MyPage />} />
      <Route path='/submit' element={<Submit />} />
    </Routes>
  );
};

export default App;
