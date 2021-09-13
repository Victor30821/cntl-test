import React from "react";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import {  Col, BottomActionButtons, Text } from "components";
import { StatusChangeConfirmation } from './style';

export default function StatusChangeConfirmationForm({ onCancel, onConfirm, loading }) {
    return (
      <StatusChangeConfirmation>
        <Row>
            <Col xl="12" md="12">
                <Text
                    color="#666666"
                    fontSize="18px"
                    fontWeight="500"
                    lineHeight="22px">
                    {'Você tem certeza que deseja alterar esse status?'}
                </Text>
            </Col>
        </Row>
        <Row>
            <Col xl="12" md="12" >
                <BottomActionButtons
                    loading={loading}
                    saveText={localizedStrings.yes}
                    onCancel={onCancel}
                    onSave={onConfirm} />
            </Col>
        </Row>
      </StatusChangeConfirmation>
  );
}