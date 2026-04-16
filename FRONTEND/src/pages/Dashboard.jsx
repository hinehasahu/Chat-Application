import { useAuth } from "../context/AuthContext";
import ChatPage from "./ChatPage";

const Dashboard = () => {
  const { logout, user } = useAuth();

  console.log("Inside Dashboard", user);
  return (
    <div className="dashboard min-h-screen items-center">
      <div className="dashboardhead fixed top-0 left-1/2 transform -translate-x-1/2 w-full md:w-3/6 lg:w-2/6 h-12 font-bold flex items-center justify-between px-4 z-50 shadow-md">
        <div className=" w-1/2 flex items-center">
          {/* <img className="logoimg" src="/faviconlogo.png" alt="logo" /> */}
          <p className="text-xl ml-2 logoname">KooTalk</p>
        </div>
        <div className=" w-1/2 text-right">
          <button onClick={logout} className=" mr-2 ">
            Logout
          </button>
        </div>
      </div>
      <div className="dashhead">
        <h1 className="mt-12 text-base font-bold ml-2">
        Hi {user.name || "User"}{" "}
      </h1>
      <p className="text-xs ml-2">Welcome to Chattr app dashboard </p>
      </div>

      <div className="w-full md:w-3/6 lg:2/6" >
        <ChatPage />
      </div>
    </div>
  );
};

export default Dashboard;
