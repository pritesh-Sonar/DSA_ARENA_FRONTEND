import Navbar from "../../../components/layout/Navbar";
import { useAuth } from "../../auth/hooks/useAuth";
import MatchmakingQueue from "../components/MatchmakingQueue"; // <-- Imports your new live queue component

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Retaining your top navigation wrapper safely */}
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Profile Card / Welcome Section */}
        <div className="mb-10 border-b border-gray-900 pb-6">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Welcome back, <span className="text-blue-500">{user?.username || 'Player'}</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Current Session: <span className="font-mono text-gray-300 text-xs">{user?.email || 'Authenticated User'}</span>
          </p>
        </div>

        {/* Dynamic Two-Column Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Match History Panel Wrapper (2/3 Width) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-900/30 border border-gray-900 p-8 rounded-xl text-center py-16">
              <p className="text-gray-400 font-medium mb-1">Your games and matches will show up here soon.</p>
              <p className="text-gray-600 text-xs max-w-xs mx-auto">
                Once matchmaking pairs you up, your historical records and ELO rating adjustments will populate this screen.
              </p>
            </div>
          </div>

          {/* Right Column: Live Matchmaking Engine Panel (1/3 Width) */}
          <div className="w-full flex justify-center">
            <MatchmakingQueue />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;