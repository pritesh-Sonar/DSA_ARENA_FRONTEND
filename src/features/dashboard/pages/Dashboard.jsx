import Navbar from "../../../components/layout/Navbar";
import { useAuth } from "../../auth/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.username}
        </h1>
        <p className="text-gray-400">
          Your games and matches will show up here soon.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
