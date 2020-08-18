export const menuItems = [
    {
        id: 1,
        label: "Menu",
        isTitle: true
    },
    {
        id: 2,
        label: "Dashboard",
        icon: "bx-home-circle",
        subItems: [
            {
                id: 3,
                label: "Employee Dashboard",
                link: "/employee-dashboard",
                parentId: 2
            },
            {
                id: 4,
                label: "Visitor Dashboard",
                link: "/visitor-dashboard",
                parentId: 2
            },
            {
                id: 5,
                label: "Risk Dashboard",
                link: "/risk-dashboard",
                parentId: 2
            }
        ]
    },
    {
        id: 6,
        label: "Manage Company",
        icon: "bx bx-briefcase-alt",
        link: "/companies"
    },
    {
        id: 7,
        label: "Manage Owner",
        icon: "bx bx-crown",
        link: "/owners",
        adminOnly: true
    },
    {
        id: 8,
        label: "Manage Employee",
        icon: "bx bxs-user-detail",
        link: "/employees"
    },
    {
        id: 9,
        label: "Manage Risk",
        icon: "bx bx-ghost",
        link: "/risk-management"
    },
    // {
    //     id: 10,
    //     label: "Contact Tracing",
    //     icon: "bx bx-transfer-alt",
    //     link: "/contact-tracing"
    // },
    {
        id: 11,
        label: "Get Reports",
        icon: "bx bxs-report",
        link: "/reports"
    },
    {
        id: 12,
        label: "Reports",
        icon: "bx bxs-report",
        subItems: [
            {
                id: 13,
                label: "Print Reports",
                link: "/print-reports",
                parentId: 12
            },
            {
                id: 14,
                label: "Print Walkthrough",
                link: "/print-walkthrough",
                parentId: 12
            }
        ]
    }
];

