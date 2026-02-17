import { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "DevTime 비밀번호 찾기",
  description: "DevTime 비밀번호 찾기",
  openGraph: {
    title: "DevTime 비밀번호 찾기",
    description: "DevTime 비밀번호 찾기",
  },
};

export default async function Page() {
  return <Client />;
}
