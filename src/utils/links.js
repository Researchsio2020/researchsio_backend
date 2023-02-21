import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';

const links = [
  { id: 1, text: "stats", path: "/", icon: <IoBarChartSharp /> },
  { id: 2, text: "all blogs", path: "all-blogs", icon: <MdQueryStats /> },
  { id: 3, text: "add blog", path: "add-blog", icon: <FaWpforms /> },
  { id: 4, text: "profile", path: "profile", icon: <ImProfile /> },
  { id: 5, text: "contact", path: "contact", icon: <ImProfile /> },
  { id: 6, text: "gallery", path: "gallery", icon: <ImProfile /> },
  { id: 7, text: "users", path: "users", icon: <ImProfile /> },
  { id: 8, text: "testimonial", path: "testimonial", icon: <ImProfile /> },
];

export default links;
