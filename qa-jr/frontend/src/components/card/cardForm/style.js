import styled from 'styled-components'
const cardFormStyle = styled.form(props => ({
    padding: "16px",
    position: 'relative',
    margin: "10px 0 10px 0",
    display: "flex",
    flexDirection: "column",
    "& > div": {
        margin: "0px 8px 0 0"
    },
    ...props,
}))

export {
    cardFormStyle as CardFormStyle,
}