
import React from 'react';
import { Helmet } from 'react-helmet';

interface PageHeaderProps {
  title: string;
  description: string;
  path?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  path = '' 
}) => {
  const fullTitle = `${title} | SpeakEasyAI`;
  const fullPath = `https://speakeasyai.com${path}`;
  
  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={fullPath} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
    </>
  );
};

export default PageHeader;
