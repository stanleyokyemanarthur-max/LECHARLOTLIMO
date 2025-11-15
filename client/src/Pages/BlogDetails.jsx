import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import blogdata from "../data/Blog.json";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogdata.find((b) => b.id === parseInt(id));

  if (!blog) {
    return (
      <div className="text-center text-white py-20">
        <p>Blog post not found.</p>
        <button
          onClick={() => navigate("/blog")}
          className="mt-4 bg-[#d8c305c5] text-white px-6 py-2 rounded-lg hover:bg-[#b8a705]"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white px-[12%] py-20">
      <img
        src={blog.image}
        alt={blog.name}
        className="w-full h-[400px] object-cover rounded-2xl mb-10"
      />
      <div className="bg-[#1a1a1a] p-10 rounded-2xl shadow-lg">
        <p className="text-[#d8c305c5] mb-2">{blog.date}</p>
        <h1 className="text-4xl font-bricolage font-bold mb-6">
          {blog.name}
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed font-bricolage whitespace-pre-line">
          {blog.content}
        </p>
      </div>
      <button
        onClick={() => navigate("/blog")}
        className="mt-10 bg-[#d8c305c5] text-white px-6 py-2 rounded-lg hover:bg-[#b8a705]"
      >
        Back to Blog
      </button>
    </div>
  );
}

export default BlogDetails;
