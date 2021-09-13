import { TextDefault } from 'components/text/style';
import React, { useEffect, useState } from 'react';
import { Emails, Title } from './style';
import { Icon } from 'components'


export default function SelectOutText({items = [], title,  onItemClick}) {
    return (
        <div>
            {title && (
                <Title>{title}</Title>
            )}
            {items?.map(item => 
                <Emails>
                    <TextDefault 
                        color={'#FFF'} 
                        fontSize={'14px'}>
                        <Icon
                            icon={"close"}
                            color={"white"}
                            width={"12px"}
                            height={"12px"}
                            divProps={{
                                marginRight: "8px",
                                display: "inline-block"
                            }}
                            onClick = {() => onItemClick(item)}
                        />
                            {item.value || ""}
                    </TextDefault>
                </Emails>    
            )}
        </div>
    )
}