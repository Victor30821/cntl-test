import React, { useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux';

export default memo(function ChangelogfyComponent({
    app_id,
    selector
}) {
    const [shouldRenderChangelogfy, setChangelogfy] = useState(false);

    const {
        user
    } = useSelector(state => state.auth);


    useEffect(() => {
        const hasToken = !!user.token;

        const hasId = !!user?.id;

        const hasSelectorElement = !!Array.from(
            document.querySelectorAll(selector)
        ).length

        const showChangelogfy = (hasToken || hasId) && hasSelectorElement && !shouldRenderChangelogfy


        if (showChangelogfy && !shouldRenderChangelogfy && window.changelogfy) {
            const config = {
                selector,
                app_id,
                backdrop: true,
                init_badge: true,
                data: {
                    user_id: user?.id,
                    user_name: user?.user_settings?.name,
                    user_email: user?.email,
                },
            };

            window.changelogfy.init(config);

            setChangelogfy(true);
        }
    // eslint-disable-next-line
    }, [user?.id, user?.token, document.querySelectorAll(selector), window.changelogfy]);

    return <></>;
})