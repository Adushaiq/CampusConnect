import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from 'react-hot-toast';

export default function DeletePost() {
    const { id } = useParams();
    const [deletePost, setDeletePost] = useState(false);



    async function handleSubmit() {
        try {
            const response = await fetch(`http://localhost:4000/delete/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Post Deleted')
                setDeletePost(true);
            } else {
                toast.error('Failed to delete. Please try again!')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }



    if (deletePost) {
        return (
            <div className="deletedSuccess">
                Post Deleted Successfully!
                <Link to={'/blog'} className="goHomeBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Home page
                </Link>
            </div>
        )
    }



    return (
        <div>

            <div className="deletePostPage">
                Are you sure you want to delete this post?
                <div className="deleteBtnGrp">
                    <Link className="deleteBtn" onClick={handleSubmit}>Yes</Link>
                    <Link className="deleteBtn" to={'/blog'}>No</Link>
                </div>
            </div>

        </div>
    )
}