import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/authService";
import { dinerService } from "../api/dinerService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return authService.getCurrentUser().isLoggedIn;
  });
  const [userRole, setUserRole] = useState(() => {
    return authService.getCurrentUser().role;
  });
  const [profile, setProfile] = useState(() => {
    return authService.getCurrentUser().profile;
  });

  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [walletBalance, setWalletBalance] = useState("250.00");
  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    push: true,
    sms: false,
    offers: true,
    orders: true,
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsLoggedIn(user.isLoggedIn);
    setUserRole(user.role);
    setProfile(user.profile);

    const loadContextData = async () => {
      if (user.isLoggedIn) {
        try {
          const serverProfile = await authService.getProfile();
          if (serverProfile) {
            setProfile(serverProfile);
          }
          const addrs = await authService.getAddresses();
          setAddresses(addrs);
          const pays = await authService.getPayments();
          setPayments(pays);
          const balance = await dinerService.getWalletBalance();
          setWalletBalance(balance);
          const prefs = await authService.getNotificationPrefs();
          setNotifPrefs(prefs);
        } catch (e) {
          console.error("Failed to load context preferences:", e);
        }
      } else {
        setAddresses([]);
        setPayments([]);
        setWalletBalance("250.00");
        setNotifPrefs({
          email: true,
          push: true,
          sms: false,
          offers: true,
          orders: true,
        });
      }
    };
    loadContextData();
  }, [isLoggedIn]);

  // ---------------------------------------------------------------------------
  // OTP LOGIN FLOW — Step 1
  // Call when the user submits their phone number on the login screen.
  // Returns: { success: true, expiresIn: 60 }
  // ---------------------------------------------------------------------------
  const sendLoginOtp = async (phone, channel, role) => {
    return await authService.sendLoginOtp(phone, channel, role);
  };

  // ---------------------------------------------------------------------------
  // OTP LOGIN FLOW — Step 2
  // Call when the user submits the 4-digit OTP on the verification screen.
  // On success, sets isLoggedIn, userRole, and profile in context.
  // Returns: { isLoggedIn: true, role, profile }
  // ---------------------------------------------------------------------------
  const verifyLoginOtp = async (phone, otp, role, sessionId) => {
    const data = await authService.verifyLoginOtp(phone, otp, role, sessionId);
    setIsLoggedIn(data.isLoggedIn);
    setUserRole(data.role);
    setProfile(data.profile);
    return data;
  };

  // ---------------------------------------------------------------------------
  // OTP SIGNUP FLOW — Step 1
  // Call when the user submits name + phone on the signup screen.
  // Returns: { success: true, expiresIn: 60 }
  // ---------------------------------------------------------------------------
  const sendSignupOtp = async (name, phone, channel) => {
    return await authService.sendSignupOtp(name, phone, channel);
  };

  // ---------------------------------------------------------------------------
  // OTP SIGNUP FLOW — Step 2
  // Call when the user submits the 4-digit OTP on the verification screen
  // (signup context). Registers the user, then sets session state.
  // Returns: { isLoggedIn: true, role: "user", profile }
  // ---------------------------------------------------------------------------
  const verifySignupOtp = async (name, phone, otp, sessionId) => {
    const data = await authService.verifySignupOtp(name, phone, otp, sessionId);
    setIsLoggedIn(data.isLoggedIn);
    setUserRole(data.role);
    setProfile(data.profile);
    return data;
  };

  // ---------------------------------------------------------------------------
  // RESEND OTP
  // Call when the user clicks "Resend Code" on the OTP verification screen.
  // context: "login" | "signup"
  // Returns: { success: true, expiresIn: 60 }
  // ---------------------------------------------------------------------------
  const resendOtp = async (phone, channel, context = "login", name = "") => {
    return await authService.resendOtp(phone, channel, context, name);
  };

  // ---------------------------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------------------------
  const logout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUserRole("user");
    setProfile(null);
    setAddresses([]);
    setPayments([]);
    setWalletBalance("250.00");
    setNotifPrefs({
      email: true,
      push: true,
      sms: false,
      offers: true,
      orders: true,
    });
  };

  // ---------------------------------------------------------------------------
  // PROFILE & PREFERENCES
  // ---------------------------------------------------------------------------
  const updateProfile = async (newProfile) => {
    const updated = await authService.updateProfile(newProfile);
    setProfile(updated);
    return updated;
  };

  const saveAddresses = async (newAddresses) => {
    const updated = await authService.saveAddresses(newAddresses);
    setAddresses(updated);
    return updated;
  };

  const addAddress = async (addressData) => {
    const newAddr = await authService.createAddress(addressData);
    const addrs = await authService.getAddresses();
    setAddresses(addrs);
    return newAddr;
  };

  const updateAddress = async (id, addressData) => {
    const updatedAddr = await authService.updateAddress(id, addressData);
    const addrs = await authService.getAddresses();
    setAddresses(addrs);
    return updatedAddr;
  };

  const deleteAddress = async (id) => {
    await authService.deleteAddress(id);
    const addrs = await authService.getAddresses();
    setAddresses(addrs);
  };

  const savePayments = async (newPayments) => {
    const updated = await authService.savePayments(newPayments);
    setPayments(updated);
    return updated;
  };

  const saveWalletBalance = async (newBalance) => {
    await dinerService.saveWalletBalance(newBalance);
    setWalletBalance(newBalance);
  };

  const saveNotifPrefs = async (prefs) => {
    const updated = await authService.saveNotificationPrefs(prefs);
    setNotifPrefs(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userRole,
        setUserRole,
        profile,
        setProfile,
        // OTP auth methods
        sendLoginOtp,
        verifyLoginOtp,
        sendSignupOtp,
        verifySignupOtp,
        resendOtp,
        // Session
        logout,
        // Profile & preferences
        updateProfile,
        addresses,
        setAddresses: saveAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        payments,
        setPayments: savePayments,
        walletBalance,
        setWalletBalance: saveWalletBalance,
        notifPrefs,
        setNotifPrefs: saveNotifPrefs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
