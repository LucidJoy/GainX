export const shortenAddress = (addr) => {
  return `${addr.slice(0, 4)}...${addr.slice(addr.length - 4, addr.length)}`;
};
