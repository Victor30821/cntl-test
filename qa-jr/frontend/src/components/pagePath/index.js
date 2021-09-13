import React from 'react';
import { PagePathDiv } from './style';
import { Text, Link } from '../../components'
export default function PagePath({ title = "", pageName = false, page, mainPage, ...options }) {
    return (
        <PagePathDiv>
            <Text withLink={mainPage} marginRight={"8px"} color={"#393791"}>
                {
                    mainPage
                        ? <Link fontWeight={'bold'} href={window.location.origin + mainPage}>{title}</Link>
                        : title
                }
            </Text>
            {pageName &&
                <>
                    <Text marginRight={"8px"} cursor={"default"}>/</Text>
                    <Text cursor={"default"} marginRight={page ? "8px" : "0px"}>
                        {pageName}
                    </Text>
                </>
            }
            {page &&
                <>
                    <Text marginRight={"8px"} cursor={"default"}>/</Text>
                    <Text cursor={"default"}>
                        {page}
                    </Text>
                </>
            }
        </PagePathDiv>
    );
}
