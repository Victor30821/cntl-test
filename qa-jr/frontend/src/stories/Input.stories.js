import React from "react";
import { Input } from "components";
export default {
    title: "Inputs"
};
export const InputPhone = () => (
    <Input type={"phone"} name={"phone"} />
);
export const InputNumber = () => (
    <Input type={"number"} name={"number"} maxLength={10} />
);
export const InputDateTime = () => (
    <Input type={"datetime"} name={"datetime"} />
);
export const InputDate = () => (
    <Input type={"date"} name={"date"} />
);
export const InputCep = () => (
    <Input type={"cep"} name={"cep"} />
);
export const InputDriverLicense = () => (
    <Input type={"driver_license"} name={"driver_license"} />
);
export const InputCnpj = () => (
    <Input type={"cnpj"} name={"cnpj"} />
);
export const InputCpf = () => (
    <Input type={"cpf"} name={"cpf"} />
);
export const InputNormal = () => (
    <Input placeholder={"digite algo"} type={"text"} maxLength={5} />
);
export const InputError = () => (
    <Input error={true} errorTitle="aaa" />
);
