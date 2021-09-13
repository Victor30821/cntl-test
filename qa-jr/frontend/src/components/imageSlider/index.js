import React, { useEffect } from 'react'
import { Background, BackgroundShadow, Content, ContentRow, SliderItem, MiniPreviewImage, PreviewImage } from './style'
import { Icon, Text } from 'components'

const ImageSlider = ({
    imagesUrls = [],
    onDismiss = () => { },
    title = "",
    subtitle = ""
}) => {

    useEffect(() => {
        window.location.hash = "#";

        setTimeout(() =>
            window.location.hash = "#slider-image-0",
            200
        )

        return () => {
            window.location.hash = "#";
        }
    }, [])


    const keyListener = event => {
        event.preventDefault();

        event.persist();

        const keysPerAction = {
            Escape: onDismiss,
            ArrowLeft: e => changeImage(-1),
            ArrowRight: e => changeImage(1),
        }

        const handler = keysPerAction[event.key];

        if (!handler) return;

        handler(event)
    }

    const changeImage = (step = 1) => {
        const hash = window.location.hash.split("-");

        const currentIndex = hash.splice(-1, 1);

        const nextImage = +currentIndex + step;

        const hasImage = imagesUrls[nextImage];

        if (!hasImage) return;

        window.location.hash = hash.concat(nextImage).join("-")
    }

    return (
        <>
            <Background >
                <Content
                    onKeyDown={keyListener}
                    tabIndex="0"
                    ref={ref => ref?.focus?.()}
                >
                    {
                        title &&
                        <Text
                            padding="32px 0 0 88px"
                            color="#fff"
                            fontWeight="bold"
                            fontSize="20px"
                            width="450px"
                            overflow="hidden"
                            whiteSpace="nowrap !important"
                            textOverflow="ellipsis"
                        >
                            {title}
                        </Text>
                    }
                    {
                        subtitle &&
                        <Text
                            padding="0 0 0 88px"
                            color="#fff"
                        >
                            {subtitle}
                        </Text>
                    }
                    <ContentRow flex="1" onKeyDown={keyListener}>
                        <SliderItem
                            justifyContent="flex-end"
                            padding="0 20px"
                            cursor="pointer"
                            marginRight="-60px"
                            paddingRight="80px"
                            zIndex="3"
                            onClick={() => {
                                changeImage(-1)
                            }}>

                            <Icon
                                icon={'arrow-down'}
                                width="35px"
                                height="20px"
                                color='#fff'
                                style={{ transform: "rotate(90deg)" }}
                            />
                        </SliderItem>
                        <SliderItem
                            onKeyDown={keyListener}
                            minWidth="400px"
                            maxWidth="400px"
                            zIndex="2"
                        >
                            {
                                imagesUrls.map((src, index) => (
                                    <PreviewImage
                                        src={src}
                                        onKeyDown={keyListener}
                                        id={["slider", "image", index].join("-")}
                                    />
                                ))
                            }
                        </SliderItem>
                        <SliderItem
                            justifyContent="flex-start"
                            padding="0 20px"
                            cursor="pointer"
                            marginLeft="-60px"
                            paddingLeft="80px"
                            zIndex="3"
                            onClick={() => {
                                changeImage(1)
                            }}
                        >

                            <Icon
                                icon={'arrow-down'}
                                width="35px"
                                height="20px"
                                color='#fff'
                                style={{ transform: "rotate(-90deg) translate(-8px, 0)" }} />
                        </SliderItem>
                    </ContentRow>
                    <ContentRow flex="0.2" onKeyDown={keyListener}>
                        {
                            imagesUrls.map((src, index) => (
                                <a href={"#slider-image-" + index} onKeyDown={keyListener}>
                                    <MiniPreviewImage
                                        src={src}
                                        onKeyDown={keyListener}
                                    />
                                </a>
                            ))
                        }

                    </ContentRow>

                </Content>
            </Background>
            <BackgroundShadow onClick={onDismiss} />

        </>
    )
}
export default ImageSlider