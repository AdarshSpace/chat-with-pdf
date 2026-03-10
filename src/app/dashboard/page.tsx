
"use client"

import { AuthOptions } from "@/lib/auth"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { useSession } from "next-auth/react";

import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from "lucide-react";
import { useEffect } from "react";



const Dashboard = () => {

    const router = useRouter();

    const [docsCount, setDocsCount] = useState(0);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login") }
      }, [status, router]);


    useEffect(() => {
        const totalDocs = async () => {
            try {
                const res = await fetch(`/api/documents/count`);
                const data = await res.json();
                if(data.success){
                    setDocsCount(data.totalDocuments)
                }
            }
            catch(error){
                console.log("Error : ", error)
            }
        }
        totalDocs();
    }, []);

    const stats = [
        {
            label: 'Total Documents',
            value: docsCount,
            icon: FileText,
            gradient: 'from-blue-400 to-cyan-500',
            shadowColour: 'shadow-blue-500/25'
        },
        {
            label: 'Total Flashcards',
            value: 10,
            icon: BookOpen,
            gradient: 'from-purple-400 to-pink-500',
            shadowColour: 'shadow-purple-500/25'
        },
        {
            label: 'Total Quizzes',
            value: 15,
            icon: BrainCircuit,
            gradient: 'from-emerald-400 to-teal-500',
            shadowColour: 'shadow-emerald-500/25'
        }
    ]



    console.log('Dashboard page is working here ')
    return(
        <div className="min-h-screen ">
            
            <div className="absolute inset-0 bg-[radical-gradient(#e5e7eb_1px, transparent_1px) bg-size-[16px, 16px] opacity-30 pointer-event-none]">    </div>

            <div className="relative max-w-7xl mx-auto">   
                
                <div className="mb-6">
                    <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2"> Dashboard</h1>
                    <p className="text-slate-500 text-sm">Track your learning progress and activity</p>
                </div>

                {/* stats Grid */}

                <div className="grid grid-col-1 md:grid-cols-3 gap-6 mb-5">
                    {stats.map((stat, index) => (
                        <div key={stat.label} className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-salte-200/50 p-6 hover:shadow-2xl hover-shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1 ">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    {stat.label}
                                </span>
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColour} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="" strokeWidth={2} />
                                </div>
                            </div>
                            <div className="text-3xl font-semibold text-slate-900 tracking-tight">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center ">
                            <Clock className="w-5 h-5 text-slate-600 " strokeWidth={2} />
                        </div>
                        <h3 className="text-xl font-medium text-slate-900 tracking-tight"> Recent Activity</h3>
                    </div>
                    {}
                </div>
            </div>
             
           

        </div>
    )
}

export default Dashboard