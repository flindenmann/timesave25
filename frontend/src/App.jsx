import { useState } from "react";
import CustomerList from "./components/CustomerList";
import ContractsPage from "./components/ContractsPage";

export default function App() {
  const [tab, setTab] = useState("customers");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-4">
          <h1 className="text-xl font-bold">Timesave Verwaltung</h1>
          <nav className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${tab==="customers" ? "bg-blue-600 text-white" : "border"}`}
              onClick={()=>setTab("customers")}
            >Kunden</button>
            <button
              className={`px-3 py-1 rounded ${tab==="contracts" ? "bg-blue-600 text-white" : "border"}`}
              onClick={()=>setTab("contracts")}
            >Verträge</button>
          </nav>
        </div>
      </header>

      <main className="py-6">
        {tab === "customers" ? <CustomerList /> : <ContractsPage />}
      </main>
    </div>
  );
}
