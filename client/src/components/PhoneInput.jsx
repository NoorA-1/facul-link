import React, { useState } from "react";
import { MuiTelInput } from "mui-tel-input";

const PhoneInput = ({ className }) => {
  const [phone, setPhone] = useState("");

  const handleChange = (newPhone) => {
    setPhone(newPhone);
    //Todo: Add validation
  };

  return (
    <MuiTelInput
      onlyCountries={["PK"]}
      defaultCountry="PK"
      disableDropdown
      fullWidth
      forceCallingCode
      value={phone}
      onChange={handleChange}
      className={className}
    />
  );
};

export default PhoneInput;
