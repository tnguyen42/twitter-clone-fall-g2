// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';

contract Twitter is Ownable {
  struct Tweet {
    uint id;
    address author;
    string content;
    uint timestamp;
    bool isDeleted;
  }

  Tweet[] public tweets;

  modifier onlyAuthor(uint _id) {
    require(
      tweets[_id].author == msg.sender,
      'You are not the author of this tweet'
    );
    _;
  }

  modifier notDeleted(uint _id) {
    require(!tweets[_id].isDeleted, 'This tweet has been deleted');
    _;
  }

  /**
   * A function that allows the owner of the contract to withdraw the balance
   */
  function withdraw() external onlyOwner {
    address payable _owner = payable(owner());

    _owner.transfer(address(this).balance);
  }

  /**
   * A function to create a tweet
   * @param _content The content of the tweet
   */
  function createTweet(string memory _content) external {
    tweets.push(
      Tweet(tweets.length, msg.sender, _content, block.timestamp, false)
    );
  }

  /**
   * A function to get all the tweets
   * @return Tweet[] An array of all the tweets
   */
  function getTweets() external view returns (Tweet[] memory) {
    uint numberOfNotDeletedTweets = 0;

    for (uint i = 0; i < tweets.length; i++) {
      if (!tweets[i].isDeleted) {
        numberOfNotDeletedTweets++;
      }
    }

    Tweet[] memory _tweets = new Tweet[](numberOfNotDeletedTweets);
    uint j = 0;

    for (uint i = 0; i < tweets.length; i++) {
      if (!tweets[i].isDeleted) {
        _tweets[j] = tweets[i];
        j++;
      }
    }

    return _tweets;
  }

  /**
   * A function that allows a user to edit their own tweet
   * @param _id The id of the tweet to edit
   * @param _newContent The new content of the tweet
   */
  function editTweet(
    uint _id,
    string memory _newContent
  ) external onlyAuthor(_id) notDeleted(_id) {
    tweets[_id].content = _newContent;
  }

  /**
   * A function that allows a user to delete their own tweet
   * @param _id The id of the tweet to delete
   */
  function deleteTweet(uint _id) external onlyAuthor(_id) notDeleted(_id) {
    tweets[_id].isDeleted = true;
  }
}
