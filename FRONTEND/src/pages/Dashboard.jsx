import { useAuth } from "../context/AuthContext";
import ChatPage from "./ChatPage";

const Dashboard = () => {
  const { logout, user } = useAuth();

  console.log("Inside Dashboard", user);
  return (
    <div className="min-h-screen items-center bg-gray-100">
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full md:w-3/6 lg:w-2/6 bg-fuchsia-700 h-12 text-lime-100 font-bold flex items-center justify-between px-4 z-50 shadow-md">
        <div className=" w-1/2">
          <p className="ml-2">Chattr App</p>
        </div>
        <div className=" w-1/2 text-right">
          <button onClick={logout} className=" mr-2 btn">
            Logout
          </button>
        </div>
      </div>
      <h1 className="mt-14 text-base font-bold ml-2">
        Hi {user?.name || user?._id}{" "}
      </h1>
      <p className="text-xs ml-2">Welcome to Chattr app dashboard </p>

      <div className="w-full md:w-3/6 lg:2/6" >
        <ChatPage />
      </div>
    </div>
  );
};

export default Dashboard;
