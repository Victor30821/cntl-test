import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getUserRole } from 'utils/verifyUserAccess';


export default function Crisp({
    app_id
}) {
    const [crispFields,] = useState([
        "user:nickname",
        "user:email",
        "user:company",
        "session:segments",
        "session:data",
    ])
    const [crispData,] = useState({
        "user:nickname": ({ name }) => {

            if (!name) return;

            window.$crisp.push(["set", "user:nickname", [name]]);

        },
        "user:email": ({ email }) => {

            if (!email) return;

            window.$crisp.push(["set", "user:email", [email]]);

        },
        "user:company": ({
            organization_id,
            company_name,
        }) => {

            if (!organization_id) return;

            window.$crisp.push(["set", "user:company", [
                `${company_name} (${organization_id})`,
                { description: `${organization_id}` }
            ]]);

        },
        "session:segments": ({
            organization_id,
            consultant_user,
            status,
            userRole
        }) => {

            if (!consultant_user || !userRole || !organization_id || !status) return;

            window.$crisp.push([
                "set", "session:segments",
                [
                    [
                        `${consultant_user}`,
                        `${status}`, `${userRole}`, `${organization_id}`]
                ]
            ]);

        },
        "session:data": ({
            organization_id,
            consultant_user,
            status,
            userRole
        }) => {

            if (!consultant_user || !userRole || !organization_id || !status) return;


            window.$crisp.push([
                "set", "session:data",
                [
                    [
                        ["companyId", `${organization_id}`],
                        ["operator", `${consultant_user}`],
                        ["companyStatus", `${status}`], ["Role", `${userRole}`]
                    ]
                ]
            ]);

        }
    })


    const {
        user: {
            company_name,
            organization_id,
            email,
            role_id,
            user_settings,
            id,
            token
        }
    } = useSelector(state => state.auth)
    const {
        organization
    } = useSelector(state => state.organization)

    const getOrganizationStatus = () => {

        const companyStatus = {
            0: 'actived and blocked',
            1: 'actived and deblocked'
        }

        return companyStatus?.[organization?.status] || 'deactivated'
    }


    const initCrisp = () => {
        try {

            const consultant_user = organization?.consultant_user || "Contele";

            const status = getOrganizationStatus()

            const userRole = getUserRole({
                role_id
            });

            window.$crisp = [];

            window.CRISP_WEBSITE_ID = app_id;

            crispFields.forEach(field =>
                crispData?.[field]?.({
                    organization_id,
                    company_name,
                    consultant_user,
                    userRole,
                    status,
                    email,
                    name: user_settings?.name,
                })
            )

            const d = document;
            const s = d.createElement("script");

            s.src = "https://client.crisp.chat/l.js";
            s.async = 1;
            d.getElementsByTagName("head")[0].appendChild(s);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        initCrisp();
        // eslint-disable-next-line
    }, [id, token, organization]);


    return <></>
}
