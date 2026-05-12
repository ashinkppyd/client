import { GoogleLogin } from "@react-oauth/google";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

export default function GoogleAuth() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("GOOGLE RESPONSE:", credentialResponse);

      await API.post(
        "/google-login/",
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Google Login Success 🎉"); 

      navigate("/", { replace: true });

    } catch (err) {
      console.log("GOOGLE LOGIN ERROR:", err.response?.data || err);
      toast.error("Google login failed"); 
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Login Failed")} 

      theme="outline"
      size="large"
      text="signin_with"
      shape="rectangular"
      width="425"
    />
  );
}
