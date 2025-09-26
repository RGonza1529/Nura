
export default function Dashboard(){
    return(
        <div className="h-full w-full py-8 px-5 flex">
            <div className="max-w-7xl mx-auto">

                {/* Main Content */}
                <div className="flex-1 flex flex-col">

                    <h1 className="text-2xl font-semibold">Dashboard</h1>

                    {/* Page Content */}
                    <div className="flex-1 p-5 overflow-y-auto">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Cards */}
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="bg-zinc-900 border-[1px] border-zinc-800 p-6 rounded-xl shadow hover:shadow-lg transition"
                            >
                                <h2 className="text-lg font-semibold mb-2">Card {i}</h2>
                                <p className="text-zinc-300 text-sm">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </p>
                            </div>
                            ))}

                        </div>

                        <div className="mt-20 mb-6 max-w-xl">
                            <h2 className="text-2xl font-semibold mb-1">Public Caption Links</h2>
                            <p className="text-zinc-400">Share this link with your audience to allow them to view live captions on their own devices.</p>
                        </div>

                        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">

                            {/* <!-- QR Code Card --> */}
                            <div className="flex-1 bg-zinc-900 border-[1px] border-zinc-800 rounded-xl shadow-lg px-6 py-10 max-w-sm w-full">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold mb-4">Quick Access QR Code</h3>
                                    <div className="flex justify-center mb-4">
                                        <div className="p-4 bg-gray-50 rounded-lg"></div>
                                    </div>
                                    <p className="">Scan to visit the website</p>
                                </div>
                            </div>
                            
                            {/* <!-- Link Card --> */}
                            <div className="flex-1 bg-zinc-900 border-[1px] border-zinc-800 rounded-xl shadow-lg px-6 py-10 max-w-sm w-full">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold mb-4">Website Link</h3>
                                    <div className="bg-zinc-700 p-4 rounded-lg mb-4">
                                        <p className="text-sm font-mono break-all">https://www.example.com</p>
                                    </div>
                                    <button 
                                        title="Copy link"
                                        aria-label="Click to copy link"
                                        onClick={() => {navigator.clipboard.writeText("https://www.example.com")}}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        Copy link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}