// App.jsx
import { Routes, Route } from 'react-router-dom';
import LoginSignupPage from './components/LoginSignup';
import BooknookApp from './components/BooknookApp';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginSignupPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <BooknookApp />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
