// import { useNavigate } from "react-router-dom";
// import axios from "axios";

const Welcome = () => {
  // const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     await axios.post("http://localhost:5000/logout");
  //     localStorage.removeItem("user"); // clear local storage
  //     navigate("/login"); // redirect after successful logout
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //     alert("Logout failed");
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🎉 Welcome! Userrrrr</h1>
      {/* <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold"
      >
        Logout
      </button> */}
    </div>
  );
};

export default Welcome;
