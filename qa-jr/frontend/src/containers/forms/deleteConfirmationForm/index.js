import React from "react";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import {  Col, BottomActionButtons, Text } from "components";
import { DeleteConfirmation } from './style';

export default function DeleteConfirmationForm({ onCancel, onConfirm, loading }) {
    return (
      <DeleteConfirmation>
        <Row>
            <Col xl="12" md="12">
                <Text
                    color="#666666"
                    fontSize="18px"
                    fontWeight="500"
                    lineHeight="22px">
                    {localizedStrings.areYouSureUWantToDelete}
                </Text>
            </Col>
        </Row>
        <Row>
            <Col xl="12" md="12" style={{paddingRight: "66px"}}>
                <BottomActionButtons
                    loading={loading}
                    saveText={localizedStrings.yes}
                    onCancel={onCancel}
                    onSave={onConfirm} />
            </Col>
        </Row>
      </DeleteConfirmation>
  );
}