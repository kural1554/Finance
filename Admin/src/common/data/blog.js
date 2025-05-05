import image1 from "../../assets/images/small/img-1.jpg"
import image2 from "../../assets/images/small/img-2.jpg"
import image3 from "../../assets/images/small/img-3.jpg"
import image4 from "../../assets/images/small/img-4.jpg"
import image5 from "../../assets/images/small/img-5.jpg"
import image6 from "../../assets/images/small/img-6.jpg"
import image7 from "../../assets/images/small/img-7.jpg"


const blogGridData = [
    {
        id: 1,
        date: "10 Apr, 2022",
        title: "Beautiful Day with Friends",
        desc: "Contrary to popular belief, Lorem Ipsum is not simply random text,a Latin professor at Hampden-Sydney College in Virginia.",
        img: image3
    },
    {
        id: 2,
        date: "24 May, 2022",
        title: "Drawing a sketch",
        desc: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        img: image2
    },
    {
        id: 3,
        date: "12 june, 2022",
        title: "Project discussion with team",
        desc: "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words.",
        img: image1
    },
    {
        id: 4,
        date: "10 July, 2022",
        title: "Morning with Photoshoot",
        desc: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        img: image4
    },
    {
        id: 5,
        date: "16 June, 2022",
        title: "Coffee with friends",
        desc: "Contrary to popular belief, Lorem Ipsum is not simply random text,a Latin professor at Hampden-Sydney College in Virginia.",
        img: image3
    },
    {
        id: 6,
        date: "22 May, 2022",
        title: "Working day with our new ideas",
        desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
        img: image5
    },
]

const blogListData = [
    {
        id: 1,
        date: "16 June, 2022",
        title: "Coffee with friends",
        desc: "Contrary to popular belief, Lorem Ipsum is not simply random text,a Latin professor at Hampden-Sydney College in Virginia.",
        img: image3
    },
    {
        id: 2,
        date: "22 May, 2022",
        title: "Working day with our new ideas",
        desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
        img: image5
    },
    {
        id: 3,
        date: "12 june, 2022",
        title: "Project discussion with team",
        desc: "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words.",
        img: image1
    },
]

const UpcomingPost = [
    {
        id: 1,
        title: "Beautiful Day with Friends",
        date:"20 August, 2022",
        time: "05:00 AM",
        img: image7,
        class: "list-group-item text-muted py-3 px-2 pt-0",
    },
    {
        id: 2,
        title: "Drawing a sketch",
        date: "20 August, 2022",
        time: "05:05 AM",
        img: image2,
        class: "list-group-item text-muted py-3 px-2"
    },
    {
        id: 3,
        title: "Project discussion with team",
        date: "20 August, 2022",
        time: "05:10 PM",
        img: image6,
        class: "list-group-item text-muted py-3 px-2"
    },
    {
        id: 4,
        title: "Coffee with friends",
        date: "20 August, 2022",
        time: "05:30 PM",
        img: image1,
        class: "list-group-item text-muted py-3 px-2"
    }
]

const PopularPost = [
    {
        id: 1,
        title: "Beautiful Day with Friends",
        date: "10 Apr, 2022",
        time: "05:00 AM",
        img: image3,
        class: "list-group-item text-muted py-3 px-2 pt-0"
    },
    {
        id: 2,
        title: "Drawing a sketch",
        date: "20 August, 2022",
        time: "05:05 AM",
        img: image4,
        class: "list-group-item text-muted py-3 px-2"
    },
    {
        id: 3,
        title: "Coffee with friends",
        date: "20 August, 2022",
        time: "05:30 PM",
        img: image1,
        class: "list-group-item text-muted py-3 px-2"
    }
]

const InstagramPost = [
    {
        id: 1,
        img: image3
    },
    {
        id: 2,
        img: image1
    }, {
        id: 3,
        img: image2
    }, {
        id: 4,
        img: image4
    }, {
        id: 5,
        img: image5
    }, {
        id: 6,
        img: image6
    },
]

const tagCloud = [
    {
        id: 1,
        desc: "Design"
    }, {
        id: 2,
        desc: "Development"
    }, {
        id: 3,
        desc: "Wordpress"
    }, {
        id: 4,
        desc: "HTML"
    }, {
        id: 5,
        desc: "Project"
    }, {
        id: 6,
        desc: "Business"
    }, {
        id: 7,
        desc: "Travel"
    }, {
        id: 8,
        desc: "Photography"
    },
]

export { blogGridData, blogListData, UpcomingPost, PopularPost, InstagramPost, tagCloud };