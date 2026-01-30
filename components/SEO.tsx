import React from 'react';

interface SEOProps {
    title: string;
    description: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description }) => {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Pappertech",
        "description": description,
        "applicationCategory": "ShoppingApplication",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    };

    return (
        <>
            <title>{title} | Pappertech</title>
            <meta name="description" content={description} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </>
    );
};
