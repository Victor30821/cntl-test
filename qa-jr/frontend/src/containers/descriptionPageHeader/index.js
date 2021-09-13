import React, { memo } from 'react';
import { PagePath, PageDescription } from '../../components'

function DescriptionPageHeader({
    title,
    pageName,
    page,
    customPageTitle,
    hasDescription = true,
    description = "",
    linkUrl = "",
    linkText = "",
    icon,
    subtitleIsTitle,
    mainPage,
    pagePath = true,
    showVehicleName = false,
    ...options
}) {

    const olderTitle = title;

    if(subtitleIsTitle && customPageTitle) {
        title = customPageTitle;
    }
    else if(subtitleIsTitle && !customPageTitle) {
        title = pageName
    }
    
    if(showVehicleName) title = `${title} ${options.pageDescriptionExtra}`;

    return (
        <>
            {
                pagePath && <PagePath
                    title={olderTitle}
                    pageName={pageName}
                    mainPage={mainPage}
                    page={page}
                    {...options.pagePath}
                />
            }
            {
                hasDescription &&
                <PageDescription
                    icon={icon}
                    title={title}
                    description={description}
                    linkUrl={linkUrl}
                    linkText={linkText}
                    {...options.pageDescription}
                />
            }
        </>
    );
}
export default memo(DescriptionPageHeader)
