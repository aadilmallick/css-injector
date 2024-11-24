import React from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import "./options.css";
import Switch from "react-switch";
import { appSettingsStorage } from "../background/controllers/storage";
import { useChromeStorage } from "../utils/ReactUtils";

const App: React.FC<{}> = () => {
  const {
    data: checked,
    loading,
    setValueAndStore,
  } = useChromeStorage(appSettingsStorage, "showToastNotifications");

  if (loading) {
    return null;
  }

  return (
    <main className="p-4">
      <form>
        <div className="form-control flex flex-col space-y-2">
          <label className="text-base text-gray-500">
            Enable Toast Notifications
          </label>
          <Switch
            checked={checked ?? false}
            onChange={async (checked) => {
              setValueAndStore(checked);
            }}
          />
        </div>
      </form>
    </main>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
