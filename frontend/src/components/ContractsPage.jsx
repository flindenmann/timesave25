import { useEffect, useMemo, useState } from "react";
import {
  listContracts, createContract, updateContract, deleteContract,
  listContractPos, createContractPos, updateContractPos, deleteContractPos
} from "../api/contracts";
import ContractForm from "./ContractForm";
import ContractPosForm from "./ContractPosForm";

export default function ContractsPage() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [active, setActive] = useState(null);

  const [positions, setPositions] = useState([]);
  const [creatingPos, setCreatingPos] = useState(false);
  const [editingPos, setEditingPos] = useState(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true); setErr("");
    try { setRows(await listContracts()); } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const loadPos = async (contractId) => {
    try { setPositions(await listContractPos({ contractId })); } catch (e) { console.error(e); }
  };

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(r =>
      String(r.contractId||"").includes(q) ||
      (r.name||"").toLowerCase().includes(q) ||
      (r.searchname||"").toLowerCase().includes(q) ||
      (r.status||"").toLowerCase().includes(q) ||
      String(r.customerId||"").includes(q)
    );
  }, [rows, query]);

  // Contracts
  const onCreate = async (payload) => { await createContract(payload); setCreating(false); await load(); };
  const onUpdate = async (payload) => { if (!editing) return; await updateContract(editing.contractId, payload); setEditing(null); await load(); };
  const onDelete = async (row) => { if (!confirm(`Vertrag ${row.name} löschen?`)) return; await deleteContract(row.contractId); if (active?.contractId===row.contractId) { setActive(null); setPositions([]); } await load(); };
  const onSelect = async (row) => { setActive(row); setCreatingPos(false); setEditingPos(null); await loadPos(row.contractId); };

  // Positions
  const onCreatePos = async (payload) => { await createContractPos({ ...payload, CONTRACT_ID: active.contractId }); setCreatingPos(false); await loadPos(active.contractId); };
  const onUpdatePos = async (payload) => { if (!editingPos) return; await updateContractPos(editingPos.contractposId, payload); setEditingPos(null); await loadPos(active.contractId); };
  const onDeletePos = async (row) => { if (!confirm(`Position ${row.contractposId} löschen?`)) return; await deleteContractPos(row.contractposId); await loadPos(active.contractId); };

  const cols = [
    ["contractId","ID"], ["customerId","Kunde"], ["name","Name"],
    ["searchname","Searchname"], ["status","Status"],
    ["amountbudget","Budget"], ["amountbudgetStd","Budget Std"], ["amountcurrentStd","Aktuell Std"],
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Verträge</h2>
          <div className="flex gap-2">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Suchen…" className="border rounded px-3 py-2"/>
            <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>setCreating(true)}>+ Neuer Vertrag</button>
          </div>
        </div>

        {err && <div className="text-red-600 mb-2">{err}</div>}
        {loading ? <div>Lade…</div> : (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  {cols.map(([k,l]) => <th key={k} className="text-left text-sm font-semibold text-gray-600 px-4 py-2 border-b">{l}</th>)}
                  <th className="px-4 py-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.contractId} className={`border-b ${active?.contractId===r.contractId ? "bg-blue-50" : ""}`}>
                    {cols.map(([k]) => <td key={k} className="px-4 py-2 text-sm">{r[k]}</td>)}
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                      <button className="px-2 py-1 border rounded" onClick={()=>onSelect(r)}>Details</button>
                      <button className="px-2 py-1 border rounded" onClick={()=>setEditing(r)}>Edit</button>
                      <button className="px-2 py-1 border rounded" onClick={()=>onDelete(r)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td className="p-4 text-sm" colSpan={cols.length+1}>Keine Verträge.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {creating && (
          <div className="mt-4 border rounded p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Neuer Vertrag</h3>
            <ContractForm onSubmit={onCreate} onCancel={()=>setCreating(false)} />
          </div>
        )}
        {editing && (
          <div className="mt-4 border rounded p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Vertrag bearbeiten (ID {editing.contractId})</h3>
            <ContractForm initialValues={{
              CUSTOMER_ID: editing.customerId,
              NAME: editing.name,
              SEARCHNAME: editing.searchname,
              STATUS: editing.status ?? "",
              CLASSIFICATION: editing.classification ?? "",
              CONDITIONSTEXT: editing.conditionstext ?? "",
              TEXT1: editing.text1 ?? "",
              TEXT2: editing.text2 ?? "",
              FEEKILOMETER: editing.feekilometer ?? 0,
              FEETRAVEL: editing.feetravel ?? 0,
              MWST: editing.mwst ?? 0.081,
              FILE: editing.file ?? "",
              AMOUNTBUDGET: editing.amountbudget ?? 0,
              AMOUNTBUDGET_STD: editing.amountbudgetStd ?? 0,
              AMOUNTCURRENT_STD: editing.amountcurrentStd ?? 0,
            }} onSubmit={onUpdate} onCancel={()=>setEditing(null)} />
          </div>
        )}
      </div>

      {active && (
        <div className="bg-white shadow-lg rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">Positionen – Vertrag {active.contractId}</h3>
            <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>setCreatingPos(true)}>+ Neue Position</button>
          </div>

          <div className="overflow-x-auto border rounded">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    ["contractposId","ID"],["text","Text"],["datestart","Start"],["dateend","Ende"],
                    ["quantity","Menge"],["unit","Einheit"],["rate","Satz"],["amount","Betrag"],["vat","MwSt"],
                  ].map(([k,l]) => <th key={k} className="text-left text-sm font-semibold text-gray-600 px-4 py-2 border-b">{l}</th>)}
                  <th className="px-4 py-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {positions.map(p => (
                  <tr key={p.contractposId} className="border-b">
                    <td className="px-4 py-2 text-sm">{p.contractposId}</td>
                    <td className="px-4 py-2 text-sm">{p.text}</td>
                    <td className="px-4 py-2 text-sm">{p.datestart}</td>
                    <td className="px-4 py-2 text-sm">{p.dateend}</td>
                    <td className="px-4 py-2 text-sm">{p.quantity}</td>
                    <td className="px-4 py-2 text-sm">{p.unit}</td>
                    <td className="px-4 py-2 text-sm">{p.rate}</td>
                    <td className="px-4 py-2 text-sm">{p.amount}</td>
                    <td className="px-4 py-2 text-sm">{p.vat}</td>
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                      <button className="px-2 py-1 border rounded" onClick={()=>setEditingPos(p)}>Edit</button>
                      <button className="px-2 py-1 border rounded" onClick={()=>onDeletePos(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {positions.length === 0 && <tr><td className="p-4 text-sm" colSpan={10}>Noch keine Positionen.</td></tr>}
              </tbody>
            </table>
          </div>

          {creatingPos && (
            <div className="mt-4 border rounded p-4 bg-gray-50">
              <h4 className="font-semibold mb-2">Neue Position</h4>
              <ContractPosForm contractId={active.contractId} onSubmit={onCreatePos} onCancel={()=>setCreatingPos(false)} />
            </div>
          )}
          {editingPos && (
            <div className="mt-4 border rounded p-4 bg-gray-50">
              <h4 className="font-semibold mb-2">Position bearbeiten (ID {editingPos.contractposId})</h4>
              <ContractPosForm
                contractId={active.contractId}
                initialValues={{
                  EMPLOYEE_ID: editingPos.employeeId,
                  COSTCENTER_ID: editingPos.costcenterId,
                  TEXT: editingPos.text,
                  DATESTART: editingPos.datestart,
                  DATEEND: editingPos.dateend,
                  QUANTITY: editingPos.quantity,
                  UNIT: editingPos.unit,
                  RATE: editingPos.rate,
                  AMOUNT: editingPos.amount,
                  VAT: editingPos.vat,
                }}
                onSubmit={onUpdatePos}
                onCancel={()=>setEditingPos(null)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
