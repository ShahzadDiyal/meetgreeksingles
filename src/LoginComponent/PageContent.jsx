import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';

const PageContent = () => {
  const { pageName } = useParams();  
  const [page, setPage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const basUrl = "https://meetgreek.dhsol.net/api/";  

  // Check if user is authenticated
  useEffect(() => {
    const userData = localStorage.getItem('Register_User');
    setIsAuthenticated(!!userData); // Set true if userData exists
  }, []);

  useEffect(() => {
    // Fetch all pages and find the matching one
    axios.post(`${basUrl}pagelist.php`)
      .then((res) => {
        const allPages = res.data.pagelist;
        
        // Find the page that matches the URL parameter
        const foundPage = allPages.find(item => {
          // Convert title to same format as your menu links
          const titleFormatted = item.title.replace(/\s+/g, "_").toLowerCase();
          return titleFormatted === pageName;
        });
        
        setPage(foundPage);
      })
      .catch(error => {
        console.error("Error fetching page:", error);
      });
  }, [pageName]);

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  if (!page) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
    <div className={`pt-[90px] pr-[20px] md:pr-[20px] pl-[60px] mb-4 ${
      isAuthenticated ? 'md:pl-[320px] pt-[120px]' : ''
    }`}>
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <div 
        className="page-content"
        dangerouslySetInnerHTML={{ __html: decodeHtml(page.description) }}
      />
    </div>
      <Footer />
      </>

  );
};

export default PageContent;