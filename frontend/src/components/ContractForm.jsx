import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ContractForm({ initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      CUSTOMER_ID: "",
      NAME: "",
      SEARCHNAME: "",
      STATUS: "active",
      CLASSIFICATION: "",
      CONDITIONSTEXT: "",
      TEXT1: "",
      TEXT2: "",
      FEEKILOMETER: 0,
      FEETRAVEL: 0,
      MWST: 0.081,
      FILE: "",
      AMOUNTBUDGET: 0,
      AMOUNTBUDGET_STD: 0,
      AMOUNTCURRENT_STD: 0,
      ...initialValues,
    }
  });

  useEffect(() => { if (initialValues) reset(initialValues); }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
      {[
        ["CUSTOMER_ID","Kunden-ID*","number", { required: "Pflichtfeld" }],
        ["NAME","Name*","text", { required: "Pflichtfeld" }],
        ["SEARCHNAME","Searchname*","text", { required: "Pflichtfeld" }],
        ["STATUS","Status","text", {}],
        ["CLASSIFICATION","Klassifizierung","text", {}],
        ["CONDITIONSTEXT","Bedingungen","text", {}],
        ["TEXT1","Text 1","text", {}],
        ["TEXT2","Text 2","text", {}],
        ["FEEKILOMETER","Fee/Km","number", {}],
        ["FEETRAVEL","Reisespesen","number", {}],
        ["MWST","MwSt","number", {}],
        ["AMOUNTBUDGET","Budget Betrag","number", {}],
        ["AMOUNTBUDGET_STD","Budget Std","number", {}],
        ["AMOUNTCURRENT_STD","Aktuell Std","number", {}],
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
