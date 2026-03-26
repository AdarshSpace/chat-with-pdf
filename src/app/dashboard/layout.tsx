"use client"
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import {SessionProvider} from "next-auth/react";

export default function dashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex h-screen bg-neutral-50 text-neutral-900">
        <div> <Sidebar /> </div>
        <div className="flex-1 flex flex-col overflow-hidden"> 
          <Header />
          <main className="flex-1 overflow-hidden overflow-y-auto p-6">
          <SessionProvider>{children}</SessionProvider>
         </main>
       </div>
                 
      </div>
    );
  }