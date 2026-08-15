import { useState } from "react";
import { createPortal } from "react-dom";
import { ChefHat, Sparkles, HelpCircle, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import KitchenOperationsBoard from "./KitchenOperationsBoard";
import ManagerReportingDashboard from "./ManagerReportingDashboard";
import ManagerIssueManagementTab from "./ManagerIssueManagementTab";

export default function ManagerDashboard({
  orders,
  setOrders,
  triggerToast,
  setHideBottomNavbar,
}) {
  const [managerSubTab, setManagerSubTab] = useState("kitchen");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    navigate("/home", { replace: true });
    await logout();
    triggerToast("Manager logged out successfully.");
  };

  return (
    <>
      <div
        className="min-h-screen bg-neutral-50/70 py-6 px-4 sm:px-6 lg:px-8 font-sans"
        id="manager-workspace-root"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Quick Header actions like Logout for manager */}
          <div className="flex justify-between items-center bg-neutral-950 text-white rounded-2xl p-4 border border-neutral-800 shadow-lg">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-brand-orange animate-pulse" />
              <span className="font-black tracking-wider text-[10px] uppercase text-neutral-200">
                QuikaBite Kitchen System v1.4
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Logout Securely
              </button>
            </div>
          </div>

          {/* Sub Navigation for Manager */}
          <div className="bg-white p-1.5 rounded-2xl shadow-xs border border-neutral-150 flex gap-1 items-center overflow-x-auto">
            <button
              onClick={() => setManagerSubTab("kitchen")}
              className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${managerSubTab === "kitchen" ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"}`}
            >
              <ChefHat className="h-4 w-4" />
              <span>Kitchen Operations</span>
            </button>

            <button
              onClick={() => setManagerSubTab("issues")}
              className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${managerSubTab === "issues" ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"}`}
            >
              <Ticket className="h-4 w-4 text-amber-400" />
              <span>Support Tickets</span>
            </button>

            <button
              onClick={() => setManagerSubTab("reports")}
              className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${managerSubTab === "reports" ? "bg-neutral-950 text-white shadow-xs" : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"}`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Reporting</span>
            </button>
          </div>

          {managerSubTab === "kitchen" && (
            <KitchenOperationsBoard
              orders={orders}
              setOrders={setOrders}
              triggerToast={triggerToast}
              setHideBottomNavbar={setHideBottomNavbar}
            />
          )}

          {managerSubTab === "issues" && (
            <ManagerIssueManagementTab restaurantId={profile?.restaurant} />
          )}

          {managerSubTab === "reports" && (
            <div className="bg-neutral-950 rounded-3xl p-6 border border-neutral-800 shadow-2xl">
              <ManagerReportingDashboard triggerToast={triggerToast} />
            </div>
          )}
        </div>
      </div>

      {showLogoutConfirm && createPortal(
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-fade-in"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-xs w-full p-6 text-center border border-gray-100 space-y-6 animate-scale-up animate-duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <h4 className="font-display font-black text-lg text-gray-900 leading-tight">
                Are you sure you want to logout?
              </h4>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="cursor-pointer flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-300 text-gray-700 font-extrabold rounded-xl text-xs transition border border-gray-200"
              >
                No
              </button>

              <button
                onClick={handleLogout}
                className="cursor-pointer flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
