import { Route, Routes } from 'react-router';

import Register from './pages/register';

const App = () => {
  return (
    <Routes>
      <Route path='/register' element={<Register />} />
    </Routes>
  );
};

export default App;
