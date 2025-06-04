import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo2 from '../assets/logo2.png';
import robot from '../assets/robot.png';

export const LoginPage = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [step, setStep] = useState("email");
    const [timer, setTimer] = useState(600);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const sendOtp = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch("https://hogist.com/food-api/send-otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setStep("otp");
                setTimer(600);
                setSuccess("OTP sent successfully!");
            } else {
                setError("Failed to send OTP. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://hogist.com/food-api/verify-otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            if (res.ok) {
                localStorage.setItem("isLoggedIn", "true");
                setIsAuthenticated(true);
                navigate("/dashboard");
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    useEffect(() => {
        let interval;
        if (step === "otp" && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTimer = () => {
        const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
        const seconds = String(timer % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="relative h-dvh flex items-center justify-center bg-black">
            <div className="absolute w-[300px] h-[300px] bg-green-600 rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10 w-full">
                <div className="flex items-center justify-center">
                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
                        <h1 className="mb-1 text-gray-300 text-center font-extrabold text-3xl" data-aos="fade-right" data-aos-delay="100">Login</h1>
                        <div className="rounded-xl md:w-96 text-white">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    step === "email" ? sendOtp() : verifyOtp();
                                }}
                                className="p-8 rounded-xl w-80 md:w-96 text-white"
                            >
                                {!error && success && <p className="text-green-400 mb-3 font-semibold">{success}</p>}
                                {error && <p className="text-red-500 mb-3">{error}</p>}

                                <div className="flex flex-col gap-3" data-aos="fade-right" data-aos-delay="200">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full p-3 mb-4 bg-white rounded-xl text-black outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={step === "otp"}
                                    />
                                </div>

                                {step === "otp" && (
                                    <>
                                        <div className="flex flex-col gap-3" data-aos="fade-right" data-aos-delay="300">
                                            <label>OTP</label>
                                            <input
                                                type="text"
                                                placeholder="Enter OTP"
                                                className="w-full p-3 mb-4 bg-white rounded-xl text-black outline-none"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <p className="text-sm text-gray-400 text-right">OTP expires in: {formatTimer()}</p>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-4 bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 flex justify-center items-center"
                                    data-aos="fade-right" data-aos-delay="400"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : step === "email" ? "Send OTP" : "Verify OTP"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Unchanged RIGHT SIDE PANEL (leave exactly as you had it) */}
                    <div className="hidden lg:block relative md:w-3xl cursor-default">
                        <div className="absolute top-10 right-10 xl:right-28 w-20 h-20 bg-black rounded-bl-3xl z-0 border-2 border-black tag" ></div>
                        <div className="absolute top-16 left-10 lg:left-28 mx-8" >
                            <img src={logo2} alt="img" className="w-48" loading="lazy" />
                        </div>
                        <div className="bg-green-700 text-white flex flex-col justify-center px-8 pt-16 pb-10 md:mx-10 xl:mx-28 mt-10 rounded-xl overflow-hidden border-2 border-green-700">
                            <div className="mt-10 py-2 bg-green-600 rounded-lg relative z-10 px-5 ">
                                <div className="flex my-4 items-center justify-center">
                                    <h2 className="text-3xl font-bold z-10 text-center">Welcome Back to <span className="font-bold text-6xl leading-20 poppins">Sellient</span></h2>
                                    <img src={robot} alt="" className="w-32 h-32" loading="lazy" />
                                </div>
                                <blockquote className="text-white my-6 font-semibold mx-4">-Your AI-powered command center for smarter sales, sharper pitches, and seamless lead engagement. </blockquote>
                                <div className="my-6 bg-white text-black py-3 rounded-full flex justify-center items-center shadow-2xl mx-3">
                                    <h3 className="font-normal italic text-lg">"Your AI Sales Sidekick is Ready to Roll !"</h3>
                                </div>
                                <p className="text-black mt-6 font-semibold mx-4">Powered by Hogist Technologies - Redefining bulk food delivery through AI.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
