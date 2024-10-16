import React, { useState } from 'react';
import { FaPaperPlane } from "react-icons/fa6";


const CreatePost = ({ userId, onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost/discuss/api.php?action=createPost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ user_id: userId, title, content }),
        });
        const data = await response.json();
        if (data.success) {
            onPostCreated();
            setTitle('');
            setContent('');
        } else {
            alert(data.error);
        }
    };

    return (
        <div className='
        flex flex-col p-10
        w-[1200px] min-h-[200px]
        bg-[#2e2e2e] rounded-3xl shadow-xl
        
        '>
            <h1 className='mb-5 text-3xl'>Create Post</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className='bg-[#2e2e2e] w-[400px] p-4 border-[#868686] border-b-2 focus:border-[#ffe01b]
                        transition-color duration-300 mb-4'
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                required
                className='bg-[#2e2e2e] p-4 border-[#868686] border-b-2 focus:border-[#ffe01b]
                        transition-color duration-300 mb-4'
            />
            <div className='flex justify-end'>
            <button type="submit" className='mt-2 font-bold text-base pl-10 pr-10'><FaPaperPlane /></button>
            </div>
        </form>
        
        </div>
        
    );
};

export default CreatePost;
