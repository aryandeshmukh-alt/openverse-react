import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AddTodoPage } from './pages/AddTodoPage';
import { TodoDetailPage } from './pages/TodoDetailPage';
import { ProtectedPage } from './pages/ProtectedPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/add-todo"
            element={
              <ProtectedRoute>
                <AddTodoPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/todos/:id"
            element={<TodoDetailPage />}
          />

          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
