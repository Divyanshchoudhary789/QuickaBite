import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../common/Modal";
import { Plus, Trash2, Search, Star } from "lucide-react";
import { adminService } from "../../api/adminService";

export default function DriversTab({ onDriversChange, triggerToast }) {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("Motorcycle");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const list = await adminService.getDrivers();
        setDrivers(list);
        if (onDriversChange) {
          onDriversChange(list.length);
        }
      } catch (e) {
        console.error("Failed to load drivers:", e);
      }
    };
    loadDrivers();
  }, [onDriversChange]);

  const saveDrivers = async (updated) => {
    setDrivers(updated);
    await adminService.saveDrivers(updated);
    if (onDriversChange) {
      onDriversChange(updated.length);
    }
  };
  const handleCreateDriver = (e) => {
    e.preventDefault();
    if (!name || !phone || !vehicleDetails) {
      triggerToast("Please fill out all required fields.");
      return;
    }
    const newDriver = {
      id: `drv-${Date.now()}`,
      name,
      phone,
      rating: 5,
      vehicle: `${vehicleDetails} (${vehicle})`,
      status: "idle",
      totalDeliveries: 0,
    };
    const updated = [...drivers, newDriver];
    saveDrivers(updated);
    triggerToast(
      `Courier partner "${name}" registered on the dispatcher ledger!`,
    );
    setName("");
    setPhone("");
    setVehicleDetails("");
    setLicensePlate("");
    setShowAddModal(false);
  };
  const handleStatusChange = (id, nextStatus) => {
    const updated = drivers.map((d) => {
      if (d.id === id) {
        triggerToast(
          `Driver "${d.name}" status updated to ${nextStatus.toUpperCase()}`,
        );
        return { ...d, status: nextStatus };
      }
      return d;
    });
    saveDrivers(updated);
  };
  const handleDeleteDriver = (id) => {
    const target = drivers.find((d) => d.id === id);
    const filtered = drivers.filter((d) => d.id !== id);
    saveDrivers(filtered);
    triggerToast(
      `Courier "${target?.name || ""}" removed from the dispatcher ledger.`,
    );
  };
  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      d.vehicle.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );
  return (
    <div className="space-y-6 animate-fade-in" id="drivers-tab-viewport">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
            Delivery Fleet Partners
          </h3>
          <p className="text-[10px] text-neutral-400 font-semibold">
            Monitor delivery partner activity, track performance rankings, and
            onboard logistics couriers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative bg-neutral-50 border border-neutral-150 rounded-xl px-3.5 py-2 flex items-center gap-2 max-w-xs shrink-0">
            <Search className="h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search courier or vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs font-semibold text-neutral-900 outline-none w-48"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-brand-orange hover:bg-orange-700 text-white font-black text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Onboard Courier</span>
          </button>
        </div>
      </div>

      {/* DRIVERS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {filteredDrivers.map((d) => {
          let statusClass =
            "bg-neutral-100 text-neutral-500 border-neutral-200";
          let statusLabel = "Offline";
          if (d.status === "idle") {
            statusClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
            statusLabel = "Idle (Available)";
          } else if (d.status === "delivering") {
            statusClass = "bg-sky-50 text-sky-600 border-sky-200";
            statusLabel = "Delivering";
          }
          return (
            <div
              key={d.id}
              className="bg-white border border-neutral-150 rounded-3xl p-5 shadow-xs flex flex-col justify-between relative hover:border-neutral-300 transition"
            >
              <div>
                <div className="flex justify-between items-start gap-3">
                  <span
                    className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                  <div className="flex items-center gap-0.5 font-bold text-amber-500 font-mono text-[10px]">
                    <Star className="h-3 w-3 fill-amber-500" />
                    <span>{d.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-black text-neutral-900 text-sm leading-tight">
                    {d.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-neutral-400 mt-0.5 font-mono">
                    {d.phone}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5 text-[10px] font-semibold text-neutral-500">
                  <div className="flex justify-between">
                    <span>Vehicle assigned:</span>
                    <span className="text-neutral-800 font-bold">
                      {d.vehicle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total deliveries:</span>
                    <span className="text-neutral-800 font-bold font-mono">
                      {d.totalDeliveries}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex justify-between gap-2">
                <select
                  value={d.status}
                  onChange={(e) => handleStatusChange(d.id, e.target.value)}
                  className="flex-1 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-bold text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer outline-none focus:border-brand-orange border border-neutral-150 px-2 text-center"
                >
                  <option value="idle">Idle</option>
                  <option value="delivering">Delivering</option>
                  <option value="offline">Offline</option>
                </select>
                <button
                  onClick={() => handleDeleteDriver(d.id)}
                  className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition cursor-pointer"
                  title="Remove Courier"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-950 mb-1">
          Onboard Logistics Courier
        </h3>
        <p className="text-[10px] font-semibold text-neutral-400 mb-4">
          Onboard and register a new courier driver into the local
          delivery fleet database.
        </p>

        <form onSubmit={handleCreateDriver} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
              Driver Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
              Mobile Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
              Vehicle Type & Model
            </label>
            <input
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder="e.g. Honda Activa 6G (EV/Bike)"
              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">
              License Plate Number
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="e.g. MH 02 CD 4567"
              className="w-full bg-neutral-50 border border-neutral-150 rounded-xl p-3 text-xs font-semibold outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand-orange hover:bg-orange-700 text-white font-black py-3 rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              Onboard Courier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
