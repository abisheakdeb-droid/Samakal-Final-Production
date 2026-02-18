"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface NewsImageProps extends Omit<ImageProps, "onError"> {
    fallbackSrc?: string;
}

export default function NewsImage({
    src,
    alt,
    fallbackSrc = "/samakal-logo.png",
    className,
    ...props
}: NewsImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [error, setError] = useState(false);

    return (
        <Image
            {...props}
            src={imgSrc || fallbackSrc}
            alt={alt}
            className={className}
            onError={() => {
                if (!error) {
                    setImgSrc(fallbackSrc);
                    setError(true);
                }
            }}
        />
    );
}
