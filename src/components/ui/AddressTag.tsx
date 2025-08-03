import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface AddressTagProps {
    address: string;
    className?: string;
    truncateLength?: number;
}

const AddressTag = ({
    address,
    className = "",
    truncateLength = 6
}: AddressTagProps) => {
    const [showPopup, setShowPopup] = useState(false);
    const [copied, setCopied] = useState(false);

    const truncatedAddress = `${address.slice(0, truncateLength)}...${address.slice(-4)}`;

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    };

    return (
        <span
            className={`relative inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-blue-100 dark:bg-blue-900/30 
        text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700 
        hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 cursor-pointer 
        font-mono text-xs leading-none ${className}`}
            onMouseEnter={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}
            onClick={handleCopy}
        >
            <span className="select-all leading-none">
                {truncatedAddress}
            </span>
            <button
                onClick={handleCopy}
                className="opacity-60 hover:opacity-100 transition-opacity p-0"
                title="Copy address"
            >
                {copied ? (
                    <Check className="w-2.5 h-2.5 text-green-600" />
                ) : (
                    <Copy className="w-2.5 h-2.5" />
                )}
            </button>

            {/* Popup on hover */}
            {showPopup && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                    <div className="px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md shadow-lg font-mono text-xs whitespace-nowrap">
                        {address}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black dark:border-t-white"></div>
                    </div>
                </div>
            )}
        </span>
    );
};

export default AddressTag;
