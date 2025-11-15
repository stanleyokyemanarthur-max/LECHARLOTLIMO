import React from "react";
import { useNavigate } from "react-router-dom";

function BlogCard({ blog }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-[#1a1a1a] overflow-hidden shadow-lg hover:scale-[1.02] transition-all">
      <img
        src={blog.image}
        alt={blog.name}
        className="w-full h-52 object-cover"
      />
      {/* Blog Content */}
      <div className="p-6">
        <div className="bg-[#d8c305c5] w-fit px-4 py-1.5 text-sm text-white font-bricolage rounded-md mb-4">
          {blog.date}
        </div>
        <h4 className="text-lg lg:text-2xl font-bricolage text-white font-semibold uppercase mb-3">
          {blog.name}
        </h4>
        <p className="text-gray-400 text-sm leading-relaxed font-bricolage">
          {blog.description?.slice(0, 120)}...
        </p>
        <button
          onClick={() => navigate(`/blog/${blog.id}`)}
          className="mt-4 text-[#d8c305c5] font-semibold font-bricolage hover:underline"
        >
          Read More →
        </button>
      </div>
    </div>
  );
}

export default BlogCard;
