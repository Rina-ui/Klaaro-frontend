// PageAnimation.tsx
import { motion } from 'framer-motion';
import React from 'react';

interface PageAnimationProps {
    children: React.ReactNode;
}

export default function PageAnimation({ children }: PageAnimationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{
                duration: 0.4,
                ease: [0.215, 0.610, 0.355, 1]
            }}
            className="w-full min-h-screen flex flex-col"
        >
            {children}
        </motion.div>
    );
}