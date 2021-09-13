import React from 'react'
import { localizedStrings } from "constants/localizedStrings";
import { useSelector } from "react-redux";
import { Input, Button } from "components";
import {
  Br,
} from "./style.js";
export default function ForgotPasswordForm({
  onSubmit,
  errors,
  getValues,
  register,
  setValue
}) {
  const {
    forgotLoading
  } = useSelector(state => state.auth);
  return (
    <form onSubmit={onSubmit}>
      <Input
        type={'email'}
        error={errors.emailEmpty.error ? true : false}
        errorTitle={
          errors.emailEmpty.error ? errors.emailEmpty.message : false
        }
        defaultValue={getValues().email}
        ref={register({
          name: "email",
          required: true,
        })}
        onChange={event => {
          event.persist();
          setValue("email", event.target.value);
        }}
        placeholder={localizedStrings.typeEmail}
      />
      <Br height="25px" />
      <Button
        width="100%"
        fontWeight="500"
        textConfig={{ style: { color: "#fff" } }}
        title={localizedStrings.send}
        loading={forgotLoading}
        type="submit"
      />
    </form>
  )
}

