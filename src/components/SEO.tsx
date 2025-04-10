
import { Helmet } from "react-helmet";

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
};

const SEO = ({
  title = "SpeakEasyAI - Public Speaking Practice & AI Feedback",
  description = "Improve your public speaking skills with SpeakEasyAI. Get real-time feedback on speeches, practice presentations, and eliminate filler words with our AI-powered coach.",
  canonical = "https://speakeasyai.vercel.app",
  ogType = "website",
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png"
}: SEOProps) => {
  const siteTitle = "SpeakEasyAI";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@speakeasyai" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
