import { useState } from 'react';
import { NavLink } from 'react-router-dom';

// COMPONENTS
import Host from '../Components/Home/Host';
import Dashboard from '../Components/Home/Dashboard';


// ASSETS
import arrowLeft from '../assets/icons/arrow_left.svg';
import User from '../assets/icons/User.svg';

export default function UserHome({ windowWidth }){
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [captionsBarOpen, setCaptionsBarOpen] = useState(false);

    const toggleNavbar = (bool) => {
        setNavbarOpen(bool);
    }

    const toggleCaptions = (bool) => {
        setCaptionsBarOpen(bool);
    }

    return(

        <div className="h-screen max-h-screen flex justify-center bg-neutral-950">
            <section
                    className={`bg-zinc-950 md:border-r-[1px] border-zinc-600 fixed inset-y-0 left-0 z-30 w-[250px] md:w-[300px] lg:w-1/5 lg:min-w-[200px] transform text-white transition-transform duration-100 md:relative md:translate-x-0 lg:flex
                ${navbarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Sidebar content */}
                <div className="w-full">
                    <div className="w-full flex justify-between items-center border-b-[1px] border-zinc-800 px-3 py-3">
                        <div className="flex items-center">
                            <img src={User} alt="" className="w-7 h-7"/>
                            <h2 className="text-lg font-medium ml-2 mr-1">(Name)</h2>
                        </div>

                        {windowWidth < 768 && 
                            <button 
                                onClick={() => toggleNavbar(false)}
                                className="z-10"
                                title="Close navigation menu"
                                aria-label="Close navigation menu"
                            >
                                <img src={arrowLeft} alt="" className="h-7 w-7"/>
                            </button>
                        }
                    </div>


                    <nav className="px-3 flex flex-col mt-4 gap-2 md:gap-1">
                        <NavLink 
                            to="#" 
                            className="hover:bg-zinc-800 translation-all duration-150 rounded-lg group" 
                            style={({ isActive }) => ({color: isActive ? "#818cf8" : "#FFF", backgroundColor: isActive && "#27272a"})}
                            title="Dashboard"
                            aria-label="Dashboard"
                        >
                            <div className="w-full py-1 md:py-2 px-2 rounded-xl flex items-center gap-2 md:text-lg group-hover:text-indigo-400 transition-all duration-150">
                                {/* Home icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 17.0002V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 
                                    10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 
                                    9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 
                                    3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 
                                    4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 
                                    9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522V17.0002C4 
                                    17.932 4 18.3978 4.15224 18.7654C4.35523 19.2554 4.74432 19.6452 5.23438 
                                    19.8482C5.60192 20.0005 6.06786 20.0005 6.99974 20.0005C7.93163 20.0005 8.39808 
                                    20.0005 8.76562 19.8482C9.25568 19.6452 9.64467 19.2555 9.84766 18.7654C9.9999 
                                    18.3979 10 17.932 10 17.0001V16.0001C10 14.8955 10.8954 14.0001 12 14.0001C13.1046 
                                    14.0001 14 14.8955 14 16.0001V17.0001C14 17.932 14 18.3979 14.1522 18.7654C14.3552 
                                    19.2555 14.7443 19.6452 15.2344 19.8482C15.6019 20.0005 16.0679 20.0005 16.9997 
                                    20.0005C17.9316 20.0005 18.3981 20.0005 18.7656 19.8482C19.2557 19.6452 19.6447 
                                    19.2554 19.8477 18.7654C19.9999 18.3978 20 17.932 20 17.0002Z" 
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <p className="text-white">Home</p>
                            </div>
                        </NavLink>
                    </nav>

                </div>
            </section>

            {/* Overlay on small screens */}
            {navbarOpen && (
                <button
                    className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
                    onClick={() => toggleNavbar(false)}
                    title="Close navigation menu"
                    aria-label="Close navigation menu"
                />
            )}

            {/* dashboard */}
            <main className="h-full w-full overflow-y-scroll scrollbar-hide">

                {windowWidth < 768 && 
                    <header className="flex justify-between py-3 px-3 border-b-[1px] border-zinc-800">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => toggleNavbar(true)}
                                className="p-3 rounded-sm bg-rose-500"
                            ></button>
                            <h1 className="text-xl font-medium">(Name)</h1>
                        </div>

                        <button 
                            onClick={() => toggleCaptions(true)}
                            className="px-4 py-[2px] rounded-lg bg-neutral-800 font-medium"
                            title="open captions"
                            aria-label="open captions"
                        >Captions</button>
                    </header>
                }

                <Dashboard />
            </main>

            {/* Right-side full-screen menu (on mobile) or static side-by-side (on large) */}
            <Host captionsBarOpen={captionsBarOpen} toggleCaptions={toggleCaptions} windowWidth={windowWidth}/>
        </div>
    );
}