const ipfsUrls = [
    'https://cloudflare-ipfs.com/ipfs',
    'https://infura-ipfs.io/ipfs',
    'https://ipfs.io/ipfs',
];

const getIpfsUrl = (ipfs) => {
    return ipfs
        ? `${ipfsUrls[~~(Math.random() * ipfsUrls.length)]}/${ipfs.slice(7)}`
        : null;
};

export default getIpfsUrl;
