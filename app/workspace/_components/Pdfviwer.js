'use client'
import React, { useEffect } from 'react'

function Pdfviwer({ fileUrl }) {
    // useEffect(() => {
    //     console.log('PDF Viewer received fileUrl:', {
    //         fileUrl,
    //         exists: !!fileUrl,
    //         type: typeof fileUrl
    //     });
    // }, [fileUrl]);
    console.log(fileUrl);

    // if (!fileUrl) {
    //     return <div>No PDF URL provided</div>;
    // }

    return (
        
           
            <div className='h-[90vh]'>
                 {/* PDF viewer implementation */}
                 {/* #toolbar=0 is used to hides all pdf functioanality */}
                <iframe src={fileUrl+'#toolbar=0'} width="100%" height="90vh" className='h-full' />
            </div>
        
    );
}

export default Pdfviwer;