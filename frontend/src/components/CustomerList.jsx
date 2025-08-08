import { useEffect, useMemo, useState } from "react";
import { listCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api/customers";
import CustomerForm from "./CustomerForm";

export default function CustomerTable() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null); // record | null
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const rows = await listCustomers();
      // Backend liefert camelCase (Sequelize Model) oder DB-Keys? Wir mappen defensiv:
      const normalized = rows.map(r => ({
        CUSTOMER_ID: r.CUSTOMER_ID ?? r.customerId,
        SEARCHNAME: r.SEARCHNAME ?? r.searchname ?? "",
        NAME: r.NAME ?? r.name ?? "",
        TITLE: r.TITLE ?? r.title ?? "",
        IS_COMPANY: r.IS_COMPANY ?? r.isCompany ?? 0,
        FIRSTNAME: r.FIRSTNAME ?? r.firstname ?? "",
        COMPANY_ID: r.COMPANY_ID ?? r.companyId ?? null,
        CLASSIFICATION: r.CLASSIFICATION ?? r.classification ?? "",
        STREET1: r.STREET1 ?? r.street1 ?? "",
        STREET2: r.STREET2 ?? r.street2 ?? "",
        STREET3: r.STREET3 ?? r.street3 ?? "",
        POSTALCODE: r.POSTALCODE ?? r.postalcode ?? "",
        CITY: r.CITY ?? r.city ?? "",
        PHONE: r.PHONE ?? r.phone ?? "",
        EMAIL: r.EMAIL ?? r.email ?? "",
        SALUTATION: r.SALUTATION ?? r.salutation ?? "",
        CONTACT: r.CONTACT ?? r.contact ?? "",
      }));
      setData(normalized);
    } catch (e) {
      setErr(e.message || "Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (payload) => {
    await createCustomer(payload);
    setCreating(false);
    await load();
  };

  const onUpdate = async (payload) => {
    if (!editing) return;
    await updateCustomer(editing.CUSTOMER_ID, payload);
    setEditing(null);
    await load();
  };

  const onDelete = async (row) => {
    if (!confirm(`Kunde ${row.NAME} wirklich löschen?`)) return;
    await deleteCustomer(row.CUSTOMER_ID);
    await load();
  };

  const columns = useMemo(() => ([
    { key: "CUSTOMER_ID", label: "ID" },
    { key: "SEARCHNAME", label: "Suchname" },
    { key: "NAME", label: "Name" },
    { key: "TITLE", label: "Titel" },
    { key: "IS_COMPANY", label: "Typ" },
    { key: "CITY", label: "Ort" },
    { key: "EMAIL", label: "E‑Mail" },
  ]), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(r =>
      (r.NAME || "").toLowerCase().includes(q) ||
      (r.SEARCHNAME || "").toLowerCase().includes(q) ||
      (r.CITY || "").toLowerCase().includes(q) ||
      String(r.CUSTOMER_ID || "").includes(q)
    );
  }, [data, query]);

  const typeBadge = (val) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${Number(val) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
      {Number(val) ? 'Firma' : 'Privat'}
    </span>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-5 pt-5 pb-3 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Kundenverwaltung</h2>
          <div className="flex gap-2">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suchen (Name, Suchname, Ort, ID)"
                className="w-64 max-w-[70vw] pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
            </div>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
              onClick={() => setCreating(true)}
            >
              + Neuer Kunde
            </button>
          </div>
        </div>

        {err && <div className="px-5 py-3 text-red-700 bg-red-50 border-t border-b">{err}</div>}

        {loading ? (
          <div className="px-5 py-6 text-gray-500">Lade…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {columns.map(c => (
                    <th
                      key={c.key}
                      className="text-left text-xs sm:text-sm font-semibold text-gray-600 px-4 py-3 border-b"
                    >
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr
                    key={row.CUSTOMER_ID}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">{row.CUSTOMER_ID}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.SEARCHNAME}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.NAME}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.TITLE}</td>
                    <td className="px-4 py-2 text-sm">{typeBadge(row.IS_COMPANY)}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.CITY}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 truncate max-w-[220px]" title={row.EMAIL}>{row.EMAIL}</td>
                    <td className="px-4 py-2 text-sm whitespace-nowrap">
                      <button
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded mr-2"
                        onClick={() => setEditing(row)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                        onClick={() => onDelete(row)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      className="p-6 text-center text-gray-500"
                      colSpan={columns.length + 1}
                    >
                      Keine Kunden gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {creating && (
          <div className="m-5 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Neuer Kunde</h3>
            <CustomerForm onSubmit={onCreate} onCancel={() => setCreating(false)} />
          </div>
        )}

        {editing && (
          <div className="m-5 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">
              Kunde bearbeiten (ID {editing.CUSTOMER_ID})
            </h3>
            <CustomerForm
              initialValues={editing}
              onSubmit={onUpdate}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}