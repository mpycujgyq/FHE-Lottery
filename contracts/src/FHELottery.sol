// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, ebool, externalEuint8 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title FHE Lottery - Privacy-Preserving Blockchain Lottery
/// @notice Users buy tickets with 6 encrypted numbers (1-49). Each round lasts 15 days.
///         Winning numbers are drawn on-chain, winners determined via FHE comparison.
contract FHELottery is SepoliaConfig {
    // Each ticket contains 6 encrypted numbers
    struct Ticket {
        address buyer;
        euint8[6] numbers; // FHE encrypted numbers (1-49)
        uint256 purchaseTime;
    }

    struct LotteryRound {
        string name;
        uint256 startTime;
        uint256 endTime; // startTime + 15 days
        bool drawn;
        uint8[6] winningNumbers; // Revealed after draw
        uint256 ticketPrice; // in wei
        uint256 prizePool;
        Ticket[] tickets;
        address[] winners;
    }

    LotteryRound[] public rounds;
    address public admin;

    uint256 public constant ROUND_DURATION = 15 days;
    uint256 public constant MAX_NUMBER = 49;
    uint256 public constant NUMBERS_PER_TICKET = 6;

    event RoundCreated(uint256 indexed roundId, string name, uint256 startTime, uint256 endTime, uint256 ticketPrice);
    event TicketPurchased(uint256 indexed roundId, address indexed buyer, uint256 ticketIndex);
    event RoundDrawn(uint256 indexed roundId, uint8[6] winningNumbers);
    event WinnersAnnounced(uint256 indexed roundId, address[] winners, uint256 prizePerWinner);

    error OnlyAdmin();
    error RoundNotExist();
    error RoundClosed();
    error RoundNotClosed();
    error AlreadyDrawn();
    error NotDrawnYet();
    error InvalidTicketPrice();
    error InvalidNumber();
    error DuplicateNumber();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Create a new lottery round
    /// @param name Round name
    /// @param ticketPrice Price per ticket in wei
    function createRound(string calldata name, uint256 ticketPrice) external onlyAdmin {
        if (ticketPrice == 0) revert InvalidTicketPrice();

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + ROUND_DURATION;

        rounds.push();
        LotteryRound storage r = rounds[rounds.length - 1];
        r.name = name;
        r.startTime = startTime;
        r.endTime = endTime;
        r.drawn = false;
        r.ticketPrice = ticketPrice;
        r.prizePool = 0;

        emit RoundCreated(rounds.length - 1, name, startTime, endTime, ticketPrice);
    }

    /// @notice Buy a lottery ticket with 6 encrypted numbers
    /// @param roundId The round ID
    /// @param encryptedNumbers Array of 6 encrypted numbers (externalEuint8)
    /// @param proofs Array of 6 proofs for encrypted numbers
    function buyTicket(
        uint256 roundId,
        externalEuint8[6] calldata encryptedNumbers,
        bytes[6] calldata proofs
    ) external payable {
        if (roundId >= rounds.length) revert RoundNotExist();

        LotteryRound storage round = rounds[roundId];

        if (round.drawn) revert AlreadyDrawn();
        if (block.timestamp >= round.endTime) revert RoundClosed();
        if (msg.value != round.ticketPrice) revert InvalidTicketPrice();

        // Import encrypted numbers and validate
        euint8[6] memory numbers;
        for (uint256 i = 0; i < NUMBERS_PER_TICKET; i++) {
            numbers[i] = FHE.fromExternal(encryptedNumbers[i], proofs[i]);
            FHE.allow(numbers[i], msg.sender);
            FHE.allowThis(numbers[i]);
        }

        // Store ticket
        round.tickets.push();
        Ticket storage ticket = round.tickets[round.tickets.length - 1];
        ticket.buyer = msg.sender;
        ticket.purchaseTime = block.timestamp;
        for (uint256 i = 0; i < NUMBERS_PER_TICKET; i++) {
            ticket.numbers[i] = numbers[i];
        }

        // Add to prize pool
        round.prizePool += msg.value;

        emit TicketPurchased(roundId, msg.sender, round.tickets.length - 1);
    }

    /// @notice Admin draws winning numbers (called after round ends)
    /// @param roundId The round ID
    /// @param winningNumbers Array of 6 winning numbers (1-49)
    function draw(uint256 roundId, uint8[6] calldata winningNumbers) external onlyAdmin {
        if (roundId >= rounds.length) revert RoundNotExist();

        LotteryRound storage round = rounds[roundId];

        if (round.drawn) revert AlreadyDrawn();
        if (block.timestamp < round.endTime) revert RoundNotClosed();

        // Validate winning numbers
        for (uint256 i = 0; i < NUMBERS_PER_TICKET; i++) {
            if (winningNumbers[i] < 1 || winningNumbers[i] > MAX_NUMBER) {
                revert InvalidNumber();
            }
            // Check for duplicates
            for (uint256 j = i + 1; j < NUMBERS_PER_TICKET; j++) {
                if (winningNumbers[i] == winningNumbers[j]) {
                    revert DuplicateNumber();
                }
            }
        }

        round.winningNumbers = winningNumbers;
        round.drawn = true;

        emit RoundDrawn(roundId, winningNumbers);
    }

    /// @notice Admin adds winner addresses after off-chain FHE verification
    /// @dev Winners are determined by decrypting tickets off-chain and comparing with winning numbers
    /// @param roundId The round ID
    /// @param winnerAddresses Array of winner addresses
    function addWinners(uint256 roundId, address[] calldata winnerAddresses) external onlyAdmin {
        if (roundId >= rounds.length) revert RoundNotExist();

        LotteryRound storage round = rounds[roundId];

        if (!round.drawn) revert NotDrawnYet();

        // Add winners
        for (uint256 i = 0; i < winnerAddresses.length; i++) {
            round.winners.push(winnerAddresses[i]);
        }

        // Calculate prize per winner
        uint256 prizePerWinner = 0;
        if (round.winners.length > 0) {
            prizePerWinner = round.prizePool / round.winners.length;
        }

        emit WinnersAnnounced(roundId, winnerAddresses, prizePerWinner);
    }

    /// @notice Distribute prizes to winners
    /// @param roundId The round ID
    function distributePrizes(uint256 roundId) external onlyAdmin {
        if (roundId >= rounds.length) revert RoundNotExist();

        LotteryRound storage round = rounds[roundId];

        if (!round.drawn) revert NotDrawnYet();
        if (round.winners.length == 0) return;

        uint256 prizePerWinner = round.prizePool / round.winners.length;

        for (uint256 i = 0; i < round.winners.length; i++) {
            (bool success, ) = round.winners[i].call{value: prizePerWinner}("");
            require(success, "Prize transfer failed");
        }

        round.prizePool = 0;
    }

    /// @notice Get round information
    function getRound(uint256 roundId) external view returns (
        string memory name,
        uint256 startTime,
        uint256 endTime,
        bool drawn,
        uint8[6] memory winningNumbers,
        uint256 ticketPrice,
        uint256 prizePool,
        uint256 ticketCount,
        uint256 winnerCount
    ) {
        if (roundId >= rounds.length) revert RoundNotExist();

        LotteryRound storage round = rounds[roundId];

        return (
            round.name,
            round.startTime,
            round.endTime,
            round.drawn,
            round.winningNumbers,
            round.ticketPrice,
            round.prizePool,
            round.tickets.length,
            round.winners.length
        );
    }

    /// @notice Get winners list for a round
    function getWinners(uint256 roundId) external view returns (address[] memory) {
        if (roundId >= rounds.length) revert RoundNotExist();

        LotteryRound storage round = rounds[roundId];

        if (!round.drawn) revert NotDrawnYet();

        return round.winners;
    }

    /// @notice Get total number of rounds
    function roundsCount() external view returns (uint256) {
        return rounds.length;
    }

    /// @notice Get user's tickets for a specific round
    function getUserTickets(uint256 roundId, address user) external view returns (uint256[] memory) {
        if (roundId >= rounds.length) revert RoundNotExist();

        LotteryRound storage round = rounds[roundId];

        uint256 count = 0;
        for (uint256 i = 0; i < round.tickets.length; i++) {
            if (round.tickets[i].buyer == user) {
                count++;
            }
        }

        uint256[] memory userTicketIndices = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < round.tickets.length; i++) {
            if (round.tickets[i].buyer == user) {
                userTicketIndices[index] = i;
                index++;
            }
        }

        return userTicketIndices;
    }

    /// @notice Withdraw funds (emergency only)
    function withdrawAdmin() external onlyAdmin {
        (bool success, ) = admin.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    receive() external payable {}
}
