
import { getServerSession } from "next-auth"
import { AuthOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from "lucide-react";



const Dashboard = async() => {

    const session = await getServerSession(AuthOptions)

    if (!session) {
      redirect("/login")
    }

    const starts = [
        {
            label: 'Total Documents',
            
            icon: FileText,
            gradient: 'from-blue-400 to-cyan-500',
            shadowColour: 'shadow-blue-500/25'
        },
        {
            label: 'Total Flashcards',
            
            icon: BookOpen,
            gradient: 'from-purple-400 to-pink-500',
            shadowColour: 'shadow-purple-500/25'
        },
        {
            label: 'Total Quizzes',
            
            icon: BrainCircuit,
            gradient: 'from-emerlad-400 to-teal-500',
            shadowColour: 'shadow-emerlad-500/25'
        }
    ]

    console.log('Dashboard page is working here ')
    return(
        <div>
            <div className="">    </div>

            <div className="">   
                Header
                <div className="">
                    <h1 className=""> Dashboard</h1>
                    <p>Track your learning progress and activity</p>
                </div>
                <div className="">
                    {starts.map((stat, index) => (
                        <div key={index} className="">
                            <div className="">
                                <span className="">
                                    {stat.label}
                                </span>
                                <div className={`w-11 h-11 rounded-xl bg-linear-br ${stat.gradient} shadow-lg ${stat.shadowColour} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="" strokeWidth={2}  />
                                </div>
                            </div>
                            <div className="">

                            </div>
                        </div>
                    ))}
                </div>
                <div className="">
                    <div className="">
                        <div className="">
                            <Clock className="" strokeWidth={2} />
                        </div>
                        <h3 className=""> Recent Activity</h3>
                    </div>
                </div>
            </div>
             
           

        </div>
    )
}

export default Dashboard