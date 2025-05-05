import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo2 from '../assets/logo2.png'
import robot from '../assets/robot.png'


export const LoginPage = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === "hogist" && password === "123456") {
            localStorage.setItem("isLoggedIn", "true");
            setIsAuthenticated(true);
            navigate("/dashboard");
        } else {
            setError("Invalid credentials! Try again.");
        }
    };


    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);
    return (
        <>
            <div className="relative h-screen flex items-center justify-center  bg-black">
                {/* Glowing Green Circle Effect */}
                <div className="absolute w-[300px] h-[300px] bg-green-600 rounded-full blur-3xl opacity-50 "></div>

                <div className="relative z-10 w-full">
                    {/* 
                    <h2 className="text-lg font-semibold text-white text-left px-6 md:px-10 py-10 md:py-2">Hogist</h2> */}
                    <div className="flex items-center justify-center">
                        {/* form */}

                        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 ">
                            <h1 className="mb-1 text-gray-300 text-center font-extrabold text-3xl " data-aos="fade-right" data-aos-delay="100">Login</h1>
                            <div className=" rounded-xl  md:w-96 text-white">

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleLogin();
                                        
                                    }}
                                    id="login"
                                    className="p-8 rounded-xl w-80 md:w-96 text-white"
                                >
                                    {error && <p className="text-red-500 mb-3">{error}</p>}
                                    <div className="flex flex-col gap-3" data-aos="fade-right" data-aos-delay="200">
                                        <label htmlFor="userId" id="userId">User Id</label>
                                        <input
                                            type="text"
                                            placeholder="Enter the User Id"
                                            className="w-full p-3 mb-4 bg-white rounded-xl text-black outline-none "
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3" data-aos="fade-right" data-aos-delay="300">
                                        <label htmlFor="password" id="password">Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter the Password"
                                            className="w-full p-3 mb-4 bg-white rounded-xl text-black outline-none "
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    {/* <p className="text-right text-sm text-gray-400 cursor-pointer hover:underline">Forgot Password</p> */}
                                    <button
                                        type="submit"

                                        className="w-full mt-4 bg-green-600 text-white p-3 rounded-xl hover:bg-green-700" data-aos="fade-right" data-aos-delay="400"
                                    >
                                        Sign in
                                    </button>
                                </form>

                            </div>
                        </div>

                        <div className="hidden lg:block relative md:w-1/2 cursor-default">

                            {/* Inverted Corner (Top Right) */}
                            <div className="absolute top-10 right-10 xl:right-28 w-20 h-20 bg-black rounded-bl-3xl z-0  border-2 border-black tag" ></div>
                            <div className="absolute top-16 left-10 lg:left-28  mx-8" >
                                <img src={logo2} alt="img" className="w-48" loading="lazy" />
                            </div>

                            <div className="bg-green-700 text-white flex flex-col justify-center px-8 pt-16 pb-10 md:mx-10 xl:mx-28 mt-10 rounded-xl overflow-hidden border-2 border-green-700">


                                <div className="mt-10 py-2 bg-green-600 rounded-lg relative z-10 px-5 ">
                                    <div className="flex my-4 items-center justify-center">
                                        <h2 className="text-3xl font-bold z-10   text-center">Welcome Back to <span className=" font-bold text-6xl leading-20 poppins  ">Sellient</span></h2>
                                        <img src={robot} alt="" className="w-32 h-32 " loading="lazy" />
                                        {/* <div className=" flex items-center justify-center">
                                      
                                    </div> */}
                                    </div>
                                    <blockquote className=" text-white my-6 font-semibold mx-4">-Your Al-powered command center for smarter sales, sharper pitches, and seamless lead engagement. </blockquote>
                                    <div className="my-6 bg-white text-black py-3 rounded-full flex  justify-center items-center  shadow-2xl mx-3">
                                        <h3 className="font-normal italic text-lg  ">"Your Al Sales Sidekick is Ready to Roll !"</h3>
                                    </div>
                                    <p className=" text-black mt-6 font-semibold mx-4">Powered by Hogist Technologies - Redefining bulk food delivery through Al.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>




        </>
    );
};
