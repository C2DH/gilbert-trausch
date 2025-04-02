import ReactPlayer from 'react-player';

export default function Player ({url}) {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <ReactPlayer 
                    url={url}  
                    width="100%" 
                    height="100%" 
                    className="absolute top-0 left-0"
                    controls={true}
                />
            </div>
        </div>

        
    )
}