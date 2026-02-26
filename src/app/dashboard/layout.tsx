import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export default function dashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div>
         <Header />
         <Sidebar />
          {children}
        
      </div>
    );
  }