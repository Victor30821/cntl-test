
import styled from 'styled-components';
import '../../../assets/fonts.css'

const filterInputWrapper = styled.label(props => ({
    display: "flex",
    position: "relative",
    width: "40%",
    flex: "1",
    minHeight: "36px",
    minWidth: "150px",
    marginLeft: props.inputWrapperMarginLeft || "30px",
    marginRight: props.inputWrapperMarginRight || "30px",
    ...props,
}))
const filterInputStyle = styled.input(props => ({
    height: "100%",
    background: props.disabled ? "#F7F7F7" : "#FFFFFF",
    border: "1px solid #E5E5E5",
    boxSizing: "border-box",
    borderRadius: "4px",
    width: "100%",
    fontSize: "14px",
    fontWeight: "bold",
    paddingLeft: "16px",
    outline: "none",
    minHeight: "inherit",
}))
const iconWrapper = styled.div(props => ({
    position: "absolute",
    right: "0px",
    height: "100%",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    paddingRight: "14px",
    paddingLeft: "12px",
    cursor: "pointer",
    background: "#F3F3F3",
    border: "1px solid #E5E5E5",
    boxSizing: "border-box",
    borderRadius: "0px 4px 4px 0px",
    ...props
}))



export {
    filterInputWrapper as FilterInputWrapper,
    filterInputStyle as FilterInputStyle,
    iconWrapper as IconWrapper,
}
