import { Route, Routes } from 'react-router';

import Mainpage from './pages/mainpage/Mainpage.tsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Mainpage />}>
        <Route path='/signup' />
        <Route path='/signin' />
      </Route>
    </Routes>
  );
}

export default App;
