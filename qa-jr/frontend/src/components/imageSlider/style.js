
import styled from 'styled-components';

export const Background = styled.div(props => ({
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "999",
    marginLeft: "calc(50% - 250px)",
    ...props,
}))
export const BackgroundShadow = styled.div(props => ({
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    background: "#00000095",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1",
    ...props,
}))
export const Content = styled.div(props => ({
    height: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
    "&:focus": {
        outline: "none"
    },
}))
export const ContentRow = styled.div(props => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    ...props
}))
export const SliderItem = styled.div(props => ({
    display: "flex",
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    ...props
}))

export const Image = styled.img(props => ({
    borderRadius: "4px",
    zIndex: "999",
}))

export const PreviewImage = styled(Image)(props => ({
    marginLeft: "12px",
    marginRight: "12px",
    display: "none",
    maxWidth: "100%",
    maxHeight: "500px",
    "&:target": {
        display: "block"
    },
    ...props
}))
export const MiniPreviewImage = styled(Image)(props => ({
    width: "100px",
    margin: "24px",
    cursor: "pointer",
    marginLeft: "12px",
    marginRight: "12px",
    "&:hover": {
        boxShadow: "0px 0px 4px 2px rgba(255, 255, 255, 0.25)",
    },
    ...props
}))

