import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import registerpic from "../../src/assets/images/registration.png"
import googlePic from "../../src/assets/images/google.svg"
import logo from "../../src/assets/images/logo.svg"
import shape1 from "../../src/assets/images/shape1.svg"
import shape2 from "../../src/assets/images/shape2.svg"
import shape3 from "../../src/assets/images/shape3.svg"
import { authService } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative overflow-y-auto h-screen  scrollbar-hide bg-gray-100">
      
      {/* bg images */}
        <div className="absolute top-0 left-0">
            <img src={shape1} alt="Shape 1" />
        </div>
        <div className="absolute top-0 right-0">
            <img src={shape2} alt="Shape 2" />
        </div>
        <div className="absolute bottom-[-300px] right-[200px] w-[400px]">
            <img src={shape3} alt="Shape 3" />
        </div>
      
      
      
      <div className="flex items-center max-w-[1200px] mx-auto justify-between bg-gray-100 my-[100px]">

        


        <div className="max-w-[860px] w-full">  {/*image div */}
          <img src={registerpic} alt="Register" />
        </div>
        <div className="bg-white rounded-sm z-1"> {/* form div */}
                    <div className="flex flex-col items-center justify-center px-8 py-10 w-full max-w-[400px] mx-auto">
                      <img src={logo} alt="Logo" className="h-10 mb-6" />
                      <div className="text-gray-500 text-lg mb-1">Get Started Now</div>
                      <div className="font-bold text-2xl text-black mb-8">Registration</div>
                      <button className="flex items-center justify-center w-full border rounded-lg py-3 mb-6 bg-white shadow-sm">
                        <img src={googlePic} alt="Google" className="w-6 h-6 mr-2" />
                        <span className="text-gray-700 font-medium">Register with google</span>
                      </button>
                      <div className="flex items-center w-full mb-6">
                        <hr className="flex-1 border-gray-200" />
                        <span className="mx-3 text-gray-400">Or</span>
                        <hr className="flex-1 border-gray-200" />
                      </div>
                      <form className="w-full" onSubmit={handleSubmit}>
                        {error && (
                          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                          </div>
                        )}
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">First Name</label>
                          <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-black" 
                            required 
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                          <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-black" 
                            required 
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">Email</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-black" 
                            required 
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">Password</label>
                          <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-black" 
                            required 
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">Repeat Password</label>
                          <input 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-black" 
                            required 
                          />
                        </div>
                        <div className="flex items-center gap-2 mb-6">
                          <input type="checkbox" className="accent-blue-600" required />
                          <span className="text-gray-600 text-sm">I agree to terms & conditions</span>
                        </div>
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold text-lg mb-4 disabled:bg-blue-300"
                        >
                          {loading ? 'Registering...' : 'Register now'}
                        </button>
                      </form>
                      <div className="text-gray-500 text-sm mt-2">
                        Already have an account? <a href="/login" className="text-blue-500 font-medium hover:underline">Login</a>
                      </div>
                    </div>
        </div>
      </div>

    </div>
  );
}

export default Register;