import React from "react";

import FormRowWithMultipleInputs from '../formRowWithMultipleInputs'
import FormRowWithOneInput from '../formRowWithOneInput'

export default function CardInput({
  ...options
}) {

  return options.inputs?.length ? (
    <FormRowWithMultipleInputs
      {...options}
    />
  ) : (
      <FormRowWithOneInput
        {...options}
      />
    );
}
