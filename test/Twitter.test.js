const { expect } = require('chai');
const { describe, it, beforeEach } = require('mocha');
const { ethers } = require('hardhat');

describe('Twitter', () => {
  let twitter;
  let owner;
  let otherAccount;

  beforeEach(async () => {
    [owner, otherAccount] = await ethers.getSigners();

    const Twitter = await ethers.getContractFactory('Twitter');
    twitter = await Twitter.deploy();

    await twitter.connect(owner).createTweet('Hello World!');
  });

  it('should return all the tweets', async () => {
    const tweets = await twitter.getTweets();

    expect(tweets.length).to.equal(1);
    expect(tweets[0].content).to.equal('Hello World!');
  });

  it('should create a new tweet', async () => {
    await twitter.createTweet('My second tweet');
    const tweets = await twitter.getTweets();

    expect(tweets.length).to.equal(2);
    expect(tweets[1].content).to.equal('My second tweet');
  });

  it("should be able to edit one's own tweet", async () => {
    await twitter.connect(owner).editTweet(0, 'Edited tweet');
    const tweets = await twitter.getTweets();

    expect(tweets.length).to.equal(1);
    expect(tweets[0].content).to.equal('Edited tweet');
  });

  it("should not be able to edit someone else's tweet", async () => {
    await expect(
      twitter.connect(otherAccount).editTweet(0, 'Edited tweet'),
    ).to.be.revertedWith('You are not the author of this tweet');
  });
});
