
import styled from 'styled-components';

export const ColorfulListStyle = styled.div(props => ({
    background: "#FFFFFF",
    transition: "all 0.2s ease-out",
    display: "flex",
    opacity: props.show ? "1" : "0",
    borderRadius: "4px 4px 0px 0px",
    marginTop: "5px",
    boxShadow: "0px 8px 13px rgba(49, 48, 99, 0.08)",
    height: '100%',
    alignItems: 'start',
    ...props,
}))

export const ListStyle = styled.ul(props => ({
    listStyle: "none",
    padding: "10px 5px",
    "& > li": {
        margin: "5px 0",
        display: "flex",
    },
    ...props
}))
export const ItemStyle = styled.li(props => ({
    "&::before": {
        content: '"\\2022"',
        color: props.color || "#f00",
        fontSize: "31px",
        display: "flex",
        margin: "-10px 10px 0px 10px",
        fontWeight: "bold",
        ...props.before
    },
    ...props
}))

