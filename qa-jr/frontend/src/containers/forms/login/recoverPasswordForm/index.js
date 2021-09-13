import React from 'react'
import { localizedStrings } from "constants/localizedStrings";
import { useSelector } from "react-redux";
import { Input, Button, Text } from "components";
import {
  Br,
} from "./style.js";
export default function RecoverPasswordForm({
  onSubmit,
  errors,
  getValues,
  register,
  setValue
}) {
  const {
    recoverLoading,
  } = useSelector(state => state.auth);

  return (
    <form onSubmit={onSubmit}>
      <Text
        fontSize="13px"
        fontWeight="bold"
        lineHeight="19px"
        color="#666666"
      >
        {localizedStrings.newPassword}
      </Text>
      <Input
        error={errors.passwordEmpty.error}
        errorTitle={
          errors.passwordEmpty.error
            ? errors.passwordEmpty.message
            : false
        }
        defaultValue={getValues().password}
        ref={register({
          name: "password",
          required: true,
        })}
        onChange={event => {
          event.persist();
          setValue("password", event.target.value);
        }}
        placeholder={localizedStrings.typePassword}
        type="password"
      />
      <Br height="25px" />
      <Text
        fontSize="13px"
        fontWeight="bold"
        lineHeight="19px"
        color="#666666"
      >
        {localizedStrings.confirmYourNewPassword}
      </Text>
      <Input
        error={
          errors.newPasswordEmpty.error
            ? true
            : errors.passwordWrong.error
              ? true
              : false
        }
        errorTitle={
          errors.newPasswordEmpty.error
            ? errors.newPasswordEmpty.message
            : errors.passwordWrong.error
              ? errors.passwordWrong.error ? errors.passwordWrong.message : false
              : false
        }
        defaultValue={getValues().newPassword}
        ref={register({
          name: "newPassword",
          required: true,
        })}
        onChange={event => {
          event.persist();
          setValue("newPassword", event.target.value);
        }}
        placeholder={localizedStrings.typeNewPassword}
        type="password"
      />
      <Br height="48px" />
      <Button
        width="100%"
        fontWeight="500"
        textConfig={{ style: { color: "#fff" } }}
        title={localizedStrings.enter}
        loading={recoverLoading}
        type="submit"
      />
    </form>
  )
}

