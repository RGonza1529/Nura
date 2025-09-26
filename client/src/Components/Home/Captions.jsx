
export default function Captions({ liveCaptions }){

    return(
        <div className="h-full border-1 border-zinc-500 flex rounded-lg overflow-y-scroll scrollbar-hide p-3 transition-all duration-500">
            {liveCaptions.length ? 
            <p>{liveCaptions}</p>
            :
            <>
            <p className="my-auto mx-auto">Captions will appear here when you stream</p>
            </>
            }
      </div>
    )
}