import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { listEmployees, listCostcenters } from "../api/lookups";

export default function ContractPosForm({ contractId, initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, watch, setValue } = useForm({
    defaultValues: {
      CONTRACT_ID: contractId,
      EMPLOYEE_ID: "",
      COSTCENTER_ID: "",
      TEXT: "",
      DATESTART: "",
      DATEEND: "",
      QUANTITY: 1,
      UNIT: "Stk",
      RATE: 0,
      AMOUNT: 0,
      VAT: 0.081,
      ...initialValues,
    }
  });

  // Lookup-Optionen
  const [empOptions, setEmpOptions] = useState([]);
  const [ccOptions, setCcOptions] = useState([]);

  // Laden bei Mount
  useEffect(() => {
    (async () => {
      try {
        const [emps, ccs] = await Promise.all([
          listEmployees(),       // [{id,name}]
          listCostcenters(),     // [{id,name}]
        ]);
        setEmpOptions(emps);
        setCcOptions(ccs);
      } catch (e) {
        console.error("Lookup load failed", e);
      }
    })();
  }, []);

  // Wenn initialValues wechseln → Formular resetten (inkl. contractId)
  useEffect(() => {
    if (initialValues) {
      reset({ CONTRACT_ID: contractId, ...initialValues });
    }
  }, [initialValues, contractId, reset]);

  // Hilfsrender für Selects
  const Select = ({ name, label, options, requiredMsg }) => (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <select
        {...register(name, requiredMsg ? { required: requiredMsg } : {})}
        className="w-full border rounded p-2 bg-white"
      >
        <option value="">— bitte wählen —</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
      {errors[name] && <p className="text-red-600 text-sm">{errors[name]?.message?.toString()}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
      {/* Lookups */}
      <Select name="EMPLOYEE_ID"   label="Mitarbeitende*" options={empOptions} requiredMsg="Pflichtfeld" />
      <Select name="COSTCENTER_ID" label="Kostenstelle*"  options={ccOptions} requiredMsg="Pflichtfeld" />

      {/* Restliche Felder */}
      {[
        ["TEXT","Text*","text",{ required:"Pflichtfeld" }],
        ["DATESTART","Start*","date",{ required:"Pflichtfeld" }],
        ["DATEEND","Ende*","date",{ required:"Pflichtfeld" }],
        ["QUANTITY","Menge*","number",{ required:"Pflichtfeld" }],
        ["UNIT","Einheit*","text",{ required:"Pflichtfeld" }],
        ["RATE","Satz*","number",{ required:"Pflichtfeld" }],
        ["AMOUNT","Betrag*","number",{ required:"Pflichtfeld" }],
        ["VAT","MwSt*","number",{ required:"Pflichtfeld" }],
      ].map(([key,label,type,rule]) => (
        <div key={key}>
          <label className="block text-sm mb-1">{label}</label>
          <input {...register(key, rule)} type={type} className="w-full border rounded p-2" />
          {errors[key] && <p className="text-red-600 text-sm">{errors[key]?.message?.toString()}</p>}
        </div>
      ))}

      <div className="col-span-2 flex gap-2 mt-2">
        <button disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Speichern</button>
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Abbrechen</button>}
      </div>
    </form>
  );
}