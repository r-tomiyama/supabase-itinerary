"use client";

import { ItineraryFormData as CreateItineraryFormData } from "@/client/actions/createItinerary";
import { ItineraryFormData as UpdateItineraryFormData } from "@/client/actions/updateItinerary";
import { FormField } from "@ui/form-field";
import { Input } from "@ui/input";
import { Select } from "@ui/select";

type FormFieldNames = keyof CreateItineraryFormData | keyof UpdateItineraryFormData;

interface ItineraryFormFieldProps {
  label: string;
  name: FormFieldNames;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  options?: { value: string | number; label: string }[];
  ariaLabel?: string;
}

export function ItineraryFormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  min,
  value,
  onChange,
  options,
  ariaLabel,
}: ItineraryFormFieldProps) {
  return (
    <FormField label={label} htmlFor={name} required={required}>
      {options ? (
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          options={options}
          aria-label={ariaLabel}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
        />
      )}
    </FormField>
  );
}
