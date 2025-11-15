import React from "react";
import BlogCard from "../Components/BlogCard";
import blogdata from "../data/Blog.json";

function BlogList() {
  return (
    <div className="bg-[#121212] min-h-screen text-white px-[12%] py-20">
      <h1 className="text-4xl font-bricolage font-bold mb-10 text-center">
        Our Blog
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogdata.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default BlogList;
