// frontend/src/components/CustomerForm.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  SEARCHNAME: z.string().min(1, "Pflichtfeld"),
  NAME: z.string().min(1, "Pflichtfeld"),
  TITLE: z.string().optional().or(z.literal("")),
  IS_COMPANY: z
    .union([z.string(), z.number(), z.boolean()])
    .transform(v => Number(v) ? 1 : 0)
    .optional()
    .default(0),
  FIRSTNAME: z.string().optional().or(z.literal("")),
  COMPANY_ID: z
    .union([z.string(), z.number()])
    .transform(v => v === "" ? null : Number(v))
    .nullable()
    .optional(),
  CLASSIFICATION: z.string().optional().or(z.literal("")),
  STREET1: z.string().optional().or(z.literal("")),
  STREET2: z.string().optional().or(z.literal("")),
  STREET3: z.string().optional().or(z.literal("")),
  POSTALCODE: z.string().optional().or(z.literal("")),
  CITY: z.string().optional().or(z.literal("")),
  PHONE: z.string().optional().or(z.literal("")),
  EMAIL: z.string().email("Ungültige E-Mail").or(z.literal("")).optional(),
  SALUTATION: z.string().optional().or(z.literal("")),
  CONTACT: z.string().optional().or(z.literal("")),
});

export default function CustomerForm({ initialValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      SEARCHNAME: "",
      NAME: "",
      TITLE: "",
      IS_COMPANY: 0,
      FIRSTNAME: "",
      COMPANY_ID: null,
      CLASSIFICATION: "",
      STREET1: "",
      STREET2: "",
      STREET3: "",
      POSTALCODE: "",
      CITY: "",
      PHONE: "",
      EMAIL: "",
      SALUTATION: "",
      CONTACT: "",
      ...initialValues,
    },
  });

  useEffect(() => { if (initialValues) reset(initialValues); }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
      {[
        ["SEARCHNAME", "Suchname*"], ["NAME", "Name*"], ["TITLE", "Titel"],
        ["FIRSTNAME", "Vorname"], ["IS_COMPANY", "Firma (0/1)"],
        ["COMPANY_ID", "Company-ID"], ["CLASSIFICATION", "Klasse"],
        ["STREET1", "Strasse 1"], ["STREET2", "Strasse 2"], ["STREET3", "Strasse 3"],
        ["POSTALCODE", "PLZ"], ["CITY", "Ort"], ["PHONE", "Telefon"], ["EMAIL", "E-Mail"],
        ["SALUTATION", "Anrede"], ["CONTACT", "Kontaktperson"],
      ].map(([key, label]) => (
        <div key={key} className="col-span-1">
          <label className="block text-sm font-medium mb-1">{label}</label>
          <input
            {...register(key)}
            className="w-full border rounded p-2"
            type={key === "EMAIL" ? "email" : (key === "IS_COMPANY" || key === "COMPANY_ID") ? "number" : "text"}
          />
          {errors[key] && (
            <p className="text-red-600 text-sm mt-1">{errors[key]?.message?.toString()}</p>
          )}
        </div>
      ))}
      <div className="col-span-2 flex gap-2 mt-2">
        <button disabled={isSubmitting} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Speichern
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
            Abbrechen
          </button>
        )}
      </div>
    </form>
  );
}