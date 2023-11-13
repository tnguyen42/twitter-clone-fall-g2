// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Twitter {
  struct Tweet {
    uint id;
    address author;
    string content;
    uint timestamp;
  }

  Tweet[] public tweets;

  modifier onlyAuthor(uint _id) {
    require(
      tweets[_id].author == msg.sender,
      'You are not the author of this tweet'
    );
    _;
  }

  /**
   * A function to create a tweet
   * @param _content The content of the tweet
   */
  function createTweet(string memory _content) external {
    tweets.push(Tweet(tweets.length, msg.sender, _content, block.timestamp));
  }

  /**
   * A function to get all the tweets
   * @return Tweet[] An array of all the tweets
   */
  function getTweets() external view returns (Tweet[] memory) {
    return tweets;
  }

  /**
   * A function that allows a user to edit their own tweet
   * @param _id The id of the tweet to edit
   * @param _newContent The new content of the tweet
   */
  function editTweet(
    uint _id,
    string memory _newContent
  ) external onlyAuthor(_id) {
    tweets[_id].content = _newContent;
  }
}
