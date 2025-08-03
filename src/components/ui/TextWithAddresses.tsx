import React from 'react';
import AddressTag from './AddressTag';
import { detectAddresses, DetectedAddress } from '../../utils/addressDetection';

interface TextWithAddressesProps {
  text: string;
  className?: string;
  addressClassName?: string;
}

const TextWithAddresses = ({ 
  text, 
  className = "", 
  addressClassName = "" 
}: TextWithAddressesProps) => {
  const addresses = detectAddresses(text);
  
  if (addresses.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  addresses.forEach((address: DetectedAddress, index: number) => {
    // Add text before the address
    if (address.startIndex > lastIndex) {
      parts.push(
        <span key={`text-${index}`}>
          {text.substring(lastIndex, address.startIndex)}
        </span>
      );
    }

    // Add the address tag
    parts.push(
      <AddressTag
        key={`address-${index}`}
        address={address.value}
        className={addressClassName}
      />
    );

    lastIndex = address.endIndex;
  });

  // Add remaining text after the last address
  if (lastIndex < text.length) {
    parts.push(
      <span key="text-end">
        {text.substring(lastIndex)}
      </span>
    );
  }

  return <span className={className}>{parts}</span>;
};

export default TextWithAddresses;
