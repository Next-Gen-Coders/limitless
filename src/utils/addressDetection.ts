// Address detection patterns
const ADDRESS_PATTERNS = {
  // Ethereum addresses (0x followed by 40 hex chars)
  ethereum: /0x[a-fA-F0-9]{40}/g,
  // Bitcoin addresses (various formats)
  bitcoin: /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b|bc1[a-z0-9]{39,59}/g,
  // Solana addresses (base58, typically 32-44 chars)
  solana: /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g,
  // Add more patterns as needed
};

export interface DetectedAddress {
  value: string;
  type: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Detects cryptocurrency addresses in text
 */
export const detectAddresses = (text: string): DetectedAddress[] => {
  const addresses: DetectedAddress[] = [];

  // Check for Ethereum addresses first (most specific)
  let match;
  const ethRegex = new RegExp(ADDRESS_PATTERNS.ethereum.source, "g");
  while ((match = ethRegex.exec(text)) !== null) {
    addresses.push({
      value: match[0],
      type: "ethereum",
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  // Check for Bitcoin addresses
  const btcRegex = new RegExp(ADDRESS_PATTERNS.bitcoin.source, "g");
  while ((match = btcRegex.exec(text)) !== null) {
    // Make sure it doesn't overlap with already detected addresses
    const overlaps = addresses.some(
      (addr) => match!.index >= addr.startIndex && match!.index < addr.endIndex
    );
    if (!overlaps) {
      addresses.push({
        value: match[0],
        type: "bitcoin",
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // Check for Solana addresses (but exclude if it's already detected as another type)
  const solRegex = new RegExp(ADDRESS_PATTERNS.solana.source, "g");
  while ((match = solRegex.exec(text)) !== null) {
    // Skip if it looks like an Ethereum address or already detected
    if (match[0].startsWith("0x")) continue;

    const overlaps = addresses.some(
      (addr) => match!.index >= addr.startIndex && match!.index < addr.endIndex
    );
    if (!overlaps) {
      addresses.push({
        value: match[0],
        type: "solana",
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // Sort by start index to maintain order
  return addresses.sort((a, b) => a.startIndex - b.startIndex);
};

/**
 * Checks if text contains any cryptocurrency addresses
 */
export const hasAddresses = (text: string): boolean => {
  return detectAddresses(text).length > 0;
};

/**
 * Replaces addresses in text with placeholders for processing
 */
export const replaceAddressesWithPlaceholders = (
  text: string
): {
  processedText: string;
  addresses: DetectedAddress[];
} => {
  const addresses = detectAddresses(text);
  let processedText = text;

  // Replace from end to start to maintain indices
  for (let i = addresses.length - 1; i >= 0; i--) {
    const address = addresses[i];
    const placeholder = `__ADDRESS_${i}__`;
    processedText =
      processedText.substring(0, address.startIndex) +
      placeholder +
      processedText.substring(address.endIndex);
  }

  return { processedText, addresses };
};

/**
 * Restores addresses from placeholders
 */
export const restoreAddressesFromPlaceholders = (
  text: string,
  addresses: DetectedAddress[]
): string => {
  let restoredText = text;

  for (let i = 0; i < addresses.length; i++) {
    const placeholder = `__ADDRESS_${i}__`;
    restoredText = restoredText.replace(placeholder, addresses[i].value);
  }

  return restoredText;
};
