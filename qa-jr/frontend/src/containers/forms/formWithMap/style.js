import styled from 'styled-components'

export const MapControlsStyle = styled.div(props => ({
    position: "absolute",
    left: "8px",
    top: "9px",
    width: "500px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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