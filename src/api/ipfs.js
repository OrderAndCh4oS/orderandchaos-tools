// converts an ipfs hash to ipfs url
export const HashToURL = (
    hash,
    type = "NFTSTORAGE"
  ) => {
    // when on preview the hash might be undefined.
    // its safe to return empty string as whatever called HashToURL is not going to be used
    // artifactUri or displayUri
    if (hash == null) {
      return ''
    }

    switch (type) {
      case 'HIC':
        return hash.replace('ipfs://', 'https://pinata.hicetnunc.xyz/ipfs/')
      case 'CLOUDFLARE':
        return hash.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
      case 'PINATA':
        return hash.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
      case 'IPFS':
        return hash.replace('ipfs://', 'https://ipfs.io/ipfs/')
      case 'DWEB':
        return hash.replace('ipfs://', 'http://dweb.link/ipfs/')
      case 'NFTSTORAGE':
        return hash.replace('ipfs://', 'https://nftstorage.link/ipfs/')

      default:
        console.error('please specify type')
        return null
    }
  }
