'use client'
import React, { useState } from 'react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { Loader2Icon, Upload } from "lucide-react"
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import uuid4 from "uuid4";
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

const Uploadpdf = ({ children }) => {
    const embeddoc=useAction(api.myAction.ingest);
    const getfileurl=useMutation(api.Pdfstorage.geturl);
    const generateUploadUrl=useMutation(api.Pdfstorage.generateUploadUrl);
    const Addpdffiletodb=useMutation(api.Pdfstorage.Addpdffiletodb);
    const {user}=useUser();
    const[pdf,setpdf]=useState();
    const[loading,setloading]=useState(false);
    // const closeDialogRef = useRef(null)
    const [open, setOpen] = useState(false);
    const onpdfselect=(e)=>{
        setpdf(e.target.files[0]);

    }
    const onUpload = async () => {
        if (!pdf || !document.getElementById('filename').value) {
            toast.error('Please select a PDF file and enter a file name')
            return;
        }
    
        try {
            setloading(true);
            // Generate upload URL
            const postUrl = await generateUploadUrl();
            
            // Upload file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": pdf?.type },
                body: pdf,
            });
    
            if (!result.ok) {
                throw new Error('Failed to upload file');
            }
    
            const { storageId } = await result.json();
            
            // Add to database
            const fileId = uuid4();
            const Fileurl=await getfileurl({StorageId:storageId});
            const res = await Addpdffiletodb({
                FileId: fileId,
                StorageId: storageId,
                CreatedBy: user?.primaryEmailAddress?.emailAddress,
                FileName: document.getElementById('filename').value,
                Fileurl:Fileurl
            });
            // api call to fecth pdf process data
            const apires=await axios.get('/api/pdfLoader?fileurl='+Fileurl);
            console.log(apires.data.message);
            await embeddoc({
                splitText:apires.data.message,
                fileId:fileId,
            });

    
            if (res.success) {
                toast.success('PDF uploaded successfully')
                setpdf(null);
                document.getElementById('filename').value = '';
                setOpen(false); // Close dialog
            } else {
                throw new Error('Failed to save file information');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload PDF: ' + error.message);
        } finally {
            setloading(false);
        }
    };
  return (
    <div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  className="w-full" 
                  disabled={loading}
                >
                  {children}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload PDF File
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Upload your PDF file here. Max file size 5MB.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Select File</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PDF files only</p>
                                </div>
                                <input type="file" className="hidden" accept=".pdf" onChange={(e)=>onpdfselect(e)} />
                            </label>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="filename" className="text-sm font-medium">
                            File Name
                        </label>
                        <Input id="filename" placeholder="Enter file name"  />
                    </div>
                </div>

                <DialogFooter >
                   <div className='w-full flex justify-between items-center'>
                      <DialogClose asChild>
                        <span>
                          <Button 
                            variant="outline" 
                            type="button"
                            className="hover:bg-gray-100"
                          >
                            Cancel
                          </Button>
                        </span>
                      </DialogClose>
                      <Button 
                      disable={loading} // change
                        onClick={onUpload}
                        type="button" 
                        className="px-8 bg-black hover:bg-slate-700" 
                      >
                        {loading ? <Loader2Icon className='animate-spin'/> : 'Upload'}
                      </Button>
                   </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default Uploadpdf