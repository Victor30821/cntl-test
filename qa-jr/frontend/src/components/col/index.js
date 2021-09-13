import React from "react";
import { Col } from "reactstrap";
const Colxx = props => (
  <Col
    style={{ marginBottom: 10, ...props.style }}
    {...props}
    widths={["xxs", "xs", "sm", "md", "lg", "xl", "xxl"]}
  />
);

export default Colxx;
