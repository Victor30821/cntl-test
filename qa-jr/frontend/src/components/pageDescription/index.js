import React from 'react';
import { PageDesctiptionDiv, PageTitleDiv } from './style';
import { Text, Link, Icon } from 'components'
export default function PageDescription({ title = "", description = false, linkUrl = false, linkText = false, icon = false, ...options }) {
    return (
        <PageDesctiptionDiv {...options}>
            <PageTitleDiv >
                {icon && <Icon icon={icon} width={'17px'} height={'19px'} color='#868E96' />}
                <Text
                    fontWeight={"bold"}
                    fontSize={"22px"}
                    cursor={"default"}
                    lineHeight={"29px"}
                    color={"#505050"}
                    marginLeft={"8px"}
                    whiteSpace="none"
                >
                    {title}
                </Text>
            </PageTitleDiv>
            {
                description &&
                <div>
                    <Text
                        fontSize={"15px"}
                        cursor={"default"}
                        lineHeight={"21px"}
                        color={"#838383"}
                        whiteSpace="none"
                    >
                        {description}
                        <Link
                            target={"_blank"}
                            fontSize={"15px"}
                            cursor={"pointer"}
                            color={"#393791"}
                            href={linkUrl || "#"}
                            marginLeft={"5px"}
                        >
                            {linkText}
                        </Link>
                    </Text>
                </div>
            }
        </PageDesctiptionDiv>
    );
}
