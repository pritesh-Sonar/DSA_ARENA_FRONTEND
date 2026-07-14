import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <span className="text-lg font-bold text-white">DSA Arena</span>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            Hey, <span className="font-medium text-white">{user.username}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
