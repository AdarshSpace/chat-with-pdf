import Image from "next/image";
import Documents from "./dashboard/documents/page";
import { redirect } from "next/navigation";

export default function Home() {
    redirect("/dashboard/documents");
}