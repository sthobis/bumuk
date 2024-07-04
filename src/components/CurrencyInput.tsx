import React from "react";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  id: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  value,
  onChange,
}) => {
  return (
    <NumericFormat
      id={id}
      min={0}
      inputMode="numeric"
      customInput={Input}
      thousandSeparator="."
      decimalSeparator=","
      prefix="Rp"
      value={value}
      onValueChange={(values) => {
        onChange(values.floatValue);
      }}
    />
  );
};

export default CurrencyInput;
