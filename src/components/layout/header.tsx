'use client'
import { Bell, User, Menu } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

const Header = () => {

    const toggleSidebar = useUIStore((state) => state.toggleSidebar);

    const user = {
        username: 'Adarsh',
        email: 'adarsh@mail.com'
    }

    return(
        <div className="sticky top-0 z-40 w-full h-16 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-200/60">

              {/* LEFT */}
            <div className="flex items-center h-full px-6 ">
                <button className="md:hidden inline-flex items-center justify-center h-10 w-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200" onClick={toggleSidebar}> <Menu size={24} /> </button>
            </div>

              {/* RIGHT */}
            <div className="flex items-center gap-3">

                     {/* Notification */}            
                <div className="relative flex items-center gap-3">
                  <button className="inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 "> <Bell size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-200 " /> </button>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"> </span>
                </div>            

            {/* UserProfile */}

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200/60 ">
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors duration-200 cursor-pointer group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-200">
                        <button> <User size={18} strokeWidth={2.5}/> </button>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900"> {user?.username || 'User'}  </p>
                        <p className="text-xs text-slate-500"> {user?.email || 'user@example.com'} </p>
                    </div>
                </div>

            </div>
            </div>
         
        </div>
    )
}

export default Header
