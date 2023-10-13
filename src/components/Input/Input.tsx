/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import "./Input.scss";
// import { Input, InputProps } from "antd";

const InputText:React.FC<any> = (props: any) => {
  return <input type="text" {...props} />;
};

export default InputText;