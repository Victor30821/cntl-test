import styled from 'styled-components'

export const MapControlsStyle = styled.div(props => ({
    position: "absolute",
    left: "8px",
    top: "9px",
    width: "370px",
    display: 'flex',
    'flex-direction': 'column',
    ...props,
}))
export const MapSearchInput = styled.div(props => ({
    display: "flex",
    flexDirection: "row",
    boxShadow: "0px 8px 13px rgba(49, 48, 99, 0.08)",
    ...props
}))
export const MapSearchIcon = styled.div(props => ({
    background: "#F3F3F3",
    border: "1px solid #E5E5E5",
    minWidth: "45px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: "4px",
    borderBottomRightRadius: "4px",
    cursor: "pointer",
}))
export const SideButtons = styled.div(props => ({
    position: "absolute",
    background: "#fff",
    right: "10px",
    bottom: "180px",
    ...props
}))
export const SideCountDiv = styled.div(props => ({
    cursor: "pointer",
    position: "absolute",
    background: "#E4E3FF",
    border: "1px solid #E5E5E5",
    boxSizing: "border-box",
    borderRadius: "13px",
    padding: "4px 10px",
    left: "10px",
    bottom: "25px",
    ...props
}))
export const BestRouteAddressContainer = styled.div(props => ({
    background: "#FFFFFF",
    transition: "all 0.2s ease-out",
    display: "flex",
    opacity: props.show ? "1" : "0",
    alignItems: "center",
    borderRadius: "4px 4px 0px 0px",
    marginTop: "5px",
    boxShadow: "0px 8px 13px rgba(49, 48, 99, 0.08)",
    flexDirection: "column"
}))
