import React from 'react'
import blogdata from '../Blog.json'

function Blog() {
  return (
    <>
      <div className="banner-section flex justify-center items-center h-[358px] lg:h-[550px]">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-sm lg:text-xl text-white font-bricolage">
            BLOG<span className="text-[#d8c305c5]">& NEWS</span>
          </h6>
          <h1 className="text-4xl lg:text-5xl xl:text-8xl font-semibold font-bricolage text-[#d8c305c5]">
            <span className="text-white font-bricolage">LATEST</span> NEWS
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:px-[12%] px-[8%] py-[50px] lg:py-[90px]">
        {blogdata.map((blog) => (
          <div key={blog.id}
            className="blog-item bg-[#1f1f22] group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Blog Image */}
            <div className="blog-image overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="group-hover:scale-110 transition-all duration-500 w-full h-[250px] object-cover"
              />
            </div>

            {/* Blog Content */}
            <div className="blog-content p-6">
              <div className="date bg-[#d8c305c5] w-fit px-4 py-1.5 text-sm text-white font-bricolage rounded-md mb-4">
                {blog.date}
              </div>
              <h4 className="text-lg lg:text-2xl font-bricolage text-white font-semibold uppercase mb-3">
                {blog.name}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed font-bricolage">
                {blog.description?.slice(0, 120)}...
              </p>
              <button className="mt-4 text-[#d8c305c5] font-semibold font-bricolage hover:underline">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Blog