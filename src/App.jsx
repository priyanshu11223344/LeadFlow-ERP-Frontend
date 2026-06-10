import MainLayout
  from "./components/layout/MainLayout";

import Login
  from "./pages/Login";

import {
  useAuth,
} from "./context/AuthContext";

function App() {
  const { user } =
    useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="antialiased text-gray-900">
      <MainLayout />
    </div>
  );
}

export default App;