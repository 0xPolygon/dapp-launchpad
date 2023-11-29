// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

contract Wall {
    // Structs
    struct Message {
        string message;
        address sender;
        uint256 timestamp;
    }

    // Events
    event MessagePosted(Message message);

    // Storage
    Message[] messages;

    /**
     * @dev Posts a message to the Wall
     * @param message String message to post
     */
    function postMessage(string calldata message) external {
        Message memory newMessage = Message(
            message,
            msg.sender,
            block.timestamp
        );
        messages.push(newMessage);
        emit MessagePosted(newMessage);
    }

    /**
     * @dev Gets list of all messages posted
     */
    function getAllPostedMessages() external view returns (Message[] memory) {
        return messages;
    }

    
}
