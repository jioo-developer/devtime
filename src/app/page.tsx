import { Metadata } from "next";
import TimerPage from "./Home/TimerPage";

export const metadata: Metadata = {
  title: "DevTime",
  description: "DevTime",
  openGraph: {
    title: "DevTime",
    description: "DevTime",
  },
};

export default function Main() {
  return <TimerPage />;
}
