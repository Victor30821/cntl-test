
import styled from 'styled-components';
import '../../assets/fonts.css'

const pagePathDiv = styled.a(props => ({
    display: "flex",
    flexDirection: "row",
    padding: "12px",
    marginTop: "15px",
    paddingLeft: "24px",
    '& > p': {
        lineHeight: "19px", 
        fontWeight: "500", 
        fontSize: "14px",
    },
    ...props
}))

export {
    pagePathDiv as PagePathDiv,
}