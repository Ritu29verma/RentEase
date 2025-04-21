import React from "react";
import GeneralSettings from "../../components/admin/settings/GeneralSettings";
import ReminderSettings from "../../components/admin/settings/ReminderSettings";
import BillingSettings from "../../components/admin/settings/BillingSettings";
import ApprovalSettings from "../../components/admin/settings/ApprovalSettings";
import NotificationSettings from "../../components/admin/settings/NotificationSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "general": return <GeneralSettings />;
      case "reminders": return <ReminderSettings />;
      case "billing": return <BillingSettings />;
      case "approvals": return <ApprovalSettings />;
      case "notifications": return <NotificationSettings />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        {["general", "reminders", "billing", "approvals", "notifications"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? "bg-black text-white" : "bg-gray-200"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {renderTab()}
    </div>
  );
}