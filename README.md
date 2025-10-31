# FHE Lottery - Privacy-Preserving Blockchain Lottery

<div align="center">

**🎰 The world's first fully encrypted on-chain lottery using Fully Homomorphic Encryption**

[Live Demo](https://fhelottery.vercel.app) | [How It Works](https://fhelottery.vercel.app/how-it-works) | [Etherscan](https://sepolia.etherscan.io/address/0xA1eF001A18db93e6a08584571Fb8c3D4d96a0315)

</div>

---

## 📖 Project Overview

**FHE Lottery** is a revolutionary blockchain lottery platform that uses **Zama's Fully Homomorphic Encryption (FHE)** technology to implement a completely privacy-preserving on-chain lottery system.

### Why Choose FHE Lottery?

Traditional blockchain lotteries have several problems:
- ❌ All numbers are publicly visible on-chain
- ❌ Risk of cheating and manipulation
- ❌ User privacy cannot be guaranteed

**FHE Lottery's Innovative Solution:**
- ✅ **Complete Privacy**: User-selected numbers are FHE encrypted; no one (including administrators) can see them
- ✅ **Fair & Transparent**: Drawing process is automatically executed on-chain, no human intervention possible
- ✅ **Instant Payouts**: Winners receive prizes instantly through smart contracts
- ✅ **Verifiable**: All transactions and draw records are permanently stored on the blockchain

---

## 🎮 How to Play

### 1. Connect Wallet
Use **RainbowKit** to connect your Web3 wallet (MetaMask, WalletConnect, etc.) to the **Sepolia Testnet**.

### 2. Pick Your Lucky Numbers
- Select **6 unique numbers** from 1-49
- Choose manually or use **Quick Pick** for random generation
- Numbers will be FHE encrypted on the client-side

### 3. Buy Ticket
- Pay the ticket fee (default 0.01 ETH)
- Encrypted numbers are submitted to the smart contract
- Numbers remain encrypted and stored on the blockchain

### 4. Wait for Draw
- Each lottery round lasts **15 days**
- After the draw time, admin triggers on-chain drawing
- Winning numbers are generated through on-chain randomness

### 5. Check Results
- View your tickets in the **My Tickets** page
- Numbers are displayed as 🔒 encrypted icons (plaintext not visible)
- After drawing, you can see the winning numbers
- Winners can claim their prizes

---

## 🏗️ Technical Architecture

### Frontend Tech Stack

```
├── React 18                    # UI Framework
├── TypeScript                  # Type Safety
├── Vite                        # Build Tool
├── Tailwind CSS                # Styling Framework
├── shadcn/ui                   # UI Component Library
├── Wagmi v2                    # Ethereum Interaction
├── RainbowKit                  # Wallet Connection
├── Zama Relayer SDK v0.2.0     # FHE Encryption Library
└── React Router                # Routing
```

### Smart Contract Tech Stack

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, ebool, externalEuint8 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract FHELottery is SepoliaConfig {
    struct Ticket {
        address buyer;
        euint8[6] numbers;     // FHE encrypted numbers
        uint256 purchaseTime;
    }

    struct LotteryRound {
        string name;
        uint256 startTime;
        uint256 endTime;
        bool drawn;
        uint8[6] winningNumbers;
        uint256 ticketPrice;
        uint256 prizePool;
        Ticket[] tickets;
        address[] winners;
    }
}
```

**Core Technologies:**
- **Zama fhEVM v0.5**: Ethereum-compatible FHE virtual machine
- **Solidity 0.8.24**: Smart contract language
- **OpenZeppelin Contracts**: Secure contract library
- **Hardhat**: Smart contract development framework

### Deployment Architecture

```
┌─────────────────┐
│  User Browser   │
│   Zama SDK     │  ← FHE encrypt numbers
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Vercel CDN     │  ← Frontend hosting
│(fhelottery.app) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Sepolia Testnet │  ← Smart contract
│ FHELottery.sol  │
└─────────────────┘
```

---

## 🔐 FHE Technology Deep Dive

### What is Fully Homomorphic Encryption (FHE)?

FHE allows computation directly on **encrypted data** without decryption. This means:

```typescript
// Traditional encryption: must decrypt to compute
plaintext = decrypt(encrypted_data)
result = compute(plaintext)
final = encrypt(result)

// FHE: compute directly on encrypted data
encrypted_result = compute(encrypted_data)  // No decryption needed!
```

### FHE in Lottery Applications

#### 1. Number Encryption (Client-side)

```typescript
// src/lib/fhe.ts
export const encryptLotteryNumbers = async (
  numbers: number[],
  contractAddress: string,
  userAddress: string
): Promise<{
  encryptedNumbers: `0x${string}`[];
  proofs: `0x${string}`[];
}> => {
  const fhe = await initializeFHE();
  const encryptedNumbers: `0x${string}`[] = [];
  const proofs: `0x${string}`[] = [];

  for (const number of numbers) {
    // Create encrypted input
    const input = fhe.createEncryptedInput(contractAddress, userAddress);
    input.add8(number);  // Add 8-bit unsigned integer

    // Execute encryption
    const { handles, inputProof } = await input.encrypt();

    encryptedNumbers.push(toHex(handles[0]));
    proofs.push(toHex(inputProof));
  }

  return { encryptedNumbers, proofs };
};
```

**Workflow:**
1. User selects numbers in browser: `[5, 12, 23, 34, 41, 49]`
2. Zama SDK encrypts each number using contract public key
3. Generate encrypted data and zero-knowledge proofs
4. Submit to smart contract: `0x7a8f3d...` (ciphertext)

#### 2. On-Chain Verification and Storage (Smart Contract)

```solidity
// contracts/src/FHELottery.sol
function buyTicket(
    uint256 roundId,
    externalEuint8[6] calldata encryptedNumbers,
    bytes[6] calldata proofs
) external payable {
    euint8[6] memory numbers;

    // Import and verify encrypted data
    for (uint i = 0; i < 6; i++) {
        numbers[i] = FHE.asEuint8(encryptedNumbers[i], proofs[i]);

        // Verify range (1-49) in encrypted state
        ebool valid = FHE.and(
            FHE.gte(numbers[i], FHE.asEuint8(1)),
            FHE.lte(numbers[i], FHE.asEuint8(49))
        );
        FHE.req(valid);
    }

    // Store encrypted numbers
    round.tickets.push(Ticket({
        buyer: msg.sender,
        numbers: numbers,  // euint8[6] stored encrypted
        purchaseTime: block.timestamp
    }));
}
```

**FHE Operations Explained:**
- `FHE.asEuint8()`: Import external encrypted data to on-chain
- `FHE.gte()`, `FHE.lte()`: Encrypted comparison operations
- `FHE.and()`: Encrypted logical AND operation
- `FHE.req()`: Encrypted assertion, reverts if validation fails

#### 3. Winner Determination (Encrypted Comparison)

```solidity
function determineWinners(uint256 roundId) external onlyAdmin {
    LotteryRound storage round = rounds[roundId];
    uint8[6] memory winning = round.winningNumbers;

    for (uint i = 0; i < round.tickets.length; i++) {
        Ticket storage ticket = round.tickets[i];
        ebool[6] memory matches;

        // Compare numbers in encrypted state
        for (uint j = 0; j < 6; j++) {
            matches[j] = FHE.eq(
                ticket.numbers[j],
                FHE.asEuint8(winning[j])
            );
        }

        // Calculate match count (encrypted computation)
        euint8 matchCount = FHE.asEuint8(0);
        for (uint j = 0; j < 6; j++) {
            matchCount = FHE.add(
                matchCount,
                FHE.select(matches[j], FHE.asEuint8(1), FHE.asEuint8(0))
            );
        }

        // Check if all matches
        ebool isWinner = FHE.eq(matchCount, FHE.asEuint8(6));

        // Only add to winners list if won
        if (FHE.decrypt(isWinner)) {
            round.winners.push(ticket.buyer);
        }
    }
}
```

**Key FHE Methods and Their Purpose:**

| Method | Purpose | Example Use Case |
|--------|---------|------------------|
| `FHE.asEuint8()` | Create encrypted integer | Convert plaintext number to encrypted state |
| `FHE.eq()` | Encrypted equality comparison | Check if winning numbers match |
| `FHE.add()` | Encrypted addition | Count number of matches |
| `FHE.select()` | Encrypted conditional selection | Select value based on condition |
| `FHE.decrypt()` | Decrypt result | Final winner determination (requires authorization) |

---

## 🚀 Deployment Guide

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or other Web3 wallet
- Sepolia Testnet ETH (get from [faucet](https://sepoliafaucet.com/))

### 1. Clone Project

```bash
git clone <your-repo-url>
cd FHE-Lottery
```

### 2. Install Dependencies

```bash
# Frontend dependencies
npm install

# Contract dependencies
cd contracts
npm install
cd ..
```

### 3. Configure Environment Variables

Create `.env` file:

```bash
# Frontend configuration
VITE_CONTRACT_ADDRESS=0xA1eF001A18db93e6a08584571Fb8c3D4d96a0315
VITE_CHAIN_ID=11155111

# Contract configuration (in contracts/.env)
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here
```

### 4. Compile Smart Contracts

```bash
cd contracts
npx hardhat compile
```

### 5. Deploy Smart Contracts

```bash
# Deploy to Sepolia
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" \
npx hardhat run scripts/deploy.js --network sepolia

# Create first lottery round
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" \
npx hardhat run scripts/create-lottery-round.js --network sepolia
```

### 6. Start Development Server

```bash
# Return to project root
cd ..

# Start dev server
npm run dev
```

Visit http://localhost:5173

### 7. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Important: Configure SPA Routing**

Create `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures sub-pages don't return 404 errors on refresh.

---

## 🧪 Testing Guide

### Frontend Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Test coverage
npm run test:coverage

# UI test mode
npm run test:ui
```

### Smart Contract Testing

```bash
cd contracts

# Run tests
npx hardhat test

# Test coverage
npx hardhat coverage

# Gas report
REPORT_GAS=true npx hardhat test
```

### Integration Testing Flow

1. **Create Lottery Round**
```bash
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" \
npx hardhat run scripts/create-lottery-round.js --network sepolia
```

2. **Buy Test Ticket**
- Open frontend application
- Connect wallet to Sepolia
- Select 6 numbers
- Buy ticket (requires Sepolia ETH)

3. **Verify Transaction**
```bash
# View transaction details
https://sepolia.etherscan.io/tx/<transaction-hash>

# Check contract state
npx hardhat run scripts/check-round-status.js --network sepolia
```

4. **Simulate Drawing**
```bash
# Wait for round to end or manually trigger
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" \
npx hardhat run scripts/draw-round.js --network sepolia
```

---

## 📁 Project Structure

```
FHE-Lottery/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation bar (with wallet connection)
│   │   ├── Hero.tsx         # Homepage hero section
│   │   ├── LotterySelector.tsx  # Number selector (with FHE encryption)
│   │   ├── MyTickets.tsx    # My tickets (shows encrypted icons)
│   │   └── RecentWinners.tsx    # Recent winners
│   ├── pages/
│   │   ├── Index.tsx        # Homepage
│   │   └── HowItWorksPage.tsx   # How it works page (with demo video)
│   ├── hooks/
│   │   └── useLottery.ts    # Lottery contract interaction hooks
│   ├── lib/
│   │   └── fhe.ts           # FHE encryption utility functions
│   ├── config/
│   │   ├── wagmi.ts         # Wagmi configuration
│   │   ├── contracts.ts     # Contract addresses and ABIs
│   │   └── FHELotteryABI.json   # Contract ABI
│   └── App.tsx              # Application entry point
├── contracts/
│   ├── src/
│   │   └── FHELottery.sol   # FHE lottery main contract
│   ├── scripts/
│   │   ├── deploy.js        # Deployment script
│   │   ├── create-lottery-round.js  # Create round
│   │   └── draw-round.js    # Drawing script
│   ├── test/
│   │   └── FHELottery.test.js   # Contract tests
│   └── hardhat.config.js    # Hardhat configuration
├── public/
│   ├── demo.mp4             # Demo video
│   └── favicon.svg          # Website icon
├── vercel.json              # Vercel SPA routing configuration
├── package.json
└── README.md
```

---

## 🔗 Links

- **Live Demo**: https://fhelottery.vercel.app
- **How It Works**: https://fhelottery.vercel.app/how-it-works
- **Smart Contract**: [0xA1eF001A18db93e6a08584571Fb8c3D4d96a0315](https://sepolia.etherscan.io/address/0xA1eF001A18db93e6a08584571Fb8c3D4d96a0315)
- **Zama fhEVM Docs**: https://docs.zama.ai/fhevm
- **Sepolia Faucet**: https://sepoliafaucet.com/

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI Framework
- **TypeScript 5.6.2** - Type Safety
- **Vite 5.4.2** - Build Tool
- **Tailwind CSS 3.4.1** - Styling Framework
- **shadcn/ui** - UI Component Library
- **Wagmi 2.13.6** - Ethereum React Hooks
- **RainbowKit 2.3.0** - Wallet Connection
- **Zama Relayer SDK 0.2.0** - FHE Encryption

### Smart Contracts
- **Solidity 0.8.24** - Smart Contract Language
- **Zama fhEVM v0.5** - FHE Virtual Machine
- **Hardhat 2.22.0** - Development Framework
- **OpenZeppelin Contracts 5.1.0** - Secure Contract Library

### Deployment
- **Vercel** - Frontend Hosting
- **Sepolia Testnet** - Test Network
- **Etherscan** - Block Explorer

---

## 📝 Roadmap

### Phase 1: Core Features ✅
- [x] FHE number encryption
- [x] Smart contract deployment
- [x] Frontend interface
- [x] Wallet connection
- [x] Buy tickets
- [x] View history

### Phase 2: Enhanced Features 🚧
- [ ] Multi-round lottery support
- [ ] Prize pool accumulation
- [ ] Automatic winner notifications
- [ ] Historical winning records
- [ ] Lottery statistics analysis

### Phase 3: Advanced Features 🔮
- [ ] Automatic prize claiming
- [ ] NFT lottery tickets
- [ ] Social sharing
- [ ] Referral rewards
- [ ] DAO governance

### Phase 4: Mainnet Deployment 🌐
- [ ] Security audit
- [ ] Stress testing
- [ ] Mainnet deployment
- [ ] Marketing campaign

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This project is for **technical demonstration and educational purposes only**, deployed on Sepolia testnet.

- ⚠️ Do not use real funds on mainnet
- ⚠️ Smart contracts have not been formally audited
- ⚠️ Use at your own risk

---

## 💬 Contact

For questions or suggestions, please contact us through:

- GitHub Issues: [Submit Issue](../../issues)
- Email: support@fhelottery.com
- Twitter: [@FHELottery](https://twitter.com/FHELottery)

---

<div align="center">

**🎰 Built with ❤️ using Zama FHE Technology**

[⬆ Back to Top](#fhe-lottery---privacy-preserving-blockchain-lottery)

</div>
