import styled from 'styled-components'
const cardStyle = styled.div(props => ({
    display: "flex",
    margin: "25px",
    background: "#FFFFFF",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
    boxShadow: "0px 0px 13px rgba(49, 48, 99, 0.08)",
    borderRadius: "4px",
    flexDirection: 'column',
    ...props
}))
const cardTitleStyle = styled.div(props => ({
    display: "flex",
    padding: "16px",
    borderBottom: "solid 1px",
    borderColor: "rgba(0, 0, 0, 0.07)",
    alignItems: "center",
    "& p": props.shrinkable && {
       flex: "1"
    },
    ...props
}))
const placeholderAnimation = styled.div(props => ({
    animationDuration: "4s",
    animationFillMode: "forwards",
    animationIterationCount: "infinite",
    animationName: "placeHolderShimmer",
    animationTimingFunction: "linear",
    background: "linear-gradient(to right, #E5E5E5 10%,#f0f0f0 18%,#E5E5E5 33%)",
    height: "300px",
}))

export {
    cardStyle as CardStyle,
    cardTitleStyle as CardTitleStyle,
    placeholderAnimation as PlaceholderAnimation,
}