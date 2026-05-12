"use client";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

export default function Phone({ name, label, value, onChange, error }) {
  const [defaultCountry] = React.useState("in");

  return (
    <div>
      <PhoneInput
        specialLabel={label}
        country={defaultCountry}
        value={value}
        onChange={onChange}
        // countryCodeEditable={false}
        inputProps={{ name }}
        containerStyle={{ width: "100%" }}
        inputStyle={{
          width: "100%",
          height: "40px",
          fontSize: "16px",
          borderRadius: "4px",
          border: `1px solid ${error ? "#d32f2f" : "rgba(0,0,0,0.23)"}`,
          paddingLeft: "48px",
        }}
        buttonStyle={{
          border: `1px solid ${error ? "#d32f2f" : "rgba(0,0,0,0.23)"}`,
          borderRight: "none",
          borderRadius: "4px 0 0 4px",
        }}
      />

      {error && (
        <small style={{ color: "#d32f2f", fontSize: 12, marginLeft: 14 }}>
          {error}
        </small>
      )}
    </div>
  );
}
