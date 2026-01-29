import { Metadata } from "next";
import MainPage from "./Home/Home";

export const metadata: Metadata = {
  title: "DevTime",
  description: "DevTime",
  openGraph: {
    title: "DevTime",
    description: "DevTime",
  },
};

export default function Main() {
  return <MainPage />;
}
