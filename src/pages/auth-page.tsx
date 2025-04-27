// auth-page.tsx
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "../hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Redirect } from "wouter";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useOtpVerification } from "@/hooks/useOtpVerification";
import { error } from "node:console";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});


const registerSchema = loginSchema.extend({
  ownerName: z.string().min(3, "Name must be at least 3 characters"),
  shopName: z.string().min(3, "Shop name must be at least 3 characters")
    .max(50, "Shop name too long"),
  // email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
});


export default function AuthPage() {
  const { loginMutation, registerMutation, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [otpStep, setOtpStep] = useState(false);
  const [isRegisterActive, setIsRegisterActive] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      ownerName: "",
      // email: "",
      shopName: "",
      password: "",

    },
  });

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  const {
    otp,
    setOtp,
    otpVerified,
    isSendingOtp,
    isVerifying,
    sendOTP,
    verifyOTP
  } = useOtpVerification();

  // Helper function
  function calculatePasswordStrength(password: string): number {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }

  async function sendOTPHelper(email: string) {
    const res = await sendOTP(email);
    console.log("OTP sent:", res);
      if (res == true) {
        toast({
          title: "OTP Sent",
          description: "Please check your email for the OTP",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
  }

  async function verifyOTPHelper(email: string, otp: string) {
const isVerified = await verifyOTP(email, otp);
    console.log("OTP verified:", isVerified);
    if (isVerified == true) {
      toast({
        title: "OTP Verified",
        description: "You can now proceed to register",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header with logo */}
      <header className="w-full py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-700 cursor-pointer" onClick={() => window.location.href = "/"}>ShopSage</h1>
        </div>
      </header>

      <div className={`flex-grow ${isRegisterActive ? 'flex justify-center' : 'grid md:grid-cols-2'} gap-8 w-full max-w-7xl mx-auto p-4 md:p-8`}>      {/* Auth Forms Section */}
        <motion.div
          className={`flex items-center justify-center ${isRegisterActive ? 'w-full md:w-[600px]' : 'w-full'}`}
          initial={false}
          animate={{
            scale: isRegisterActive ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`w-full border-0 shadow-xl bg-white rounded-2xl overflow-hidden ${isRegisterActive ? 'md:max-w-2xl' : 'max-w-md'}`}>
            <motion.div
              className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Welcome to ShopSage
              </CardTitle>
              <CardDescription className="text-gray-600">
                {activeTab === "login"
                  ? "Login to access your dashboard and tools"
                  : "Register your shop to get started with ShopSage"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value);
                  setIsRegisterActive(value === "register");
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8 rounded-lg bg-blue-50">
                  <TabsTrigger
                    value="login"
                    className="rounded-md py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="rounded-md py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="login" key="login">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Form {...loginForm}>
                        <form
                          onSubmit={loginForm.handleSubmit((data) =>
                            loginMutation.mutate(data)
                          )}
                          className="space-y-5"
                        >
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Username</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="py-6 px-4 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter your username"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
  control={loginForm.control}
  name="password"
  render={({ field }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <FormItem className="relative">
        <FormLabel className="text-gray-700">Password</FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              {...field}
              className="py-6 px-4 pr-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>

                          <div className="flex justify-end mb-2">
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                              Forgot password?
                            </a>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl text-lg font-semibold"
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Logging in...
                                </span>
                              ) : "Login"}
                            </Button>
                          </motion.div>
                        </form>
                      </Form>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="register" key="register">
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Form {...registerForm}>
                        <form
                          onSubmit={registerForm.handleSubmit(
                            (data) => {
                              // Handle successful form submission
                              registerMutation.mutate(data, {
                                onError: (error) => {
                                  console.error("Mutation Error:", error); // Log mutation errors
                                },
                              });
                            },
                            (errors) => {
                              // Log validation errors
                              console.error("Validation Errors:", errors);
                            }
                          )}
                          className="space-y-5"
                        >
                          {/* First row - Shop Name full width */}
                          <FormField
                            control={registerForm.control}
                            name="shopName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Shop Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="h-12 px-4 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter your Shop name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Second row - Two columns */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Owner Name */}
                            <FormField
                              control={registerForm.control}
                              name="ownerName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">Your Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="h-12 px-4 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                      placeholder="John Doe"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Email */}
                            {/*{ <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">Email</FormLabel>
                                  <div className="flex gap-2">
                                    <FormControl>
                                      <Input
                                        {...field}
                                        className={`h-12 px-4 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                                          otpVerified ? "border-green-500 focus:border-green-500 focus:ring-green-500" : ""
                                        }`}
                                        placeholder="sam@gmail.com"
                                        type="email"
                                        disabled={otpStep}
                                      />
                                    </FormControl>
                                    {!otpVerified && !otpStep && (
                                      <Button
                                        type="button"
                                        onClick={() => {
                                          if (registerForm.getValues("email")) {
                                            sendOTPHelper(registerForm.getValues("email"));
                                            setOtpStep(true);
                                          }
                                        }}
                                        className="h-12 whitespace-nowrap px-4 bg-blue-600 hover:bg-blue-700"
                                      >
                                        Send OTP
                                      </Button>
                                    )}
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            /> */}
                          </div>

                          {/* OTP Verification - Full width when active */}
                          {/* // {otpStep && !otpVerified && ( */}
                          {/* //   <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                          //     <div className="text-sm font-medium text-gray-700">Enter Verification Code</div>
                          //     <div className="flex items-center gap-3">
                          //       <Input 
                          //         value={otp}
                          //         onChange={(e) => setOtp(e.target.value)}
                          //         placeholder="6-digit code"
                          //         className="h-12 flex-1"
                          //       />
                          //       <Button
                          //         type="button"
                          //         onClick={() => verifyOTPHelper(registerForm.getValues("email"), otp)}
                          //         className="h-12 bg-green-600 hover:bg-green-700"
                          //       >
                          //         Verify
                          //       </Button>
                          //     </div>
                          //     <div className="flex justify-between items-center">
                          //       <Button
                          //         type="button"
                          //         variant="ghost"
                          //         size="sm"
                          //         onClick={() => setOtpStep(false)}
                          //         className="text-blue-600 hover:text-blue-800 text-sm"
                          //       >
                          //         Change Email
                          //       </Button>
                          //       <Button
                          //         type="button"
                          //         variant="ghost"
                          //         size="sm"
                          //         onClick={() => sendOTPHelper(registerForm.getValues("email"))}
                          //         className="text-blue-600 hover:text-blue-800 text-sm"
                          //       >
                          //         Resend OTP
                          //       </Button>
                          //     </div>
                          //   </div>
                          // )}*/}

                          {/* Third row - Two columns */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Username */}
                            <FormField
                              control={registerForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">Username</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="h-12 px-4 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                      placeholder="Choose a unique username"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Password */}
                            <FormField
  control={registerForm.control}
  name="password"
  render={({ field }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const strength = calculatePasswordStrength(field.value);

    return (
      <FormItem className="relative">
        <FormLabel className="text-gray-700">Password</FormLabel>
        <FormControl>
          <div className="space-y-2 relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              {...field}
              className="h-12 px-4 pr-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-500 text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength === 4 ? 'bg-green-500' :
                    strength === 3 ? 'bg-blue-500' :
                    strength === 2 ? 'bg-yellow-500' :
                    strength === 1 ? 'bg-orange-500' : 'bg-gray-300'}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium">
                {strength === 4 ? 'Strong' :
                 strength === 3 ? 'Good' :
                 strength === 2 ? 'Fair' :
                 strength === 1 ? 'Weak' : ''}
              </span>
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>

                          </div>

                          {/* Submit Button - Full width */}
                          <div className="pt-2">
                            <Button
                              type="submit"
                              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg text-lg font-semibold shadow-md transition-all"
                              disabled={registerMutation.isPending || !otpVerified}
                            >
                              {registerMutation.isPending ? (
                                <div className="flex items-center gap-2">
                                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Creating Account...
                                </div>
                              ) : "Register Now"}
                            </Button>
                          </div>

                          {/* Already have account link */}
                          <div className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("login");
                                setIsRegisterActive(false);

                              }}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Sign in
                            </button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right side info section */}
        {!isRegisterActive && (
          <motion.div
            className="hidden md:flex flex-col justify-center"
            initial={{ opacity: 1 }}
            animate={{
              opacity: isRegisterActive ? 0 : 1,
              transitionEnd: {
                display: isRegisterActive ? 'none' : 'flex'
              }
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-8 max-w-lg">
              <div>
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  Welcome to ShopSage
                </motion.h2>
                <motion.p
                  className="mt-4 text-xl text-gray-600 leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Your complete solution for inventory management and business operations
                </motion.p>
              </div>

              {/* Features with animations */}
              <div className="space-y-6">
                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Secure Access</h3>
                    <p className="text-gray-600">Role-based permissions ensure each team member has appropriate access</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Real-time Analytics</h3>
                    <p className="text-gray-600">Monitor your business performance with detailed analytics and reports</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Save Time</h3>
                    <p className="text-gray-600">Streamline operations and automate tedious tasks</p>
                  </div>
                </motion.div>
              </div>

              {/* Testimonial */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">John Doe</p>
                    <p className="text-sm text-gray-500">Small Business Owner</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "ShopSage has transformed how we manage inventory. The intuitive interface and powerful features have helped us increase efficiency by 40%."
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating elements for visual interest */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-blue-600 opacity-5"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, 30, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-white py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-gray-500 text-sm">
          © 2025 ShopSage. All rights reserved. <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> | <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}