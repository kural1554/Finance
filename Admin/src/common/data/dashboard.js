const WidgetsData = [
    {
        id: 1,
        title: "My Wallet",
        price: 865.2,
        rank: "+$20.9k",
        isDoller: true,
        postFix: "k",
        statusColor: "success",
        series: [2, 10, 18, 22, 36, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15],
    },
    {
        id: 2,
        title: "Number of Trades",
        price: 6258,
        rank: "-29 Trades",
        isDoller: false,
        statusColor: "danger",
        series: [15, 42, 47, 2, 14, 19, 65, 75, 47, 15, 42, 47, 2, 14, 12,]
    },
    {
        id: 3,
        title: "Invested Amount",
        price: 432,
        rank: "+$2.8k",
        isDoller: true,
        postFix: "M",
        statusColor: "success",
        series: [47, 15, 2, 67, 22, 20, 36, 60, 60, 30, 50, 11, 12, 3, 8,]
    },
    {
        id: 5,
        title: "Profit Ration",
        price: 1257,
        rank: "+$2.75%",
        isDoller: true,
        postFix: "%",
        statusColor: "success",
        series: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14, 2, 47, 42, 15,]
    },
];

const MarketOverViewAllData = [

    {
        name: "Profit",
        data: [
            12.45, 16.2, 8.9, 11.42, 12.6, 18.1, 18.2, 14.16, 11.1, 8.09, 16.34,
            12.88,
        ],
    },
    {
        name: "Loss",
        data: [
            -11.45, -15.42, -7.9, -12.42, -12.6, -18.1, -18.2, -14.16, -11.1, -7.09,
            -15.34, -11.88,
        ],
    },
]

const MarketOver1MData = [

    {
        name: "Profit",
        data: [
            14.45, 10.2, 8.9, 154.42, 6.6, 18.1, 18.2, 18.16, 11.1, 8.09, 16.34,
            12.88,
        ],
    },
    {
        name: "Loss",
        data: [
            -1.45, -15.42, -7.9, -12.42, -12.6, -8.1, -18.2, -14.16, -11.1, -7.09,
            -15.34, -17.88,
        ],
    },
];
const MarketOver6MData = [

    {
        name: "Profit",
        data: [
            12.45, 14.2, 8.9, 11.42, 12.6, 18.1, 12.2, 14.16, 11.1, 8.09, 16.34,
            8.88,
        ],
    },
    {
        name: "Loss",
        data: [
            -11.45, -15.42, -17.9, -12.42, -12.6, -8.1, -18.2, -14.16, -1.1, -7.09,
            -5.34, -11.88,
        ],
    },
];
const MarketOver1YData = [

    {
        name: "Profit",
        data: [
            2.45, 16.2, 18.9, 11.42, 12.6, 18.1, 8.2, 14.16, 11.1, 18.09, 16.34,
            12.88,
        ],
    },
    {
        name: "Loss",
        data: [
            -11.45, -5.42, -7.9, -12.42, -2.6, -18.1, -18.2, -4.16, -11.1, -7.09,
            -15.34, -1.88,
        ],
    },
];

const PieChart1YData = [15, 70, 45];

const PieChart6MData = [55, 35, 10];

const PieChart1MData = [75, 10, 65];

const PieChartAllData = [55, 35, 25];

const InvestedOverviewMay = [80];

const InvestedOverviewApril = [20];

const InvestedOverviewMarch = [40];

const InvestedOverviewFeb = [90];

const InvestedOverviewJan = [65];

const InvestedOverviewDec = [45];

export {
    WidgetsData, MarketOver1YData, MarketOver6MData, MarketOver1MData, MarketOverViewAllData, PieChart1YData, PieChart6MData,
    PieChart1MData, PieChartAllData, InvestedOverviewMay, InvestedOverviewApril, InvestedOverviewMarch, InvestedOverviewFeb,
    InvestedOverviewJan, InvestedOverviewDec
};