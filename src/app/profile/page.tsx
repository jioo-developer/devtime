import { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "DevTime 프로필 설정",
  description: "DevTime 프로필 설정",
  openGraph: {
    title: "DevTime 프로필 설정",
    description: "DevTime 프로필 설정",
  },
};

export default async function Page() {
  return <Client />;
}
