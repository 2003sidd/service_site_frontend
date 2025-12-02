import { useEffect, useState } from "react";
import { getConfig, saveConfig } from "../services/user.service";
import type { Config } from "../types/responseTypes/ConfigResponse";
import { useAuth } from "../context/AuthContext";
import Toast from "../utility/toast";
import axios, { AxiosError } from "axios";

const ConfigPage: React.FC = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const fetchConfig = async () => {
    try {
      const res = await getConfig();
      if (res.data) {
        setConfig(res.data);
      } else {
        Toast.error(res.message)
        setConfig(null)
      }
    } catch (err: any) {
      if (axios.isAxiosError(error)) {
        // Now that TypeScript knows this is an AxiosError, we can access error.response
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          // Handle API response errors (e.g., 400, 404, 500, etc.)
          if (axiosError.response.status === 401) {

            logout();
          }
        }
      }
      setError("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    let newValue: string | boolean = value;
    if (type === "checkbox" && "checked" in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }

    if (config) {
      setConfig({
        ...config,
        [name]: newValue,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      setSaving(true);
      const data = await saveConfig(config)
      if (data.data) {
        Toast.success(data.message)
      } else {
        Toast.error(data.message)
      }
    } catch (err) {

      if (axios.isAxiosError(error)) {
        // Now that TypeScript knows this is an AxiosError, we can access error.response
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          // Handle API response errors (e.g., 400, 404, 500, etc.)
          if (axiosError.response.status === 401) {

            logout();
          }
        }
      }

      alert("Failed to update configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading configuration...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!config) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-[--primary-color]">
        App Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Customer App Version
            </label>
            <input
              type="text"
              name="CustomerAppVersion"
              value={config.CustomerAppVersion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Technician App Version
            </label>
            <input
              type="text"
              name="TechnicianAppVersion"
              value={config.TechnicianAppVersion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
            />
          </div>
        </div>

        {/* Checkbox */}
        {/* <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isMaintaince"
            checked={config.isMaintaince}
            onChange={handleChange}
            className="h-4 w-4 text-[--primary-color] focus:ring-[--primary-color] border-gray-300 rounded"
          />
          <label className="text-gray-700 font-medium">
            Maintenance Mode
          </label>
        </div> */}

        {/* Textareas and others
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            About Us
          </label>
          <textarea
            name="aboutUs"
            value={config.aboutUs}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
          />
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNumber"
              value={config.contactNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={config.contactEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
            />
          </div>
        </div>

        {/* <div>
          <label className="block text-gray-700 font-medium mb-1">
            Privacy Policy
          </label>
          <textarea
            name="privacyPolicy"
            value={config.privacyPolicy}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
          />
        </div> */}

        {/* <div>
          <label className="block text-gray-700 font-medium mb-1">
            Terms and Conditions
          </label>
          <textarea
            name="termAndConditon"
            value={config.termAndConditon}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
          />
        </div> */}

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            QR Image URL
          </label>
          <div className="flex justify-center my-0">
            <img className=" max-h-80" src={config.qrImage} />
          </div>
          <input
            type="text"
            name="qrImage"
            value={config.qrImage}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-md text-white bg-[var(--primary-color)] font-semibold bg-[--primary-color] hover:opacity-90 disabled:opacity-60 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigPage;
