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

  it('should not be able to edit a tweet that has been deleted', async () => {
    await twitter.connect(owner).deleteTweet(0);

    expect(
      twitter.connect(owner).editTweet(0, 'Edited tweet'),
    ).to.be.revertedWith('This tweet has been deleted');
  });

  it('should be able to delete one of their own tweets', async () => {
    await twitter.connect(owner).deleteTweet(0);
    const tweets = await twitter.getTweets();

    expect(tweets.length).to.equal(0);
  });

  it("should not be able to delete someone else's tweet", async () => {
    await expect(
      twitter.connect(otherAccount).deleteTweet(0),
    ).to.be.revertedWith('You are not the author of this tweet');
  });

  it('should not be able to delete a tweet that has been deleted', async () => {
    await twitter.connect(owner).deleteTweet(0);

    expect(twitter.connect(owner).deleteTweet(0)).to.be.revertedWith(
      'This tweet has been deleted',
    );
  });

  it('should be able to withdraw the contract balance', async () => {
    await expect(twitter.connect(owner).withdraw()).not.to.be.reverted;
  });

  it('should not be able to withdraw if not the owner', async () => {
    await expect(twitter.connect(otherAccount).withdraw()).to.be.revertedWith(
      'Ownable: caller is not the owner',
    );
  });
});
