
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { Select, Col, Text, Icon, Button } from "components";
import { SendEmailStyle } from "./style";
import { toast } from "react-toastify";

export const btnAttachDriver = {
  display: "flex",
  background: "#192379",
  flexDirection: "row",
  cursor: "pointer",
  alignItems: "center",
  border: "1px solid #1A237A",
  borderRadius: "4px",
  minWidth: "109px",
  backgroundColor: "#192379",
  justifyContent: "flex-end",
  padding: "10px",
  width: "129px",
  height: "36px",
  marginTop: "23px",
  marginLeft: "14px",
};

export default function SendEmailForm({ onClick, onCancel, document, fileName, tabName }) {

  const [attach_emails_selected, setAttach_emails_selected] = useState([]);

  const {
      loadLoadingSendEmail,
      loadSuccessSendEmail,
      loadFailSendEmail
  } = useSelector((state) => state.audit);

  useEffect(() => {
    if(loadSuccessSendEmail) {
      toast.success(localizedStrings.sendSuccess);
      onCancel();
    }
    // eslint-disable-next-line
  }, [loadSuccessSendEmail]);

  useEffect(() => {
    if(loadFailSendEmail) {
      toast.error(localizedStrings.errorOnSendEmail);
    }
    // eslint-disable-next-line
  }, [loadFailSendEmail]);

  const has_emails_selected =
    Array.isArray(attach_emails_selected) &&
    attach_emails_selected?.length > 0;

  return (
    <SendEmailStyle>
      <Row style={{ marginLeft: "0px", marginBottom: "24px", marginTop: "14px" }}>
        <Col xl="12" xxl="12" style={{ display: "flex" }}>
        <Text
            fontFamily={"Roboto"}
            fontSize={"22px"}
            lineHeight={"26px"}
            color={"#222222"}
            fontWeight={"bold"}
          >
            {localizedStrings.sendReportbyEmail}
          </Text>
          <button
            onClick={onCancel}
            style={{ marginLeft: "auto", marginRight: "28px" }}
          >
            {
              <Icon
                icon={"plus"}
                width={"20px"}
                height={"15px"}
                color={"#1D1B84"}
                float={"right"}
                cursor="pointer"
                style={{
                  marginLeft: "13px",
                  display: "flex",
                  flexDirection: "row",
                  transform: "rotate(45deg)",
                }}
              />
            }
          </button>
        </Col>
      </Row>
      <hr style={{ width: "577px" }}></hr>
      <Row style={{ marginLeft: "14px" }}>
        <Col xxl="12" xl="12" style={{ display: "contents" }}>
          <Select
            style={{maxWidth: "400px", maxHeight: "100px"}}
            title={localizedStrings.typeEmailsBellow}
            placeholder={localizedStrings.addEmail}
            isCreatable={true}
            isMulti={true}
            onChange={(item) => {
              setAttach_emails_selected(item);
            }}
            value={attach_emails_selected || []}
          />
          <Button
            style={{
              display: "flex",
              background:
                has_emails_selected
                  ? "#192379"
                  : "#B3B5C7",
              flexDirection: "row",
              cursor:
                has_emails_selected
                  ? "pointer"
                  : "not-allowed",
              alignItems: "center",
              border:
                has_emails_selected
                  ? "1px solid #1A237A"
                  : "1px solid #B3B5C7",
              borderRadius: "4px",
              minWidth: "109px",
              backgroundColor:
                has_emails_selected
                  ? "#192379"
                  : "#B3B5C7",
              justifyContent: "flex-end",
              padding: "10px",
              width: "114px",
              height: "36px",
              marginTop: "23px",
              marginLeft: "14px",
            }}
            title={localizedStrings.sendReport}
            onClick={() =>
              has_emails_selected &&
              onClick({
                document,
                fileName,
                tabName,
                emails: attach_emails_selected.map(email => email.value),
                send: true,
              })
            }
            loading={loadLoadingSendEmail}
            type={"button"}
            hasIcon={false}
          />
        </Col>
      </Row>
    </SendEmailStyle>
  );
}
