import React, { useState } from "react";
import { MuiTelInput } from "mui-tel-input";
import { FormControl, FormHelperText } from "@mui/material";

const PhoneInput = ({
  name,
  value,
  onChange,
  onBlur,
  helperText,
  error,
  className,
}) => {
  // const [phone, setPhone] = useState("");

  // const handleChange = (newPhone) => {
  //   setPhone(newPhone);
  //   //Todo: Add validation
  // };

  return (
    <MuiTelInput
      onlyCountries={["PK"]}
      defaultCountry="PK"
      disableDropdown
      fullWidth
      forceCallingCode
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};

export default PhoneInput;
