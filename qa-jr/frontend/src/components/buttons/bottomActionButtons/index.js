import React from "react";
import { ActionButtonsDiv } from "./style.js";
import { Button } from "../../../components";
import { localizedStrings } from "../../../constants/localizedStrings";

export default function BottomActionButtons({ onCancel, onSave, formId, loading, type = "submit", saveText = localizedStrings.save, ...props }) {
  return (
    <ActionButtonsDiv {...props.divProps}>
      {
        onCancel &&
        <Button
          onClick={e => {
            e.persist();
            onCancel && onCancel();
          }}
          loading={loading}
          title={localizedStrings.cancel}
          backgroundColor={"#F8F8FB"}
          textConfig={{
            color: loading ? "#fff" : "#192379",
            whiteSpace: "none",
            ...props.textConfig
          }}
          {...props.cancelButtonStyle}
        />
      }
      <Button
        form={formId}
        type={type}
        loading={loading}
        title={saveText}
        onClick={e => {
          e.persist && e.persist();
          onSave && onSave(e);
        }}
        textConfig={{
          color: "#fff",
          whiteSpace: "none",
          ...props.textConfig
        }}
        {...props.saveButtonStyle}
      />
    </ActionButtonsDiv>
  );
}
