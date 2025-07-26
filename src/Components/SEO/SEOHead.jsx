

import React from 'react';
import { Helmet } from 'react-helmet-async';
import envConfig from '../../config/environment';

const SEOHead = ({
  title = 'Thoughts - Social Media Platform',
  description = 'Connect with friends, share your thoughts, and discover amazing content on Thoughts - the modern social media platform.',
  keywords = 'social media, thoughts, connect, share, friends, posts, stories',
  image = '/logo512.png',
  url = window.location.href,
  type = 'website',
  author = 'Thoughts Team',
  siteName = 'Thoughts',
  locale = 'en_US',
  twitterHandle = '@thoughts',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
  noFollow = false,
  canonicalUrl
}) => {
  // Construct full image URL
  const fullImageUrl = image.startsWith('http') 
    ? image 
    : `${window.location.origin}${image}`;

  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  const generateStructuredData = () => {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? 'Article' : 'WebPage',
      "headline": title,
      "description": description,
      "image": fullImageUrl,
      "url": url,
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo192.png`
        }
      }
    };

    if (type === 'article' && section) {
      baseStructuredData.articleSection = section;
    }

    if (tags.length > 0) {
      baseStructuredData.keywords = tags.join(', ');
    }

    return baseStructuredData;
  };

  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {section && (
        <meta property="article:section" content={section} />
      )}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href={envConfig.api.baseUrl} />
      <link rel="preconnect" href="https://res.cloudinary.com" />
    </Helmet>
  );
};

export default SEOHead;
