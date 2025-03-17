'use client'
import React, { useEffect } from 'react'
import WorkspaceHeader from '../_components/workspaceHeader';
import { useParams } from 'next/navigation';
import Pdfviwer from '../_components/Pdfviwer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from '../_components/TextEditor';

function Workspace() {
    const params = useParams();
    const FileId = params?.FileId;

    useEffect(() => {
        console.log("Current FileId from params:", FileId); // Debug log
    }, [FileId]);

    const fileRecord = useQuery(api.Pdfstorage.GetfileRecord, {
        FileId: FileId || ""
    });

    useEffect(() => {
        console.log("FileRecord state:", {
            value: fileRecord
        });
    }, [fileRecord]);

    if (!FileId) {
        return <div>Invalid File ID</div>;
    }

    if (fileRecord === undefined) {
        return <div>Loading...</div>;
    }

    if (fileRecord === null) {
        return <div>File not found</div>;
    }

    return (
        <div> 
            <WorkspaceHeader FileName={fileRecord?.FileName} />
            <div className="grid grid-cols-2 gap-4">
                <div className='p-1'>
                    <TextEditor FileId={FileId} /> {/* Verify this FileId */}
                </div>
                <div className='p-1'>
                    <Pdfviwer fileUrl={fileRecord.Fileurl} />
                </div>
            </div>
        </div> 
    );
}

export default Workspace;