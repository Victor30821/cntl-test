import styled from "styled-components";

export const placeholderAnimation = styled.div(props => ({
  animationDuration: "4s",
  animationFillMode: "forwards",
  animationIterationCount: "infinite",
  animationName: "placeHolderShimmer",
  animationTimingFunction: "linear",
  background: "linear-gradient(to right, #E5E5E5 10%,#f0f0f0 18%,#E5E5E5 33%)",
  height: "300px",
  width: "100%"
}));
